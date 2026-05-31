using Microsoft.EntityFrameworkCore;
using StudentManagement.Infrastructure.Data;
using StudentManagement.Domain.Entities;
using StudentManagement.Application.Interfaces.Repositories;

namespace StudentManagement.Infrastructure.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly AppDbContext _context;

        public RoleRepository(AppDbContext context)
        {
            _context = context;
        }

        public Task AddAsync(Role entity)
        {
            throw new NotImplementedException();
        }

        public void Delete(Role entity)
        {
            throw new NotImplementedException();
        }

        public Task<IReadOnlyList<Role>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<Role?> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Role?> GetByRoleNameAsync(string roleName)
        {
            return await _context.Roles
                .FirstOrDefaultAsync(x => x.RoleName == roleName);
        }

        public void Update(Role entity)
        {
            throw new NotImplementedException();
        }
    }
}