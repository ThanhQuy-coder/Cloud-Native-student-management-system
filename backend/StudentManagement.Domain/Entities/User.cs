using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class User : BaseEntity
    {
        /// <summary>
        /// Username used for login
        /// </summary>
        public string Username { get; set; } = null!;

        /// <summary>
        /// Hashed password for authentication
        /// </summary>
        public string PasswordHash { get; set; } = null!;

        /// <summary>
        /// Foreign key reference to the role
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// Navigation property for the role assigned to the user
        /// </summary>
        public Role Role { get; set; } = null!;

        /// <summary>
        /// Indicates if the user account is active (default true)
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Optional link to student profile if the user is a student
        /// </summary>
        public Student? Student { get; set; }

        /// <summary>
        /// Collection of courses taught by the user if they are a teacher
        /// </summary>
        public ICollection<Course> TeachingCourses { get; set; } = new List<Course>();
    }
}