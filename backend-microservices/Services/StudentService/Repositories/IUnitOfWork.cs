namespace StudentService.Repositories;

public interface IUnitOfWork
{
    IStudentRepository Students { get; }
    
    IClassRepository Classes { get; }

    Task<int> SaveChangesAsync();
}