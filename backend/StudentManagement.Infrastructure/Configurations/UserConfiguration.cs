using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("users");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Username)
            .HasMaxLength(50)
            .IsRequired();

            builder.Property(x => x.Username)
            .HasMaxLength(50)
            .IsRequired();

            builder.Property(x => x.PasswordHash)
            .HasMaxLength(255)
            .IsRequired();

            builder.HasIndex(x => x.IsActive)
            .IsUnique();

            builder.HasOne(x => x.Role)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
        }
    }
}