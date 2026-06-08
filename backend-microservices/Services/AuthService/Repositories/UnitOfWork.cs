using AuthService.Data;

namespace AuthService.Repositories;

/// <summary>
/// Represents the Unit of Work pattern, coordinating multiple repositories
/// and providing a single entry point for database operations.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly AuthDbContext _context;

    /// <summary>
    /// Initializes a new instance of the <see cref="UnitOfWork"/> class with the given repositories and database context.
    /// </summary>
    /// <param name="context">The application database context used for data access.</param>
    /// <param name="students">The student repository.</param>
    /// <param name="classes">The class repository.</param>
    /// <param name="courses">The course repository.</param>
    /// <param name="enrollments">The enrollment repository.</param>
    /// <param name="users">The user repository.</param>
    /// <param name="roles">The role repository.</param>
    public UnitOfWork(
        AuthDbContext context,
        IUserRepository users,
        IRoleRepository roles)
    {
        _context = context;
        Users = users;
        Roles = roles;
    }

    /// <summary>
    /// Gets the user repository.
    /// </summary>
    public IUserRepository Users { get; }

    /// <summary>
    /// Gets the role repository.
    /// </summary>
    public IRoleRepository Roles { get; }

    /// <summary>
    /// Saves all changes made in the current unit of work to the database.
    /// </summary>
    /// <returns>The number of state entries written to the database.</returns>
    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }
}