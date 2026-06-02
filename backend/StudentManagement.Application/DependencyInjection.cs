using Microsoft.Extensions.DependencyInjection;
using StudentManagement.Application.Services;
using StudentManagement.Application.Interfaces.Services;

public static class DependencyInjection
{
    // Registers application-level services for dependency injection.
    // Includes business logic services such as Student, Auth, Class, Course, Enrollment, and Grade.
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IStudentService, StudentService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IClassService, ClassService>();
        services.AddScoped<ICourseService, CourseService>();
        services.AddScoped<IEnrollmentService, EnrollmentService>();
        services.AddScoped<IGradeService, GradeService>();

        return services;
    }
}