using StudentService.Common;

namespace StudentService.Models
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
        /// Reference to the user account
        /// </summary>
        public int? UserId { get; set; }
    }
}