using Microsoft.EntityFrameworkCore;
using StudentManagement.Domain.Entities;

namespace StudentManagement.Infrastructure.Data
{
    /// <summary>
    /// Represents the application's database context, providing access to entity sets
    /// and configuration for the data model.
    /// </summary>
    public class AppDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AppDbContext"/> class with the specified options.
        /// </summary>
        /// <param name="options">The database context options used to configure the context.</param>
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        /// <summary>
        /// Gets or sets the collection of <see cref="Class"/> entities.
        /// </summary>
        public DbSet<Class> Classes => Set<Class>();

        /// <summary>
        /// Gets or sets the collection of <see cref="Course"/> entities.
        /// </summary>
        public DbSet<Course> Courses => Set<Course>();

        /// <summary>
        /// Gets or sets the collection of <see cref="Enrollment"/> entities.
        /// </summary>

        public DbSet<Enrollment> Enrollments => Set<Enrollment>();

        /// <summary>
        /// Gets or sets the collection of <see cref="Role"/> entities.
        /// </summary>
        public DbSet<Role> Roles => Set<Role>();

        /// <summary>
        /// Gets or sets the collection of <see cref="Student"/> entities.
        /// </summary>
        public DbSet<Student> Students => Set<Student>();

        /// <summary>
        /// Gets or sets the collection of <see cref="User"/> entities.
        /// </summary>
        public DbSet<User> Users => Set<User>();

        /// <summary>
        /// Configures the entity model by applying configurations from the assembly.
        /// </summary>
        /// <param name="modelBuilder">The model builder used to configure entity mappings.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        }
    }
}