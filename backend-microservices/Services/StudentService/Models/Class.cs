using StudentService.Common;

namespace StudentService.Models
{
    public class Class : BaseEntity
    {
        /// <summary>
        /// Unique code used to identify the class
        /// </summary>
        public string ClassCode { get; set; } = null!;

        /// <summary>
        /// Name of the class
        /// </summary>
        public string ClassName { get; set; } = null!;

        /// <summary>
        /// Major or specialization of the class
        /// </summary>
        public string Major { get; set; } = null!;

        /// <summary>
        /// Academic year the class belongs to
        /// </summary>
        public string AcademicYear { get; set; } = null!;

        /// <summary>
        /// Optional advisor assigned to the class
        /// </summary>
        public string? AcademicAdvisor { get; set; }

        /// <summary>
        /// Collection of students enrolled in this class
        /// </summary>
        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}