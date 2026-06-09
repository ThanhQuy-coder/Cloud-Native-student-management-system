namespace StudentService.DTOs;

public class UpdateStudentDto
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateOnly Dob { get; set; }
    public string Gender { get; set; } = null!;
    public string? Phone { get; set; }
    public int? ClassId { get; set; }
    public string LearningStatus { get; set; } = "Đang học";
}