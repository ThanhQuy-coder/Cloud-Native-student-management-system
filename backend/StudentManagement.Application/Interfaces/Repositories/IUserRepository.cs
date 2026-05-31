using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

namespace Project.Application.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByUsernameAsync(string username);
}