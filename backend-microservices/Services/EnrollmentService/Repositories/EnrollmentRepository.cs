using EnrollmentService.Data;
using EnrollmentService.Models;
using Microsoft.EntityFrameworkCore;

namespace EnrollmentService.Repositories;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly EnrollmentDbContext _context;

    public EnrollmentRepository(EnrollmentDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all enrollment records from the database, including related student and course information.
    /// </summary>
    /// <returns>A read-only list of <see cref="Enrollment"/> entities.</returns>
    public async Task<IReadOnlyList<Enrollment>> GetAllAsync()
    {
        return await _context.Enrollments
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a single enrollment record by its unique identifier, including related student and course information.
    /// </summary>
    /// <param name="id">The unique integer identifier of the enrollment.</param>
    /// <returns>
    /// An <see cref="Enrollment"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Enrollment?> GetByIdAsync(int id)
    {
        return await _context.Enrollments
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// Retrieves an enrollment record by student and course identifiers.
    /// </summary>
    /// <param name="studentId">The unique integer identifier of the student.</param>
    /// <param name="courseId">The unique integer identifier of the course.</param>
    /// <returns>
    /// An <see cref="Enrollment"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Enrollment?> GetByStudentAndCourseAsync(int studentId, int courseId)
    {
        return await _context.Enrollments
            .FirstOrDefaultAsync(x =>
                x.StudentId == studentId &&
                x.CourseId == courseId);
    }

    /// <summary>
    /// Retrieves all enrollment records for a specific student, including related student and course information.
    /// </summary>
    /// <param name="studentId">The unique integer identifier of the student.</param>
    /// <returns>
    /// A read-only list of <see cref="Enrollment"/> entities associated with the student.
    /// </returns>
    public async Task<IReadOnlyList<Enrollment>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Enrollments
            .Where(x => x.StudentId == studentId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves all enrollment records for a specific course, including related student and course information.
    /// </summary>
    /// <param name="courseId">The unique integer identifier of the course.</param>
    /// <returns>
    /// A read-only list of <see cref="Enrollment"/> entities associated with the course.
    /// </returns>
    /// TODO: Dead code get Enrollment by Course Id
    public async Task<IReadOnlyList<Enrollment>> GetByCourseIdAsync(int courseId)
    {
        return await _context.Enrollments
            .Where(x => x.CourseId == courseId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Adds a new enrollment record to the database.
    /// </summary>
    /// <param name="entity">The <see cref="Enrollment"/> entity to add.</param>
    public async Task AddAsync(Enrollment entity)
    {
        await _context.Enrollments.AddAsync(entity);
    }

    /// <summary>
    /// Updates an existing enrollment record in the database.
    /// </summary>
    /// <param name="entity">The <see cref="Enrollment"/> entity with updated values.</param>
    public void Update(Enrollment entity)
    {
        _context.Enrollments.Update(entity);
    }

    /// <summary>
    /// Deletes an existing enrollment record from the database.
    /// </summary>
    /// <param name="entity">The <see cref="Enrollment"/> entity to delete.</param>
    public void Delete(Enrollment entity)
    {
        _context.Enrollments.Remove(entity);
    }

    /// <summary>
    /// Retrieves all grade-related enrollment records for a specific student, including related student and course information.
    /// </summary>
    /// <param name="studentId">The unique integer identifier of the student.</param>
    /// <returns>
    /// A read-only list of <see cref="Enrollment"/> entities containing grade details for the student.
    /// </returns>
    public async Task<IReadOnlyList<Enrollment>> GetGradesByStudentIdAsync(int studentId)
    {
        return await _context.Enrollments
            .Where(x => x.StudentId == studentId)
            .AsNoTracking()
            .ToListAsync();
    }
}