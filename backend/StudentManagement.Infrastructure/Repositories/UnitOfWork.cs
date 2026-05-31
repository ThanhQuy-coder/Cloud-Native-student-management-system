using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(
        AppDbContext context,
        IStudentRepository students,
        IClassRepository classes,
        ICourseRepository courses,
        IEnrollmentRepository enrollments,
        IUserRepository users,
        IRoleRepository roles)
    {
        _context = context;
        Students = students;
        Classes = classes;
        Courses = courses;
        Enrollments = enrollments;
        Users = users;
        Roles = roles;
    }

    public IStudentRepository Students { get; }

    public ICourseRepository Courses { get; }

    public IEnrollmentRepository Enrollments { get; }

    public IClassRepository Classes { get; }

    public IUserRepository Users { get; }

    public IRoleRepository Roles { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}