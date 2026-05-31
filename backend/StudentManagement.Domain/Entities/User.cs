using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class User : BaseEntity
    {
        public string Username { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public int RoleId { get; set; }

        public Role Role { get; set; } = null!;

        public bool IsActive { get; set; } = true;

        public Student? Student { get; set; }

        public ICollection<Course> TeachingCourses { get; set; } = new List<Course>();
    }
}