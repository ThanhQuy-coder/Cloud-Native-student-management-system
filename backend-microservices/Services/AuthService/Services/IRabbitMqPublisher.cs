using AuthService.Models.Events;

namespace AuthService.Services;

public interface IRabbitMqPublisher
{
    Task PublishStudentUserCreatedAsync(StudentUserCreatedEvent message);
}