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