using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Configurations
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

            builder.Property(x => x.ProcessScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.MidtermScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.FinalScore)
                .HasPrecision(4, 2);

            builder.Property(x => x.TotalScore)
                .HasPrecision(4, 2)
                .ValueGeneratedOnAddOrUpdate()
                .HasComputedColumnSql(
                @"CASE 
                    WHEN `ProcessScore` IS NOT NULL 
                     AND `MidtermScore` IS NOT NULL 
                     AND `FinalScore` IS NOT NULL
                    THEN `ProcessScore` * 0.20 
                       + `MidtermScore` * 0.30 
                       + `FinalScore` * 0.50
                    ELSE NULL
                  END",
                stored: true);

            builder.Property(x => x.GradeStatus)
                .HasMaxLength(20)
                .ValueGeneratedOnAddOrUpdate()
                .HasComputedColumnSql(
                @"CASE 
                    WHEN `ProcessScore` IS NULL 
                      OR `MidtermScore` IS NULL 
                      OR `FinalScore` IS NULL
                    THEN 'Chưa có điểm'
                    WHEN (`ProcessScore` * 0.20 
                        + `MidtermScore` * 0.30 
                        + `FinalScore` * 0.50) >= 4.0
                    THEN 'Đạt'
                    ELSE 'Rớt'
                  END",
                stored: true);

            builder.HasIndex(x => new
            {
                x.StudentId,
                x.CourseId
            })
            .IsUnique();

            builder.HasOne(x => x.Student)
                .WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.StudentId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Course)
                .WithMany(x => x.Enrollments)
                .HasForeignKey(x => x.CourseId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}