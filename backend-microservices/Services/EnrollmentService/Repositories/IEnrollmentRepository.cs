using EnrollmentService.Models;

namespace EnrollmentService.Repositories;

public interface IEnrollmentRepository : IRepository<Enrollment>
{
    Task<Enrollment?> GetByStudentAndCourseAsync(int studentId, int courseId);

    Task<IReadOnlyList<Enrollment>> GetByStudentIdAsync(int studentId);

    Task<IReadOnlyList<Enrollment>> GetByCourseIdAsync(int courseId);

    Task<IReadOnlyList<Enrollment>> GetGradesByStudentIdAsync(int studentId);
}