using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Configurations
{
    /// <summary>
    /// Defines the entity configuration for the <see cref="Student"/> entity in the database.
    /// This file maps the Student entity to the "students" table, sets primary keys, 
    /// configures property constraints (length, required fields, default values), 
    /// enforces unique indexes on StudentCode, Email, and UserId, 
    /// and establishes relationships between students, classes, and users with proper foreign key behavior.
    /// </summary>
    public class StudentConfiguration : IEntityTypeConfiguration<Student>
    {
        public void Configure(EntityTypeBuilder<Student> builder)
        {
            builder.ToTable("students");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.StudentCode)
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.FullName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.Email)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.Gender)
                .HasMaxLength(10)
                .IsRequired();

            builder.Property(x => x.Phone)
                .HasMaxLength(15);

            builder.Property(x => x.LearningStatus)
                .HasMaxLength(50)
                .HasDefaultValue("Đang học");

            builder.HasIndex(x => x.StudentCode)
                .IsUnique();

            builder.HasIndex(x => x.Email)
                .IsUnique();

            builder.HasIndex(x => x.UserId)
                .IsUnique();

            builder.HasIndex(x => new
            {
                x.StudentCode,
                x.FullName
            });

            builder.HasIndex(x => new
            {
                x.ClassId,
                x.LearningStatus
            });

            builder.HasOne(x => x.Class)
                .WithMany(x => x.Students)
                .HasForeignKey(x => x.ClassId)
                .OnDelete(DeleteBehavior.SetNull);

            builder.HasOne(x => x.User)
                .WithOne(x => x.Student)
                .HasForeignKey<Student>(x => x.UserId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}