using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using StudentService.Data;
using StudentService.Models;
using StudentService.Models.Events;

namespace StudentService.Services;

public class StudentUserCreatedConsumer : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly IConfiguration _configuration;

    public StudentUserCreatedConsumer(
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration)
    {
        _scopeFactory = scopeFactory;
        _configuration = configuration;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _configuration["RabbitMQ:Host"]!,
            Port = int.Parse(_configuration["RabbitMQ:Port"]!),
            UserName = _configuration["RabbitMQ:Username"]!,
            Password = _configuration["RabbitMQ:Password"]!
        };

        await using var connection = await factory.CreateConnectionAsync(stoppingToken);
        await using var channel = await connection.CreateChannelAsync(cancellationToken: stoppingToken);

        var exchange = _configuration["RabbitMQ:Exchange"]!;
        var queue = _configuration["RabbitMQ:Queue"]!;
        var routingKey = _configuration["RabbitMQ:RoutingKey"]!;

        await channel.ExchangeDeclareAsync(
            exchange: exchange,
            type: ExchangeType.Direct,
            durable: true,
            cancellationToken: stoppingToken
        );

        await channel.QueueDeclareAsync(
            queue: queue,
            durable: true,
            exclusive: false,
            autoDelete: false,
            cancellationToken: stoppingToken
        );

        await channel.QueueBindAsync(
            queue: queue,
            exchange: exchange,
            routingKey: routingKey,
            cancellationToken: stoppingToken
        );

        var consumer = new AsyncEventingBasicConsumer(channel);

        consumer.ReceivedAsync += async (_, eventArgs) =>
        {
            var json = Encoding.UTF8.GetString(eventArgs.Body.ToArray());

            var message = JsonSerializer.Deserialize<StudentUserCreatedEvent>(json);

            if (message is null)
                return;

            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<StudentDbContext>();

            var exists = await db.Students
                .AnyAsync(s => s.UserId == message.UserId, stoppingToken);

            if (!exists)
            {
                db.Students.Add(new Student
                {
                    UserId = message.UserId,
                    StudentCode = $"SV{message.UserId:D6}",
                    FullName = message.FullName,
                    Email = message.Email,
                    Dob = message.Dob,
                    Gender = message.Gender
                });

                await db.SaveChangesAsync(stoppingToken);
            }
        };

        await channel.BasicConsumeAsync(
            queue: queue,
            autoAck: true,
            consumer: consumer,
            cancellationToken: stoppingToken
        );

        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}