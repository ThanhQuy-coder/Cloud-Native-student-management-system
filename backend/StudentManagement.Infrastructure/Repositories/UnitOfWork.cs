using Project.Application.Interfaces.Repositories;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Infrastructure.Data;

public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;

    public UnitOfWork(
        AppDbContext context,
        IStudentRepository students)
    {
        _context = context;
        Students = students;
    }

    public IStudentRepository Students { get; }

    public ICourseRepository Courses => throw new NotImplementedException();

    public IEnrollmentRepository Enrollments => throw new NotImplementedException();

    public IClassRepository Classes => throw new NotImplementedException();

    public IUserRepository Users => throw new NotImplementedException();

    public IRoleRepository Roles => throw new NotImplementedException();

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}