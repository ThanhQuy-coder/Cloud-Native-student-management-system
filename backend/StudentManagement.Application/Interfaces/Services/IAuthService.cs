using StudentManagement.Application.DTOs.Auth;

namespace StudentManagement.Application.Interfaces.Services
{
    public interface IAuthService
    {
        Task<AuthDto?> LoginAsync(LoginDto dto);

        Task<AuthDto?> RegisterAsync(RegisterDto dto);
    }
}