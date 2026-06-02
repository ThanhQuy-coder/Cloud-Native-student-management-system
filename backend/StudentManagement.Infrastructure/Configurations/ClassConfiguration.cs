using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Configurations
{
    /// <summary>
    /// Defines the entity configuration for the <see cref="Class"/> entity in the database.
    /// This file maps the Class entity to the "classes" table, sets primary keys, 
    /// configures property constraints (length and required fields), and enforces a unique index on ClassCode.
    /// </summary>
    public class ClassConfiguration : IEntityTypeConfiguration<Class>
    {
        public void Configure(EntityTypeBuilder<Class> builder)
        {
            builder.ToTable("classes");

            builder.HasKey(x => x.Id);

            builder.Property(x => x.ClassCode)
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.ClassName)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.Major)
                .HasMaxLength(100)
                .IsRequired();

            builder.Property(x => x.AcademicYear)
                .HasMaxLength(20)
                .IsRequired();

            builder.Property(x => x.AcademicAdvisor)
                .HasMaxLength(100);

            builder.HasIndex(x => x.ClassCode)
                .IsUnique();
        }
    }
}