using EnrollmentService.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EnrollmentService.Configurations
{
    /// <summary>
    /// Defines the entity configuration for the <see cref="Enrollment"/> entity in the database.
    /// This file maps the Enrollment entity to the "enrollments" table, sets primary keys, 
    /// configures score properties with precision, creates computed columns for total score and grade status, 
    /// enforces unique constraints on student-course combinations, and establishes relationships 
    /// between enrollments, students, and courses with cascade delete behavior.
    /// </summary>
    public class EnrollmentConfiguration : IEntityTypeConfiguration<Enrollment>
    {
        public void Configure(EntityTypeBuilder<Enrollment> builder)
        {
            builder.ToTable("enrollments");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.Semester)
                .HasMaxLength(30)
                .IsRequired();

            builder.Property(x => x.Status)
                .HasMaxLength(30)
                .IsRequired();

            builder.Property(x => x.ProcessScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.MidtermScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.FinalScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.TotalScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.GradeStatus)
                .HasMaxLength(20);

            builder.HasIndex(x => new
            {
                x.StudentId,
                x.CourseId
            })
            .IsUnique();
        }
    }
}
