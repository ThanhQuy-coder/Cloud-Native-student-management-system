using AuthService.DTOs;
using AuthService.Models;
using AuthService.Models.Events;
using AuthService.Repositories;
using Microsoft.AspNetCore.Identity;

namespace AuthService.Services;

public class AuthServiceImpl : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly IRabbitMqPublisher _rabbitMqPublisher;

    public AuthServiceImpl(
        IUnitOfWork unitOfWork,
        IJwtTokenService jwtTokenService,
        IRabbitMqPublisher rabbitMqPublisher)
    {
        _unitOfWork = unitOfWork;
        _jwtTokenService = jwtTokenService;
        _rabbitMqPublisher = rabbitMqPublisher;
    }

    /// <summary>
    /// Authenticates a user by verifying their credentials and generates a JWT token if valid.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="LoginDto"/>) containing the username and password
    /// for login.
    /// </param>
    /// <returns>
    /// An <see cref="AuthDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>UserId</description></item>
    ///   <item><description>Username</description></item>
    ///   <item><description>RoleName</description></item>
    ///   <item><description>Token</description></item>
    /// </list>
    /// Returns null if the user does not exist, is inactive, or the password verification fails.
    /// </returns>
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

    /// <summary>
    /// Registers a new user with the default "Student" role and generates a JWT token.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="RegisterDto"/>) containing the username and password
    /// for registration.
    /// </param>
    /// <returns>
    /// An <see cref="AuthDto"/> object representing the newly registered user, including:
    /// <list type="bullet">
    ///   <item><description>UserId</description></item>
    ///   <item><description>Username</description></item>
    ///   <item><description>RoleName</description></item>
    ///   <item><description>Token</description></item>
    /// </list>
    /// Returns null if the username already exists.  
    /// Throws an exception if the default "Student" role does not exist in the database.
    /// </returns>
    public async Task<AuthDto?> RegisterAsync(RegisterDto dto)
    {
        var existedUser = await _unitOfWork.Users.GetByUsernameAsync(dto.Username);

        if (existedUser is not null)
            return null;

        if (dto.Role == null) dto.Role = "Student";

        var defaultRole = await _unitOfWork.Roles.GetByRoleNameAsync(dto.Role);

        if (defaultRole is null)
            throw new Exception("Default role 'Student' chưa tồn tại trong database.");

        var user = new User
        {
            Username = dto.Username,
            RoleId = defaultRole.Id,
            IsActive = true
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var createdUser = await _unitOfWork.Users.GetByUsernameAsync(user.Username);

        if (createdUser is null)
            throw new Exception("Không thể tải lại user vừa tạo.");

        var token = _jwtTokenService.GenerateToken(createdUser);

        return new AuthDto
        {
            UserId = createdUser.Id,
            Username = createdUser.Username,
            RoleName = createdUser.Role.RoleName,
            Token = token
        };
    }

    public async Task<AuthDto?> RegisterStudentAsync(RegisterStudentDto dto)
    {
        var existedUser = await _unitOfWork.Users.GetByUsernameAsync(dto.Username);

        if (existedUser is not null)
            return null;

        var defaultRole = await _unitOfWork.Roles.GetByRoleNameAsync("Student");

        if (defaultRole is null)
            throw new Exception("Default role 'Student' chưa tồn tại trong database.");

        var user = new User
        {
            Username = dto.Username,
            RoleId = defaultRole.Id,
            IsActive = true
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var createdUser = await _unitOfWork.Users.GetByUsernameAsync(user.Username);

        if (createdUser is null)
            throw new Exception("Không thể tải lại user vừa tạo.");

        var token = _jwtTokenService.GenerateToken(createdUser);

        await _rabbitMqPublisher.PublishStudentUserCreatedAsync(new StudentUserCreatedEvent
        {
            UserId = createdUser.Id,
            FullName = dto.FullName,
            Email = dto.Email,
            Dob = dto.Dob,
            Gender = dto.Gender
        });

        return new AuthDto
        {
            UserId = createdUser.Id,
            Username = createdUser.Username,
            RoleName = createdUser.Role.RoleName,
            Token = token
        };
    }
}
