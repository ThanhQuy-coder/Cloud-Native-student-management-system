namespace EnrollmentService.Models
{
    public class Enrollment : BaseEntity
    {
        /// <summary>
        /// Foreign key reference to the student
        /// </summary>
        public int StudentId { get; set; }

        /// <summary>
        /// Foreign key reference to the course
        /// </summary>
        public int CourseId { get; set; }

        /// <summary>
        /// Academic semester for the enrollment.
        /// </summary>
        public string Semester { get; set; } = "HK1 2026";

        /// <summary>
        /// Registration status for the enrollment.
        /// </summary>
        public string Status { get; set; } = "Đang học";

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

        public void CalculateGrade()
        {
            if (!ProcessScore.HasValue || !MidtermScore.HasValue || !FinalScore.HasValue)
            {
                TotalScore = null;
                GradeStatus = "Chưa có điểm";
                return;
            }

            TotalScore = ProcessScore.Value * 0.20m
                       + MidtermScore.Value * 0.30m
                       + FinalScore.Value * 0.50m;

            GradeStatus = TotalScore >= 4.0m ? "Đạt" : "Rớt";
        }
    }
}
