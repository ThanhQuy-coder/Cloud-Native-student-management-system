using Microsoft.EntityFrameworkCore;
using StudentService.Data;
using StudentService.Models;

namespace StudentService.Repositories;

public class ClassRepository : IClassRepository
{
    private readonly StudentDbContext _context;

    public ClassRepository(StudentDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all class records from the database.
    /// </summary>
    /// <returns>A read-only list of <see cref="Class"/> entities.</returns>
    public async Task<IReadOnlyList<Class>> GetAllAsync()
    {
        return await _context.Classes
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a single class record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the class.</param>
    /// <returns>
    /// A <see cref="Class"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Class?> GetByIdAsync(int id)
    {
        return await _context.Classes
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// Retrieves a class record by its class code.
    /// </summary>
    /// <param name="classCode">The unique code assigned to the class.</param>
    /// <returns>
    /// A <see cref="Class"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<Class?> GetByClassCodeAsync(string classCode)
    {
        return await _context.Classes
            .FirstOrDefaultAsync(x => x.ClassCode == classCode);
    }

    /// <summary>
    /// Adds a new class record to the database.
    /// </summary>
    /// <param name="entity">The <see cref="Class"/> entity to add.</param>
    public async Task AddAsync(Class entity)
    {
        await _context.Classes.AddAsync(entity);
    }

    /// <summary>
    /// Updates an existing class record in the database.
    /// </summary>
    /// <param name="entity">The <see cref="Class"/> entity with updated values.</param>
    public void Update(Class entity)
    {
        _context.Classes.Update(entity);
    }

    /// <summary>
    /// Deletes an existing class record from the database.
    /// </summary>
    /// <param name="entity">The <see cref="Class"/> entity to delete.</param>
    public void Delete(Class entity)
    {
        _context.Classes.Remove(entity);
    }
}