namespace StudentManagement.Application.DTOs.Subjects;

public class CreateSubjectDto
{
    public string SubjectCode { get; set; } = null!;
    public string SubjectName { get; set; } = null!;
    public int Credits { get; set; }
    public string? Description { get; set; }
    public int? TeacherId { get; set; }
}