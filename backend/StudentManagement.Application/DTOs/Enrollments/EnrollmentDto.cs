namespace StudentManagement.Application.DTOs.Enrollments;

public class EnrollmentDto
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public string StudentCode { get; set; } = null!;

    public string StudentName { get; set; } = null!;

    public int SubjectId { get; set; }

    public string SubjectCode { get; set; } = null!;

    public string SubjectName { get; set; } = null!;

    public int Credits { get; set; }
}