using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace Project.Application.Interfaces.Repositories;

public interface IStudentRepository : IRepository<Student>
{
    Task<Student?> GetByStudentCodeAsync(string studentCode);

    Task<Student?> GetByEmailAsync(string email);

    Task<IReadOnlyList<Student>> SearchAsync(string keyword);

    Task<IReadOnlyList<Student>> GetByClassIdAsync(int classId);
}