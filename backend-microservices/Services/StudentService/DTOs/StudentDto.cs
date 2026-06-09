namespace StudentService.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public string StudentCode { get; set; } = null!;
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public DateOnly Dob { get; set; }
    public string Gender { get; set; } = null!;
    public string? Phone { get; set; }
    public int? ClassId { get; set; }
    public string? ClassName { get; set; }
    public string LearningStatus { get; set; } = null!;
}