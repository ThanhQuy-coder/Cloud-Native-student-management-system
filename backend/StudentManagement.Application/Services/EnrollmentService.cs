using StudentManagement.Application.DTOs.Enrollments;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public class EnrollmentService : IEnrollmentService
{
    private readonly IUnitOfWork _unitOfWork;

    public EnrollmentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<EnrollmentDto> CreateAsync(CreateEnrollmentDto dto)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(dto.StudentId);

        if (student is null)
            throw new Exception("Student không tồn tại.");

        var course = await _unitOfWork.Courses.GetByIdAsync(dto.SubjectId);

        if (course is null)
            throw new Exception("Subject không tồn tại.");

        var existedEnrollment =
            await _unitOfWork.Enrollments.GetByStudentAndCourseAsync(
                dto.StudentId,
                dto.SubjectId);

        if (existedEnrollment is not null)
            throw new Exception("Sinh viên đã đăng ký môn học này.");

        var enrollment = new Enrollment
        {
            StudentId = dto.StudentId,
            CourseId = dto.SubjectId
        };

        await _unitOfWork.Enrollments.AddAsync(enrollment);
        await _unitOfWork.SaveChangesAsync();

        return new EnrollmentDto
        {
            Id = enrollment.Id,
            StudentId = student.Id,
            StudentCode = student.StudentCode,
            StudentName = student.FullName,
            SubjectId = course.Id,
            SubjectCode = course.CourseCode,
            SubjectName = course.CourseName,
            Credits = course.Credits
        };
    }

    public async Task<IReadOnlyList<EnrollmentDto>> GetSubjectsByStudentIdAsync(int studentId)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(studentId);

        if (student is null)
            throw new Exception("Student không tồn tại.");

        var enrollments = await _unitOfWork.Enrollments.GetByStudentIdAsync(studentId);

        return enrollments.Select(x => new EnrollmentDto
        {
            Id = x.Id,
            StudentId = x.StudentId,
            StudentCode = x.Student.StudentCode,
            StudentName = x.Student.FullName,
            SubjectId = x.CourseId,
            SubjectCode = x.Course.CourseCode,
            SubjectName = x.Course.CourseName,
            Credits = x.Course.Credits
        }).ToList();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var enrollment = await _unitOfWork.Enrollments.GetByIdAsync(id);

        if (enrollment is null)
            return false;

        _unitOfWork.Enrollments.Delete(enrollment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}