using AuthService.DTOs;
using AuthService.Models;
using AuthService.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly PasswordHasher<User> _passwordHasher = new();

    public UsersController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _unitOfWork.Users.GetAllAsync();

        return Ok(users.Select(MapToDto));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateUserDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
            return BadRequest("Username and password are required.");

        var username = dto.Username.Trim();
        var existedUser = await _unitOfWork.Users.GetByUsernameAsync(username);

        if (existedUser is not null)
            return BadRequest("Username already exists.");

        var role = await _unitOfWork.Roles.GetByRoleNameAsync(NormalizeRoleName(dto.RoleName));

        if (role is null)
            return BadRequest("Role is invalid or does not exist.");

        var user = new User
        {
            Username = username,
            RoleId = role.Id,
            IsActive = dto.IsActive
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        var created = await _unitOfWork.Users.GetByUsernameAsync(user.Username);

        return CreatedAtAction(nameof(GetAll), new { id = created!.Id }, MapToDto(created));
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateUserDto dto)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);

        if (user is null)
            return NotFound();

        var username = dto.Username.Trim();

        if (string.IsNullOrWhiteSpace(username))
            return BadRequest("Username is required.");

        var duplicated = await _unitOfWork.Users.GetByUsernameAsync(username);

        if (duplicated is not null && duplicated.Id != id)
            return BadRequest("Username already exists.");

        var role = await _unitOfWork.Roles.GetByRoleNameAsync(NormalizeRoleName(dto.RoleName));

        if (role is null)
            return BadRequest("Role is invalid or does not exist.");

        user.Username = username;
        user.RoleId = role.Id;
        user.IsActive = dto.IsActive;

        if (!string.IsNullOrWhiteSpace(dto.Password))
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        _unitOfWork.Users.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(id);

        if (user is null)
            return NotFound();

        _unitOfWork.Users.Delete(user);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            RoleName = user.Role.RoleName,
            IsActive = user.IsActive
        };
    }

    private static string NormalizeRoleName(string roleName)
    {
        return roleName.Trim().ToLowerInvariant() switch
        {
            "admin" => "Admin",
            "staff" or "giaovu" or "giao vu" or "giáo vụ" => "Staff",
            "teacher" or "lecturer" or "giang vien" or "giảng viên" => "Teacher",
            "student" or "sinh vien" or "sinh viên" => "Student",
            _ => roleName.Trim()
        };
    }
}
