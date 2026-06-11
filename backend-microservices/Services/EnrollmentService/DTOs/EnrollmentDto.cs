namespace EnrollmentService.DTOs;

public class EnrollmentDto
{
    public int Id { get; set; }

    public int StudentId { get; set; }

    public int SubjectId { get; set; }

    public int Credits { get; set; }

    public string Semester { get; set; } = null!;

    public string Status { get; set; } = null!;
}
