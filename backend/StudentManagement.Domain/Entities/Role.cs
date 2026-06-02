using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Role : BaseEntity
    {
        /// <summary>
        /// Name of the role (Staff, Admin, Teacher, Student)
        /// </summary>
        public string RoleName { get; set; } = null!;

        /// <summary>
        /// Collection of users assigned to this role
        /// </summary>
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}