using System.Text;
using AcademicService.Data;
using AcademicService.Repositories;
using AcademicService.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StudentManagement.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"]!;
var allowOrigin = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;

// Configure CORS to frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactVite", policy =>
    {
        policy.WithOrigins(allowOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Hỗ trợ nếu sau này bạn dùng Cookie/Credentials
    });
});

builder.Services.AddDbContext<AcademicDbContext>(options =>
{
    var connectionString = GetDefaultConnectionString(builder.Configuration);

    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    );
});

// Configure JWT authentication with validation rules
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddOpenApi();
builder.Services.AddAuthorization();
builder.Services.AddControllers();

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICourseRepository, CourseRepository>();
builder.Services.AddScoped<ICourseService, CourseService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactVite");
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

app.MapControllers();
app.Run();

static string GetDefaultConnectionString(IConfiguration configuration)
{
    var connectionString = configuration.GetConnectionString("DefaultConnection");

    if (!string.IsNullOrWhiteSpace(connectionString))
        return connectionString;

    return $"server={configuration["Database:Host"]};port={configuration["Database:Port"]};database={configuration["Database:Name"]};user={configuration["Database:User"]};password={configuration["Database:Password"]};";
}
