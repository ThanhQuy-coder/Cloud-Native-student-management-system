using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Course : BaseEntity
    {
        public string CourseCode { get; set; } = null!;

        public string CourseName { get; set; } = null!;

        public int Credits { get; set; }

        public string? Description { get; set; }

        public string Status { get; set; } = "Mở";

        public int? TeacherId { get; set; }

        public User? Teacher { get; set; }

        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}