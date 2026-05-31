using StudentManagement.Application.DTOs.Enrollments;

namespace StudentManagement.Application.Interfaces.Services;

public interface IEnrollmentService
{
    Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto dto);

    Task<IReadOnlyList<EnrollmentDto>> GetSubjectsByStudentIdAsync(int studentId);

    Task<bool> DeleteAsync(int id);
}