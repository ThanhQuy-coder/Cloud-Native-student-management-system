using StudentService.Models;

namespace StudentService.Repositories;

public interface IClassRepository : IRepository<Class>
{
    Task<Class?> GetByClassCodeAsync(string classCode);
}