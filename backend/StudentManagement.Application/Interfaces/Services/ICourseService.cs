using StudentManagement.Application.DTOs.Subjects;

namespace StudentManagement.Application.Interfaces.Services;

public interface ICourseService
{
    Task<IReadOnlyList<SubjectDto>> GetAllAsync();

    Task<IReadOnlyList<SubjectDto>> GetByTeacherIdAsync(int teacherId);

    Task<SubjectDto?> GetByIdAsync(int id);

    Task<SubjectDto> CreateAsync(CreateSubjectDto dto);

    Task<bool> UpdateAsync(int id, UpdateSubjectDto dto);

    Task<bool> DeleteAsync(int id);
}
