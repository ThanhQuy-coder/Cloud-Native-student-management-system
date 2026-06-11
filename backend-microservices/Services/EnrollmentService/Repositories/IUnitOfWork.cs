namespace EnrollmentService.Repositories;

public interface IUnitOfWork
{

    IEnrollmentRepository Enrollments { get; }

    Task<int> SaveChangesAsync();
}