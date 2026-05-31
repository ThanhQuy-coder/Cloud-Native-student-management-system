using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Student : BaseEntity
    {
        public string StudentCode { get; set; } = null!;

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public DateOnly Dob { get; set; }

        public string Gender { get; set; } = null!;

        public string? Phone { get; set; }

        public int? ClassId { get; set; }

        public Class? Class { get; set; }

        public string LearningStatus { get; set; } = "Đang học";

        public int? UserId { get; set; }

        public User? User { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}