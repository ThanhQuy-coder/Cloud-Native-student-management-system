namespace AcademicService.Models
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
    }
}