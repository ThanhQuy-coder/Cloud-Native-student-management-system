using Microsoft.EntityFrameworkCore;
using StudentService.Models;

namespace StudentService.Data
{
    /// <summary>
    /// Represents the application's database context, providing access to entity sets
    /// and configuration for the data model.
    /// </summary>
    public class StudentDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="StudentDbContext"/> class with the specified options.
        /// </summary>
        /// <param name="options">The database context options used to configure the context.</param>
        public StudentDbContext(DbContextOptions<StudentDbContext> options) : base(options)
        {

        }

        /// <summary>
        /// Gets or sets the collection of <see cref="Role"/> entities.
        /// </summary>
        public DbSet<Student> Students => Set<Student>();

        /// <summary>
        /// Gets or sets the collection of <see cref="User"/> entities.
        /// </summary>
        public DbSet<Class> Classes => Set<Class>();

        /// <summary>
        /// Configures the entity model by applying configurations from the assembly.
        /// </summary>
        /// <param name="modelBuilder">The model builder used to configure entity mappings.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(StudentDbContext).Assembly);
        }
    }
}