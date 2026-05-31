using Microsoft.Extensions.DependencyInjection;
using StudentManagement.Application.Interfaces.Services;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IStudentService, StudentService>();

        return services;
    }
}