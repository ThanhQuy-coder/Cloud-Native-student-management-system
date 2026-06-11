namespace StudentService.Services;

public interface IRabbitMqPublisher
{
    Task PublishStudentProfileCreated(StudentProfileCreatedEvent message);
}