using StudentManagement.Application.DTOs.Grades;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Services;

public class GradeService : IGradeService
{
    private readonly IUnitOfWork _unitOfWork;

    public GradeService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<GradeDto> CreateAsync(CreateGradeDto dto)
    {
        var enrollment = await _unitOfWork.Enrollments.GetByIdAsync(dto.EnrollmentId);

        if (enrollment is null)
            throw new Exception("Enrollment không tồn tại.");

        enrollment.ProcessScore = dto.ProcessScore;
        enrollment.MidtermScore = dto.MidtermScore;
        enrollment.FinalScore = dto.FinalScore;

        _unitOfWork.Enrollments.Update(enrollment);
        await _unitOfWork.SaveChangesAsync();

        var updatedEnrollment = await _unitOfWork.Enrollments.GetByIdAsync(dto.EnrollmentId);

        return MapToGradeDto(updatedEnrollment!);
    }

    public async Task<bool> UpdateAsync(int enrollmentId, UpdateGradeDto dto)
    {
        var enrollment = await _unitOfWork.Enrollments.GetByIdAsync(enrollmentId);

        if (enrollment is null)
            return false;

        enrollment.ProcessScore = dto.ProcessScore;
        enrollment.MidtermScore = dto.MidtermScore;
        enrollment.FinalScore = dto.FinalScore;

        _unitOfWork.Enrollments.Update(enrollment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<IReadOnlyList<GradeDto>> GetGradesByStudentIdAsync(int studentId)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(studentId);

        if (student is null)
            throw new Exception("Student không tồn tại.");

        var enrollments = await _unitOfWork.Enrollments.GetGradesByStudentIdAsync(studentId);

        return enrollments.Select(MapToGradeDto).ToList();
    }

    private static GradeDto MapToGradeDto(Enrollment enrollment)
    {
        return new GradeDto
        {
            EnrollmentId = enrollment.Id,

            StudentId = enrollment.StudentId,
            StudentCode = enrollment.Student.StudentCode,
            StudentName = enrollment.Student.FullName,

            SubjectId = enrollment.CourseId,
            SubjectCode = enrollment.Course.CourseCode,
            SubjectName = enrollment.Course.CourseName,

            ProcessScore = enrollment.ProcessScore,
            MidtermScore = enrollment.MidtermScore,
            FinalScore = enrollment.FinalScore,

            TotalScore = enrollment.TotalScore,
            GradeStatus = enrollment.GradeStatus
        };
    }
}