using Microsoft.Extensions.DependencyInjection;
using Project.Application.Services;
using StudentManagement.Application.Interfaces.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}