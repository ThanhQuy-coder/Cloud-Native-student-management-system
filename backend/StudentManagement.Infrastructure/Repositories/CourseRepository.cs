using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Data;

namespace StudentManagement.Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _context;

    public CourseRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all course records from the database.
    /// </summary>
    /// <returns>A read-only list of <see cref="Course"/> entities.</returns>
    public async Task<IReadOnlyList<Course>> GetAllAsync()
    {
        return await _context.Courses
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a single course record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the course.</param>
    /// <returns>
    /// A <see cref="Course"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// Retrieves a course record by its course code.
    /// </summary>
    /// <param name="courseCode">The unique code assigned to the course.</param>
    /// <returns>
    /// A <see cref="Course"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Course?> GetByCourseCodeAsync(string courseCode)
    {
        return await _context.Courses
            .FirstOrDefaultAsync(x => x.CourseCode == courseCode);
    }

    /// <summary>
    /// Searches for course records that match the given keyword in either course code or course name.
    /// </summary>
    /// <param name="keyword">The keyword used to filter courses.</param>
    /// <returns>
    /// A read-only list of <see cref="Course"/> entities that match the search criteria.
    /// </returns>
    /// TODO: Dead code search course
    [Obsolete("Not yet used")]
    public async Task<IReadOnlyList<Course>> SearchAsync(string keyword)
    {
        return await _context.Courses
            .Where(x => x.CourseCode.Contains(keyword)
                     || x.CourseName.Contains(keyword))
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves all course records assigned to a specific teacher.
    /// </summary>
    /// <param name="teacherId">The unique integer identifier of the teacher.</param>
    /// <returns>
    /// A read-only list of <see cref="Course"/> entities taught by the specified teacher.
    /// </returns>
    /// TODO: Dead code get course by teacher Id
    public async Task<IReadOnlyList<Course>> GetByTeacherIdAsync(int teacherId)
    {
        return await _context.Courses
            .Where(x => x.TeacherId == teacherId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Adds a new course record to the database.
    /// </summary>
    /// <param name="entity">The <see cref="Course"/> entity to add.</param>
    public async Task AddAsync(Course entity)
    {
        await _context.Courses.AddAsync(entity);
    }

    /// <summary>
    /// Updates an existing course record in the database.
    /// </summary>
    /// <param name="entity">The <see cref="Course"/> entity with updated values.</param>
    public void Update(Course entity)
    {
        _context.Courses.Update(entity);
    }

    /// <summary>
    /// Deletes an existing course record from the database.
    /// </summary>
    /// <param name="entity">The <see cref="Course"/> entity to delete.</param>
    public void Delete(Course entity)
    {
        _context.Courses.Remove(entity);
    }
}