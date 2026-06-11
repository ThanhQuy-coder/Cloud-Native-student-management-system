using AcademicService.DTOs;
using AcademicService.Models;
using AcademicService.Repositories;

namespace AcademicService.Services;

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
    public async Task<IReadOnlyList<SubjectDto>> GetAllAsync()
    {
        var courses = await _unitOfWork.Courses.GetAllAsync();

        return courses.Select(MapToDto).ToList();
    }

    public async Task<IReadOnlyList<SubjectDto>> GetByTeacherIdAsync(int teacherId)
    {
        var courses = await _unitOfWork.Courses.GetByTeacherIdAsync(teacherId);

        return courses.Select(MapToDto).ToList();
    }

    /// <summary>
    /// Retrieves a single subject record by its unique identifier.
    /// </summary>
    public async Task<SubjectDto?> GetByIdAsync(int id)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(id);

        if (course is null)
            return null;

        return MapToDto(course);
    }

    /// <summary>
    /// Creates a new subject record in the system.
    /// </summary>
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

        return MapToDto(course);
    }

    /// <summary>
    /// Updates an existing subject record by its unique identifier (Cho phép sửa cả mã môn).
    /// </summary>
    public async Task<bool> UpdateAsync(int id, UpdateSubjectDto dto)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(id);

        if (course is null)
            return false;

        // Nếu mã môn học bị thay đổi so với mã cũ trong database
        if (course.CourseCode != dto.SubjectCode)
        {
            // Kiểm tra xem mã môn mới định đổi đã tồn tại ở một môn học khác chưa
            var duplicateCodeSubject = await _unitOfWork.Courses.GetByCourseCodeAsync(dto.SubjectCode);
            if (duplicateCodeSubject is not null)
            {
                throw new Exception("Mã môn học mới đã tồn tại trong hệ thống.");
            }
        }

        // Cập nhật tất cả các trường dữ liệu bao gồm cả CourseCode mới
        course.CourseCode = dto.SubjectCode;
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
    public async Task<bool> DeleteAsync(int id)
    {
        var course = await _unitOfWork.Courses.GetByIdAsync(id);

        if (course is null)
            return false;

        _unitOfWork.Courses.Delete(course);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    private static SubjectDto MapToDto(Course course)
    {
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
}
