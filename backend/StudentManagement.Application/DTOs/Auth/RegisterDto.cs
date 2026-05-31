namespace StudentManagement.Application.DTOs.Auth;

public class RegisterDto
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public int RoleId { get; set; }
}