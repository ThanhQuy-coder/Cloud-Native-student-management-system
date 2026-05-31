using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace Project.Application.Interfaces.Repositories;

public interface IClassRepository : IRepository<Class>
{
    Task<Class?> GetByClassCodeAsync(string classCode);
}