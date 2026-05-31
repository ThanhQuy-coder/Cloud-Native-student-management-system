using Microsoft.AspNetCore.Identity;
using StudentManagement.Application.DTOs.Auth;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Domain.Entities;

namespace Project.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public AuthService(
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtTokenService)
    {
        _unitOfWork = unitOfWork;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<AuthDto?> LoginAsync(LoginDto dto)
    {
        var user = await _unitOfWork.Users.GetByUsernameAsync(dto.Username);

        if (user is null)
            return null;

        if (!user.IsActive)
            return null;

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            dto.Password);

        if (result == PasswordVerificationResult.Failed)
            return null;

        var token = _jwtTokenService.GenerateToken(user);

        return new AuthDto
        {
            UserId = user.Id,
            Username = user.Username,
            RoleName = user.Role.RoleName,
            Token = token
        };
    }

    public async Task<AuthDto?> RegisterAsync(RegisterDto dto)
    {
        var existedUser = await _unitOfWork.Users.GetByUsernameAsync(dto.Username);

        if (existedUser is not null)
            return null;

        var user = new User
        {
            Username = dto.Username,
            RoleId = dto.RoleId,
            IsActive = true
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var createdUser = await _unitOfWork.Users.GetByUsernameAsync(user.Username);

        var token = _jwtTokenService.GenerateToken(createdUser!);

        return new AuthDto
        {
            UserId = createdUser!.Id,
            Username = createdUser.Username,
            RoleName = createdUser.Role.RoleName,
            Token = token
        };
    }
}