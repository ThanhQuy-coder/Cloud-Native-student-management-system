using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Data;

namespace StudentManagement.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Retrieves all user records from the database, including related role information.
    /// </summary>
    /// <returns>A read-only list of <see cref="User"/> entities.</returns>
    public async Task<IReadOnlyList<User>> GetAllAsync()
    {
        return await _context.Users
            .Include(x => x.Role)
            .AsNoTracking()
            .ToListAsync();
    }

    /// <summary>
    /// Retrieves a single user record by its unique identifier, including related role information.
    /// </summary>
    /// <param name="id">The unique integer identifier of the user.</param>
    /// <returns>
    /// A <see cref="User"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    /// <summary>
    /// Retrieves a user record by its username, including related role information.
    /// </summary>
    /// <param name="username">The username of the user.</param>
    /// <returns>
    /// A <see cref="User"/> entity if found; otherwise, null.
    /// </returns>
    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(x => x.Role)
            .FirstOrDefaultAsync(x => x.Username == username);
    }

    /// <summary>
    /// Adds a new user record to the database.
    /// </summary>
    /// <param name="entity">The <see cref="User"/> entity to add.</param>
    public async Task AddAsync(User entity)
    {
        await _context.Users.AddAsync(entity);
    }

    /// <summary>
    /// Updates an existing user record in the database.
    /// </summary>
    /// <param name="entity">The <see cref="User"/> entity with updated values.</param>
    public void Update(User entity)
    {
        _context.Users.Update(entity);
    }

    /// <summary>
    /// Deletes an existing user record from the database.
    /// </summary>
    /// <param name="entity">The <see cref="User"/> entity to delete.</param>
    public void Delete(User entity)
    {
        _context.Users.Remove(entity);
    }
}