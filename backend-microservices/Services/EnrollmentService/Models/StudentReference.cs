namespace EnrollmentService.Models;

public class StudentReference
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int StudentId { get; set; }

    public string StudentCode { get; set; } = string.Empty;
}