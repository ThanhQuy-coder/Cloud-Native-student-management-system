using AuthService.Data;
using AuthService.Models;
using AuthService.Repositories;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AuthDbContext _context;

        public RoleRepository(AuthDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Adds a new role record to the database.
        /// </summary>
        /// <param name="entity">The <see cref="Role"/> entity to add.</param>
        public Task AddAsync(Role entity)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Deletes an existing role record from the database.
        /// </summary>
        /// <param name="entity">The <see cref="Role"/> entity to delete.</param>
        public void Delete(Role entity)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Retrieves all role records from the database.
        /// </summary>
        /// <returns>A read-only list of <see cref="Role"/> entities.</returns>
        public Task<IReadOnlyList<Role>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Retrieves a single role record by its unique identifier.
        /// </summary>
        /// <param name="id">The unique integer identifier of the role.</param>
        /// <returns>
        /// A <see cref="Role"/> entity if found; otherwise, null.
        /// </returns>
        public Task<Role?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Retrieves a role record by its role name.
        /// </summary>
        /// <param name="roleName">The unique name assigned to the role.</param>
        /// <returns>
        /// A <see cref="Role"/> entity if found; otherwise, null.
        /// </returns>
        public async Task<Role?> GetByRoleNameAsync(string roleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleName == roleName);
        }

        /// <summary>
        /// Updates an existing role record in the database.
        /// </summary>
        /// <param name="entity">The <see cref="Role"/> entity with updated values.</param>
        public void Update(Role entity)
        {
            throw new NotImplementedException();
        }
    }
}