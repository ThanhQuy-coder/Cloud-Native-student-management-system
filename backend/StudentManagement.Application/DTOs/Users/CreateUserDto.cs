namespace StudentManagement.Application.DTOs.Users;

public class CreateUserDto
{
    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string RoleName { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}
