namespace EnrollmentService.DTOs;

public class UpdateGradeDto
{
    public decimal? ProcessScore { get; set; }

    public decimal? MidtermScore { get; set; }

    public decimal? FinalScore { get; set; }
}