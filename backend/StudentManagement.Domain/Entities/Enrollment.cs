using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Enrollment : BaseEntity
    {
        /// <summary>
        /// Foreign key reference to the student
        /// </summary>
        public int StudentId { get; set; }

        /// <summary>
        /// Navigation property for the student
        /// </summary>
        public Student Student { get; set; } = null!;

        /// <summary>
        /// Foreign key reference to the course
        /// </summary>
        public int CourseId { get; set; }

        /// <summary>
        /// Navigation property for the course
        /// </summary>
        public Course Course { get; set; } = null!;

        /// <summary>
        /// Score for process/continuous assessment
        /// </summary>
        public decimal? ProcessScore { get; set; }

        /// <summary>
        /// Score for midterm exam
        /// </summary>
        public decimal? MidtermScore { get; set; }

        /// <summary>
        /// Score for final exam
        /// </summary>
        public decimal? FinalScore { get; set; }

        /// <summary>
        /// Computed total score (read-only)
        /// </summary>
        public decimal? TotalScore { get; private set; }

        /// <summary>
        /// Computed grade status (Chưa có điểm, Đạt , Rớt)
        /// </summary>
        public string? GradeStatus { get; private set; }
    }
}