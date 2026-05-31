namespace StudentManagement.Application.DTOs.Grades;

public class CreateGradeDto
{
    public int EnrollmentId { get; set; }

    public decimal? ProcessScore { get; set; }

    public decimal? MidtermScore { get; set; }

    public decimal? FinalScore { get; set; }
}