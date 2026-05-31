using StudentManagement.Application.DTOs.Grades;

namespace StudentManagement.Application.Interfaces.Services;

public interface IGradeService
{
    Task<GradeDto> CreateAsync(CreateGradeDto dto);

    Task<bool> UpdateAsync(int enrollmentId, UpdateGradeDto dto);

    Task<IReadOnlyList<GradeDto>> GetGradesByStudentIdAsync(int studentId);
}