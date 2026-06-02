using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Student : BaseEntity
    {
        /// <summary>
        /// Unique code used to identify the student
        /// </summary>
        public string StudentCode { get; set; } = null!;

        /// <summary>
        /// Full name of the student
        /// </summary>
        public string FullName { get; set; } = null!;

        /// <summary>
        /// Email address of the student
        /// </summary>
        public string Email { get; set; } = null!;

        /// <summary>
        /// Date of birth
        /// </summary>
        public DateOnly Dob { get; set; }

        /// <summary>
        /// Gender of the student
        /// </summary>
        public string Gender { get; set; } = null!;

        /// <summary>
        /// Optional phone number
        /// </summary>
        public string? Phone { get; set; }

        /// <summary>
        /// Foreign key reference to the class
        /// </summary>
        public int? ClassId { get; set; }

        /// <summary>
        /// Navigation property for the class the student belongs to
        /// </summary>
        public Class? Class { get; set; }

        /// <summary>
        /// Current learning status (default is "Đang học")
        /// </summary>
        public string LearningStatus { get; set; } = "Đang học";

        /// <summary>
        /// Optional foreign key reference to the user account
        /// </summary>
        public int? UserId { get; set; }

        /// <summary>
        /// Navigation property for the linked user account
        /// </summary>
        public User? User { get; set; }

        /// <summary>
        /// Collection of enrollments for the student
        /// </summary>
        public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    }
}