using EnrollmentService.DTOs;

namespace EnrollmentService.Services;

public interface IEnrollmentService
{
    Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto dto);

    Task<IReadOnlyList<EnrollmentDto>> GetSubjectsByStudentIdAsync(int studentId);

    Task<int?> GetStudentIdByUserIdAsync(int userId);

    Task<bool> DeleteAsync(int id);
}
