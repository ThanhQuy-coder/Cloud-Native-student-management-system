using StudentManagement.Domain.Common;

namespace StudentManagement.Domain.Entities
{
    public class Role : BaseEntity
    {
        public string RoleName { get; set; } = null!;

        public ICollection<User> Users { get; set; } = new List<User>();
    }
}