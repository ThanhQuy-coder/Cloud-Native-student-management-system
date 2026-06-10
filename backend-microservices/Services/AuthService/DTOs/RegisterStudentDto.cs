namespace AuthService.DTOs;

public class RegisterStudentDto
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly Dob { get; set; }
    public string Gender { get; set; } = string.Empty;
}