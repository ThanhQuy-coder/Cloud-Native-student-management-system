using Microsoft.EntityFrameworkCore;
using StudentService.Data;
using StudentService.Models;

namespace StudentService.Repositories;

public class StudentRepository : IStudentRepository
{
    private readonly StudentDbContext _context;

    public StudentRepository(StudentDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all student records from the database, including related class information.
    /// </summary>
    /// <returns>A read-only list of <see cref="Student"/> entities.</returns>
    public async Task<IReadOnlyList<Student>> GetAllAsync()
    {
        return await _context.Students
            .Include(x => x.Class)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a single student record by its unique identifier, including related class information.
    /// </summary>
    /// <param name="id">The unique integer identifier of the student.</param>
    /// <returns>
    /// A <see cref="Student"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Student?> GetByIdAsync(int id)
    {
        Console.WriteLine(id);
        return await _context.Students
            .Include(x => x.Class)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// Adds a new student record to the database.
    /// </summary>
    /// <param name="entity">The <see cref="Student"/> entity to add.</param>
    public async Task AddAsync(Student entity)
    {
        await _context.Students.AddAsync(entity);
    }

    /// <summary>
    /// Updates an existing student record in the database.
    /// </summary>
    /// <param name="entity">The <see cref="Student"/> entity with updated values.</param>
    public void Update(Student entity)
    {
        _context.Students.Update(entity);
    }

    /// <summary>
    /// Deletes an existing student record from the database.
    /// </summary>
    /// <param name="entity">The <see cref="Student"/> entity to delete.</param>
    public void Delete(Student entity)
    {
        _context.Students.Remove(entity);
    }

    /// <summary>
    /// Retrieves a student record by its student code.
    /// </summary>
    /// <param name="studentCode">The unique code assigned to the student.</param>
    /// <returns>
    /// A <see cref="Student"/> entity if found; otherwise, null.
    /// </returns>
    /// TODO: Dead code find student by student code
    public async Task<Student?> GetByStudentCodeAsync(string studentCode)
    {
        return await _context.Students
            .FirstOrDefaultAsync(x => x.StudentCode == studentCode);
    }

    /// <summary>
    /// Retrieves a student record by its email address.
    /// </summary>
    /// <param name="email">The email address of the student.</param>
    /// <returns>
    /// A <see cref="Student"/> entity if found; otherwise, null.
    /// </returns>
    /// TODO: Dead code find student by email
    public async Task<Student?> GetByEmailAsync(string email)
    {
        return await _context.Students
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    /// <summary>
    /// Searches for student records that match the given keyword in either student code or full name.
    /// </summary>
    /// <param name="keyword">The keyword used to filter students.</param>
    /// <returns>
    /// A read-only list of <see cref="Student"/> entities that match the search criteria.
    /// </returns>
    /// TODO: Dead code find student by keyword
    public async Task<IReadOnlyList<Student>> SearchAsync(string keyword)
    {
        return await _context.Students
            .Where(x => x.StudentCode.Contains(keyword)
                     || x.FullName.Contains(keyword))
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves all student records belonging to a specific class.
    /// </summary>
    /// <param name="classId">The unique integer identifier of the class.</param>
    /// <returns>
    /// A read-only list of <see cref="Student"/> entities associated with the class.
    /// </returns>
    /// TODO: Dead code get student information by class Id
    public async Task<IReadOnlyList<Student>> GetByClassIdAsync(int classId)
    {
        return await _context.Students
            .Where(x => x.ClassId == classId)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a student entity by the associated UserId.
    /// Returns null if no student record is found.
    /// </summary>
    /// <param name="userId">The unique identifier of the user</param>
    public async Task<Student?> GetByUserIdAsync(int userId)
    {
        return await _context.Students
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.UserId == userId);
    }
}