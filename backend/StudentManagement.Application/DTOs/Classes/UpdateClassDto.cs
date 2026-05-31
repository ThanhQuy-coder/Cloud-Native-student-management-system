using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StudentManagement.Application.DTOs.Classes
{
    public class UpdateClassDto
    {
        public string ClassName { get; set; } = null!;
        public string Major { get; set; } = null!;
        public string AcademicYear { get; set; } = null!;
        public string? AcademicAdvisor { get; set; }
    }
}