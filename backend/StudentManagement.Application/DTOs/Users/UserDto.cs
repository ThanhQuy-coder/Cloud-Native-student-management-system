namespace StudentManagement.Application.DTOs.Users;

public class UserDto
{
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string RoleName { get; set; } = null!;

    public bool IsActive { get; set; }
}
