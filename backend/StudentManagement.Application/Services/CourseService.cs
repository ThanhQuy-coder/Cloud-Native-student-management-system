using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Application.DTOs.Subjects;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public class CourseService : ICourseService
{
    private readonly IUnitOfWork _unitOfWork;

    public CourseService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieves all subject records from the system.
    /// </summary>
    /// <returns>
    /// A <see cref="IReadOnlyList{T}"/> of <see cref="SubjectDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    ///   <item><description>Description</description></item>
    ///   <item><description>TeacherId</description></item>
    ///   <item><description>Status</description></item>
    /// </list>
    /// </returns>
    public async Task<IReadOnlyList<SubjectDto>> GetAllAsync()
    {
        var courses = await _unitOfWork.Courses.GetAllAsync();

        return courses.Select(x => new SubjectDto
        {
            Id = x.Id,
            SubjectCode = x.CourseCode,
            SubjectName = x.CourseName,
            Credits = x.Credits,
            Description = x.Description,
            TeacherId = x.TeacherId,
            Status = x.Status
        }).ToList();
    }

    /// <summary>
    /// Retrieves a single subject record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the subject.</param>
    /// <returns>
    /// A <see cref="SubjectDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    ///   <item><description>Description</description></item>
    ///   <item><description>TeacherId</description></item>
    ///   <item><description>Status</description></item>
    /// </list>
    /// Returns null if no subject is found with the given id.
    /// </returns>
    public async Task<SubjectDto?> GetByIdAsync(int id)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(id);

        if (course is null)
            return null;

        return new SubjectDto
        {
            Id = course.Id,
            SubjectCode = course.CourseCode,
            SubjectName = course.CourseName,
            Credits = course.Credits,
            Description = course.Description,
            TeacherId = course.TeacherId,
            Status = course.Status
        };
    }

    /// <summary>
    /// Creates a new subject record in the system.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateSubjectDto"/>) containing the details
    /// required to create a new subject record.
    /// </param>
    /// <returns>
    /// A <see cref="SubjectDto"/> object representing the newly created subject, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    ///   <item><description>Description</description></item>
    ///   <item><description>TeacherId</description></item>
    ///   <item><description>Status</description></item>
    /// </list>
    /// Throws an exception if the SubjectCode already exists.
    /// </returns>
    public async Task<SubjectDto> CreateAsync(CreateSubjectDto dto)
    {
        var existedCourse = await _unitOfWork.Courses.GetByCourseCodeAsync(dto.SubjectCode);

        if (existedCourse is not null)
            throw new Exception("SubjectCode đã tồn tại.");

        var course = new Course
        {
            CourseCode = dto.SubjectCode,
            CourseName = dto.SubjectName,
            Credits = dto.Credits,
            Description = dto.Description,
            TeacherId = dto.TeacherId,
            Status = "Mở"
        };

        await _unitOfWork.Courses.AddAsync(course);
        await _unitOfWork.SaveChangesAsync();

        return new SubjectDto
        {
            Id = course.Id,
            SubjectCode = course.CourseCode,
            SubjectName = course.CourseName,
            Credits = course.Credits,
            Description = course.Description,
            TeacherId = course.TeacherId,
            Status = course.Status
        };
    }

    /// <summary>
    /// Updates an existing subject record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the subject to update.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateSubjectDto"/>) containing the updated
    /// details for the subject record.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the subject record was successfully updated</description></item>
    ///   <item><description>false — if no subject record was found with the given id</description></item>
    /// </list>
    /// </returns>
    public async Task<bool> UpdateAsync(int id, UpdateSubjectDto dto)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(id);

        if (course is null)
            return false;

        course.CourseName = dto.SubjectName;
        course.Credits = dto.Credits;
        course.Description = dto.Description;
        course.TeacherId = dto.TeacherId;
        course.Status = dto.Status;

        _unitOfWork.Courses.Update(course);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Deletes an existing subject record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the subject to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the subject record was successfully deleted</description></item>
    ///   <item><description>false — if no subject record was found with the given id</description></item>
    /// </list>
    /// </returns>
    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(id);

        if (course is null)
            return false;

        _unitOfWork.Courses.Delete(course);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}