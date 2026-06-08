namespace AuthService.DTOs;

public class AuthDto
{
    public int UserId { get; set; }
    public string Username { get; set; } = null!;
    public string RoleName { get; set; } = null!;
    public string Token { get; set; } = null!;
}
