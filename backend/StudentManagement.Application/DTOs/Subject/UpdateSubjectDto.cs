namespace StudentManagement.Application.DTOs.Subjects
{
    public class UpdateSubjectDto
    {
        // Thêm dòng này để Backend chấp nhận mã môn gửi lên từ Frontend
        public string SubjectCode { get; set; } = null!;
        public string SubjectName { get; set; } = null!;
        public int Credits { get; set; }
        public string? Description { get; set; }
        public int? TeacherId { get; set; }
        public string Status { get; set; } = "Mở";
    }
}