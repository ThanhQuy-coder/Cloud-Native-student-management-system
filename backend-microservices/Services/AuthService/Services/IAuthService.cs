using AuthService.DTOs;

namespace AuthService.Services
{
    public interface IAuthService
    {
        Task<AuthDto?> LoginAsync(LoginDto dto);

        Task<AuthDto?> RegisterAsync(RegisterDto dto);
    }
}