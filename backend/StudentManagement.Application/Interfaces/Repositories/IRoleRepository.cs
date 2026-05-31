using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace Project.Application.Interfaces.Repositories;

public interface IRoleRepository : IRepository<Role>
{
    Task<Role?> GetByRoleNameAsync(string roleName);
}