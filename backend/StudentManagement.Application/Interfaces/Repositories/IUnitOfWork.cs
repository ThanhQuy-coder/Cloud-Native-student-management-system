using StudentManagement.Application.Interfaces.Repositories;

namespace StudentManagement.Application.Interfaces.Repositories;

public interface IUnitOfWork
{
    IStudentRepository Students { get; }

    ICourseRepository Courses { get; }

    IEnrollmentRepository Enrollments { get; }

    IClassRepository Classes { get; }

    IUserRepository Users { get; }

    IRoleRepository Roles { get; }

    Task<int> SaveChangesAsync();
}