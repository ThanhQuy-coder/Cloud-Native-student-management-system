using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Configurations
{
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