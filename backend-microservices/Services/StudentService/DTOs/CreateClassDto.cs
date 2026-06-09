namespace StudentService.DTOs;

public class CreateClassDto
{
    public string ClassCode { get; set; } = null!;
    public string ClassName { get; set; } = null!;
    public string Major { get; set; } = null!;
    public string AcademicYear { get; set; } = null!;
    public string? AcademicAdvisor { get; set; }
}