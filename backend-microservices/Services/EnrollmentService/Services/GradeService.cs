using EnrollmentService.Data;
using EnrollmentService.DTOs;
using EnrollmentService.Models;
using EnrollmentService.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EnrollmentService.Services;

public class GradeService : IGradeService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly EnrollmentDbContext _dbContext;

    public GradeService(
        IUnitOfWork unitOfWork,
        EnrollmentDbContext dbContext)
    {
        _unitOfWork = unitOfWork;
        _dbContext = dbContext;
    }

    /// <summary>
    /// Creates a new grade record for a student enrollment.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateGradeDto"/>) containing the details
    /// required to create a new grade record.
    /// </param>
    /// <returns>
    /// A <see cref="GradeDto"/> object representing the newly created grade, including:
    /// <list type="bullet">
    ///   <item><description>EnrollmentId</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>ProcessScore</description></item>
    ///   <item><description>MidtermScore</description></item>
    ///   <item><description>FinalScore</description></item>
    ///   <item><description>TotalScore</description></item>
    ///   <item><description>GradeStatus</description></item>
    /// </list>
    /// Throws an exception if the enrollment does not exist.
    /// </returns>
    public async Task<GradeDto> CreateAsync(CreateGradeDto dto)
    {
        var enrollment = await _unitOfWork.Enrollments.GetByIdAsync(dto.EnrollmentId);

        if (enrollment is null)
            throw new Exception("Enrollment không tồn tại.");

        enrollment.ProcessScore = dto.ProcessScore;
        enrollment.MidtermScore = dto.MidtermScore;
        enrollment.FinalScore = dto.FinalScore;

        enrollment.CalculateGrade();

        _unitOfWork.Enrollments.Update(enrollment);
        await _unitOfWork.SaveChangesAsync();

        var updatedEnrollment = await _unitOfWork.Enrollments.GetByIdAsync(dto.EnrollmentId);

        return MapToGradeDto(updatedEnrollment!);
    }

    /// <summary>
    /// Updates an existing grade record by its enrollment identifier.
    /// </summary>
    /// <param name="enrollmentId">The unique integer identifier of the enrollment.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateGradeDto"/>) containing the updated
    /// grade details.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the grade record was successfully updated</description></item>
    ///   <item><description>false — if no enrollment record was found with the given id</description></item>
    /// </list>
    /// </returns>
    public async Task<bool> UpdateAsync(int enrollmentId, UpdateGradeDto dto)
    {
        var enrollment = await _unitOfWork.Enrollments.GetByIdAsync(enrollmentId);

        if (enrollment is null)
            return false;

        enrollment.ProcessScore = dto.ProcessScore;
        enrollment.MidtermScore = dto.MidtermScore;
        enrollment.FinalScore = dto.FinalScore;

        enrollment.CalculateGrade();

        _unitOfWork.Enrollments.Update(enrollment);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Retrieves all grade records for a student by their unique identifier.
    /// </summary>
    /// <param name="studentId">The unique integer identifier of the student.</param>
    /// <returns>
    /// A <see cref="IReadOnlyList{T}"/> of <see cref="GradeDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>EnrollmentId</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>ProcessScore</description></item>
    ///   <item><description>MidtermScore</description></item>
    ///   <item><description>FinalScore</description></item>
    ///   <item><description>TotalScore</description></item>
    ///   <item><description>GradeStatus</description></item>
    /// </list>
    /// Throws an exception if the student does not exist.
    /// </returns>
    public async Task<IReadOnlyList<GradeDto>> GetGradesByStudentIdAsync(int studentId)
    {
        var enrollments = await _unitOfWork.Enrollments.GetGradesByStudentIdAsync(studentId);

        return enrollments.Select(MapToGradeDto).ToList();
    }

    public async Task<int?> GetStudentIdByUserIdAsync(int userId)
    {
        return await _dbContext.StudentReferences
            .Where(x => x.UserId == userId)
            .Select(x => (int?)x.StudentId)
            .FirstOrDefaultAsync();
    }

    /// <summary>
    /// Maps an enrollment entity to a grade data transfer object.
    /// </summary>
    /// <param name="enrollment">The enrollment entity to map.</param>
    /// <returns>
    /// A <see cref="GradeDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>EnrollmentId</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>ProcessScore</description></item>
    ///   <item><description>MidtermScore</description></item>
    ///   <item><description>FinalScore</description></item>
    ///   <item><description>TotalScore</description></item>
    ///   <item><description>GradeStatus</description></item>
    /// </list>
    /// </returns>
    private static GradeDto MapToGradeDto(Enrollment enrollment)
    {
        return new GradeDto
        {
            EnrollmentId = enrollment.Id,

            StudentId = enrollment.StudentId,

            SubjectId = enrollment.CourseId,
            Semester = enrollment.Semester,

            ProcessScore = enrollment.ProcessScore,
            MidtermScore = enrollment.MidtermScore,
            FinalScore = enrollment.FinalScore,

            TotalScore = enrollment.TotalScore,
            GradeStatus = enrollment.GradeStatus
        };
    }
}
