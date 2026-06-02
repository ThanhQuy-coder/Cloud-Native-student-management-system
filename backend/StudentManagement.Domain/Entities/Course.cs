using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Course : BaseEntity
    {
        /// <summary>
        /// Unique code used to identify the course
        /// </summary>
        public string CourseCode { get; set; } = null!;

        /// <summary>
        /// Name of the course
        /// </summary>
        public string CourseName { get; set; } = null!;

        /// <summary>
        /// Number of credits assigned to the course
        /// </summary>
        public int Credits { get; set; }

        /// <summary>
        /// Optional description of the course content
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Status of the course (default is "Mở" meaning Open)
        /// </summary>
        public string Status { get; set; } = "Mở";

        /// <summary>
        /// Optional foreign key reference to the teacher
        /// </summary>
        public int? TeacherId { get; set; }

        /// <summary>
        /// Navigation property for the teacher assigned to the course
        /// </summary>
        public User? Teacher { get; set; }

        /// <summary>
        /// Collection of enrollments for students taking this course
        /// </summary>
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}