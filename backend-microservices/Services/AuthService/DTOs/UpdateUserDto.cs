namespace AuthService.DTOs;

public class UpdateUserDto
{
    public string Username { get; set; } = null!;

    public string? Password { get; set; }

    public string RoleName { get; set; } = null!;

    public bool IsActive { get; set; }
}
