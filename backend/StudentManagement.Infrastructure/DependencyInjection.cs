using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Infrastructure.Repositories;
using StudentManagement.Infrastructure.Services;
using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Infrastructure.Data;

namespace StudentManagement.Infrastructure
{
    public static class DependencyInjection
    {
        // Registers infrastructure services and repositories for dependency injection.
        // Includes DbContext setup with MySQL and scoped services for repositories and JWT token service.
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            // Configure EF Core DbContext with MySQL provider
            services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(
                    connectionString,
                    ServerVersion.AutoDetect(connectionString)
                ));

            // Register repositories and services for DI
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<IClassRepository, ClassRepository>();
            services.AddScoped<ICourseRepository, CourseRepository>();
            services.AddScoped<IEnrollmentRepository, EnrollmentRepository>();

            return services;
        }
    }
}