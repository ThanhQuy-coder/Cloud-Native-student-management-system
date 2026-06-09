
using StudentService.DTOs;

namespace StudentService.Services
{
    public interface IClassService
    {
        Task<IReadOnlyList<ClassDto>> GetAllAsync();

        Task<ClassDto?> GetByIdAsync(int id);

        Task<ClassDto> CreateAsync(CreateClassDto dto);

        Task<bool> UpdateAsync(int id, UpdateClassDto dto);

        Task<bool> DeleteAsync(int id);
    }
}