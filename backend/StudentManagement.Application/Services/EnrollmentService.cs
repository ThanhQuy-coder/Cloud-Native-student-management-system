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

    /// <summary>
    /// Creates a new enrollment record for a student in a subject.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateEnrollmentDto"/>) containing the details
    /// required to create a new enrollment.
    /// </param>
    /// <returns>
    /// An <see cref="EnrollmentDto"/> object representing the newly created enrollment, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    /// </list>
    /// Throws an exception if the student or subject does not exist, or if the student is already enrolled in the subject.
    /// </returns>
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
            CourseId = dto.SubjectId,
            Semester = string.IsNullOrWhiteSpace(dto.Semester) ? "HK1 2026" : dto.Semester.Trim(),
            Status = "Đang học"
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
            Credits = course.Credits,
            Semester = enrollment.Semester,
            Status = enrollment.Status
        };
    }

    /// <summary>
    /// Retrieves all subjects that a student is enrolled in by their unique identifier.
    /// </summary>
    /// <param name="studentId">The unique integer identifier of the student.</param>
    /// <returns>
    /// A <see cref="IReadOnlyList{T}"/> of <see cref="EnrollmentDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    /// </list>
    /// Throws an exception if the student does not exist.
    /// </returns>
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
            Credits = x.Course.Credits,
            Semester = x.Semester,
            Status = x.Status
        }).ToList();
    }

    /// <summary>
    /// Deletes an existing enrollment record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the enrollment to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the enrollment record was successfully deleted</description></item>
    ///   <item><description>false — if no enrollment record was found with the given id</description></item>
    /// </list>
    /// </returns>
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
