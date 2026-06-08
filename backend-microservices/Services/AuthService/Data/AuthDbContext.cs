using Microsoft.EntityFrameworkCore;
using AuthService.Models;

namespace AuthService.Data
{
    /// <summary>
    /// Represents the application's database context, providing access to entity sets
    /// and configuration for the data model.
    /// </summary>
    public class AuthDbContext : DbContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AuthDbContext"/> class with the specified options.
        /// </summary>
        /// <param name="options">The database context options used to configure the context.</param>
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {

        }

        /// <summary>
        /// Gets or sets the collection of <see cref="Role"/> entities.
        /// </summary>
        public DbSet<Role> Roles => Set<Role>();

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

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AuthDbContext).Assembly);
        }
    }
}