namespace AcademicService.Repositories;

public interface IUnitOfWork
{

    ICourseRepository Courses { get; }

    Task<int> SaveChangesAsync();
}