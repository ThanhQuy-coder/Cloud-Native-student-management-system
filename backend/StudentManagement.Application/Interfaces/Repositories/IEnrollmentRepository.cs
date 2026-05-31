using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace Project.Application.Interfaces.Repositories;

public interface IEnrollmentRepository : IRepository<Enrollment>
{
    Task<Enrollment?> GetByStudentAndCourseAsync(int studentId, int courseId);

    Task<IReadOnlyList<Enrollment>> GetByStudentIdAsync(int studentId);

    Task<IReadOnlyList<Enrollment>> GetByCourseIdAsync(int courseId);
}