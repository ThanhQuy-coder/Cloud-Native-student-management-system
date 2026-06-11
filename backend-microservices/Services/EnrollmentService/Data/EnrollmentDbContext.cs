using EnrollmentService.Models;
using Microsoft.EntityFrameworkCore;

namespace EnrollmentService.Data;

public class EnrollmentDbContext : DbContext
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AuthDbContext"/> class with the specified options.
    /// </summary>
    /// <param name="options">The database context options used to configure the context.</param>
    public EnrollmentDbContext(DbContextOptions<EnrollmentDbContext> options) : base(options)
    {

    }

    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<StudentReference> StudentReferences => Set<StudentReference>();

    /// <summary>
    /// Configures the entity model by applying configurations from the assembly.
    /// </summary>
    /// <param name="modelBuilder">The model builder used to configure entity mappings.</param>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(EnrollmentDbContext).Assembly);
    }
}