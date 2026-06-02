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
    /// <returns>
    /// A <see cref="IReadOnlyList{T}"/> of <see cref="ClassDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>ClassCode</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>Major</description></item>
    ///   <item><description>AcademicYear</description></item>
    ///   <item><description>AcademicAdvisor</description></item>
    /// </list>
    /// </returns>
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
    /// <param name="id">The unique integer identifier of the class.</param>
    /// <returns>
    /// A <see cref="ClassDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>ClassCode</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>Major</description></item>
    ///   <item><description>AcademicYear</description></item>
    ///   <item><description>AcademicAdvisor</description></item>
    /// </list>
    /// Returns null if no class is found with the given id.
    /// </returns>
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
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateClassDto"/>) containing the details
    /// required to create a new class record.
    /// </param>
    /// <returns>
    /// A <see cref="ClassDto"/> object representing the newly created class, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>ClassCode</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>Major</description></item>
    ///   <item><description>AcademicYear</description></item>
    ///   <item><description>AcademicAdvisor</description></item>
    /// </list>
    /// Throws an exception if the ClassCode already exists.
    /// </returns>
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
    /// Updates an existing class record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the class to update.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateClassDto"/>) containing the updated
    /// details for the class record.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the class record was successfully updated</description></item>
    ///   <item><description>false — if no class record was found with the given id</description></item>
    /// </list>
    /// </returns>
    public async Task<bool> UpdateAsync(int id, UpdateClassDto dto)
    {
        var cls = await _unitOfWork.Classes.GetByIdAsync(id);

        if (cls is null)
            return false;

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
    /// <param name="id">The unique integer identifier of the class to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the class record was successfully deleted</description></item>
    ///   <item><description>false — if no class record was found with the given id</description></item>
    /// </list>
    /// </returns>
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