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
    public class StudentReferenceConfiguration : IEntityTypeConfiguration<StudentReference>
    {
        public void Configure(EntityTypeBuilder<StudentReference> builder)
        {
            builder.ToTable("student_references");

            builder.HasIndex(x => x.UserId)
                   .IsUnique();

            builder.HasIndex(x => x.StudentId)
                   .IsUnique();
        }
    }
}
