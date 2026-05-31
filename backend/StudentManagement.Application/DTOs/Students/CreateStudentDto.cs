namespace StudentManagement.Application.DTOs.Students;

public class CreateStudentDto
{
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateOnly Dob { get; set; }
    public string Gender { get; set; } = null!;
    public string? Phone { get; set; }
    public int? ClassId { get; set; }
    public int? UserId { get; set; }
}