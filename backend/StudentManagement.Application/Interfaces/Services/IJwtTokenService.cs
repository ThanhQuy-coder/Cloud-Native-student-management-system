using StudentManagement.Domain.Entities;

namespace StudentManagement.Application.Interfaces.Services
{
    public interface IJwtTokenService
    {
        string GenerateToken(User user);
    }
}