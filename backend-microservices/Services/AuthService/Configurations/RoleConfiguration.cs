using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using AuthService.Models;

namespace AuthService.Configurations
{
    /// <summary>
    /// Defines the entity configuration for the <see cref="Role"/> entity in the database.
    /// This file maps the Role entity to the "roles" table, sets primary keys, 
    /// configures property constraints (length and required fields), enforces a unique index on RoleName, 
    /// and seeds initial role data (Admin, Teacher, Student).
    /// </summary>
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.ToTable("roles");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.RoleName)
                .HasMaxLength(50)
                .IsRequired();

            builder.HasIndex(x => x.RoleName)
                .IsUnique();

            builder.HasData(
                new Role { Id = 1, RoleName = "Admin" },
                new Role { Id = 2, RoleName = "Teacher" },
                new Role { Id = 3, RoleName = "Student" },
                new Role { Id = 4, RoleName = "Staff" }
            );
        }
    }
}