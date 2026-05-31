namespace StudentManagement.Application.DTOs.Subjects;

public class UpdateSubjectDto
{
    public string SubjectName { get; set; } = null!;
    public int Credits { get; set; }
    public string? Description { get; set; }
    public int? TeacherId { get; set; }
    public string Status { get; set; } = "Mở";
}