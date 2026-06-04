using StudentManagement.Application.DTOs.Classes;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public class ClassService : IClassService
{
    private readonly IUnitOfWork _unitOfWork;

    public ClassService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieves all class records from the system.
    /// </summary>
    public async Task<IReadOnlyList<ClassDto>> GetAllAsync()
    {
        var classes = await _unitOfWork.Classes.GetAllAsync();

        return classes.Select(x => new ClassDto
        {
            Id = x.Id,
            ClassCode = x.ClassCode,
            ClassName = x.ClassName,
            Major = x.Major,
            AcademicYear = x.AcademicYear,
            AcademicAdvisor = x.AcademicAdvisor
        }).ToList();
    }

    /// <summary>
    /// Retrieves a single class record by its unique identifier.
    /// </summary>
    public async Task<ClassDto?> GetByIdAsync(int id)
    {
        var cls = await _unitOfWork.Classes.GetByIdAsync(id);

        if (cls is null)
            return null;

        return new ClassDto
        {
            Id = cls.Id,
            ClassCode = cls.ClassCode,
            ClassName = cls.ClassName,
            Major = cls.Major,
            AcademicYear = cls.AcademicYear,
            AcademicAdvisor = cls.AcademicAdvisor
        };
    }

    /// <summary>
    /// Creates a new class record in the system.
    /// </summary>
    public async Task<ClassDto> CreateAsync(CreateClassDto dto)
    {
        var existedClass = await _unitOfWork.Classes.GetByClassCodeAsync(dto.ClassCode);

        if (existedClass is not null)
            throw new Exception("ClassCode đã tồn tại.");

        var cls = new Class
        {
            ClassCode = dto.ClassCode,
            ClassName = dto.ClassName,
            Major = dto.Major,
            AcademicYear = dto.AcademicYear,
            AcademicAdvisor = dto.AcademicAdvisor
        };

        await _unitOfWork.Classes.AddAsync(cls);
        await _unitOfWork.SaveChangesAsync();

        return new ClassDto
        {
            Id = cls.Id,
            ClassCode = cls.ClassCode,
            ClassName = cls.ClassName,
            Major = cls.Major,
            AcademicYear = cls.AcademicYear,
            AcademicAdvisor = cls.AcademicAdvisor
        };
    }

    /// <summary>
    /// Updates an existing class record by its unique identifier (Cho phép sửa cả mã lớp).
    /// </summary>
    public async Task<bool> UpdateAsync(int id, UpdateClassDto dto)
    {
        var cls = await _unitOfWork.Classes.GetByIdAsync(id);

        if (cls is null)
            return false;

        // Nếu mã lớp bị thay đổi so với mã cũ trong database
        if (cls.ClassCode != dto.ClassCode)
        {
            // Kiểm tra xem mã mới định đổi có bị trùng với một lớp khác sẵn có không
            var duplicateCodeClass = await _unitOfWork.Classes.GetByClassCodeAsync(dto.ClassCode);
            if (duplicateCodeClass is not null)
            {
                throw new Exception("Mã lớp mới bị trùng với một lớp học khác trong hệ thống.");
            }
        }

        // Cập nhật tất cả các trường dữ liệu bao gồm cả ClassCode mới
        cls.ClassCode = dto.ClassCode;
        cls.ClassName = dto.ClassName;
        cls.Major = dto.Major;
        cls.AcademicYear = dto.AcademicYear;
        cls.AcademicAdvisor = dto.AcademicAdvisor;

        _unitOfWork.Classes.Update(cls);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Deletes an existing class record by its unique identifier.
    /// </summary>
    public async Task<bool> DeleteAsync(int id)
    {
        var cls = await _unitOfWork.Classes.GetByIdAsync(id);

        if (cls is null)
            return false;

        _unitOfWork.Classes.Delete(cls);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}