using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Configurations
{
    /// <summary>
    /// Defines the entity configuration for the <see cref="Course"/> entity in the database.
    /// This file maps the Course entity to the "courses" table, sets primary keys, 
    /// configures property constraints (length, required fields, default values), 
    /// enforces unique indexes, and establishes the relationship between courses and teachers.
    /// </summary>
    public class CourseConfiguration : IEntityTypeConfiguration<Course>
    {
        public void Configure(EntityTypeBuilder<Course> builder)
        {
            builder.ToTable("courses");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.CourseCode)
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.CourseName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.Credits)
                .IsRequired();

            builder.Property(x => x.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Mở");

            builder.HasIndex(x => x.CourseCode)
                .IsUnique();

            builder.HasIndex(x => new
            {
                x.CourseCode,
                x.CourseName
            });

            builder.HasOne(x => x.Teacher)
                .WithMany(x => x.TeachingCourses)
                .HasForeignKey(x => x.TeacherId)
                .OnDelete(DeleteBehavior.SetNull);
        }
    }
}