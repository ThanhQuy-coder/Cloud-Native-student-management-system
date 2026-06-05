namespace StudentManagement.Application.DTOs.Auth;

public class AuthDto
{
    public int UserId { get; set; }
    public int? StudentId { get; set; }
    public string Username { get; set; } = null!;
    public string RoleName { get; set; } = null!;
    public string Token { get; set; } = null!;
}
