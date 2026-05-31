using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Enrollment : BaseEntity
    {
        public int StudentId { get; set; }

        public Student Student { get; set; } = null!;

        public int CourseId { get; set; }

        public Course Course { get; set; } = null!;

        public decimal? ProcessScore { get; set; }

        public decimal? MidtermScore { get; set; }

        public decimal? FinalScore { get; set; }

        public decimal? TotalScore { get; private set; }

        public string? GradeStatus { get; private set; }
    }
}