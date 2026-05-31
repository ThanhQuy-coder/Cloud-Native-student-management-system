using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Class : BaseEntity
    {
        public string ClassCode { get; set; } = null!;

        public string ClassName { get; set; } = null!;

        public string Major { get; set; } = null!;

        public string AcademicYear { get; set; } = null!;

        public string? AcademicAdvisor { get; set; }

        public ICollection<Student> Students { get; set; } = new List<Student>();
    }
}