using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Interfaces.Repositories;

public interface IClassRepository : IRepository<Class>
{
    Task<Class?> GetByClassCodeAsync(string classCode);
}