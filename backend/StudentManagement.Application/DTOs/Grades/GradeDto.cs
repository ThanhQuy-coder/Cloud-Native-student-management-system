namespace StudentManagement.Application.DTOs.Grades;

public class GradeDto
{
    public int EnrollmentId { get; set; }

    public int StudentId { get; set; }
    public string StudentCode { get; set; } = null!;
    public string StudentName { get; set; } = null!;

    public int SubjectId { get; set; }
    public string SubjectCode { get; set; } = null!;
    public string SubjectName { get; set; } = null!;

    public decimal? ProcessScore { get; set; }
    public decimal? MidtermScore { get; set; }
    public decimal? FinalScore { get; set; }

    public decimal? TotalScore { get; set; }
    public string? GradeStatus { get; set; }
}