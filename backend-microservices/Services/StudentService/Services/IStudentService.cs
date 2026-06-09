using StudentService.DTOs;

namespace StudentService.Services;

public interface IStudentService
{
    Task<IReadOnlyList<StudentDto>> GetAllAsync();

    Task<StudentDto?> GetByIdAsync(int id);

    Task<StudentDto> CreateAsync(CreateStudentDto dto);

    Task<bool> UpdateAsync(int id, UpdateStudentDto dto);

    Task<bool> DeleteAsync(int id);

    Task<int?> GetStudentIdByUserIdAsync(int userId);
}