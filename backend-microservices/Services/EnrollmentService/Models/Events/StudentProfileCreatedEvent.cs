public class StudentProfileCreatedEvent
{
    public int UserId { get; set; }
    public int StudentId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
}