using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Interfaces.Repositories;

public interface ICourseRepository : IRepository<Course>
{
    Task<Course?> GetByCourseCodeAsync(string courseCode);

    Task<IReadOnlyList<Course>> SearchAsync(string keyword);

    Task<IReadOnlyList<Course>> GetByTeacherIdAsync(int teacherId);
}