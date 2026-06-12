using EnrollmentService.DTOs;

namespace EnrollmentService.Services;

public interface IGradeService
{
    Task<GradeDto> CreateAsync(CreateGradeDto dto);

    Task<bool> UpdateAsync(int enrollmentId, UpdateGradeDto dto);

    Task<IReadOnlyList<GradeDto>> GetGradesByStudentIdAsync(int studentId);

    Task<int?> GetStudentIdByUserIdAsync(int userId);
}
