namespace StudentService.Models.Events;

public class StudentUserCreatedEvent
{
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateOnly Dob { get; set; }
    public string Gender { get; set; } = string.Empty;
}