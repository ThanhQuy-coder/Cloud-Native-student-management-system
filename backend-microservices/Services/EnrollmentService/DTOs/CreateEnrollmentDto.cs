namespace EnrollmentService.DTOs;

public class CreateEnrollmentDto
{
    public int StudentId { get; set; }

    public int SubjectId { get; set; }

    public string? Semester { get; set; }
}
