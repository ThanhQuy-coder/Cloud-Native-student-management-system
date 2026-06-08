using AuthService.Models;

namespace AuthService.Repositories;

public interface IRoleRepository : IRepository<Role>
{
    Task<Role?> GetByRoleNameAsync(string roleName);
}