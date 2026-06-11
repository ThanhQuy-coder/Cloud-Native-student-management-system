namespace EnrollmentService.DTOs;

public class GradeDto
{
    public int EnrollmentId { get; set; }

    public int StudentId { get; set; }

    public int SubjectId { get; set; }
    public string Semester { get; set; } = null!;

    public decimal? ProcessScore { get; set; }
    public decimal? MidtermScore { get; set; }
    public decimal? FinalScore { get; set; }

    public decimal? TotalScore { get; set; }
    public string? GradeStatus { get; set; }
}
