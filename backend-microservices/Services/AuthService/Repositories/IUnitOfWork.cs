namespace AuthService.Repositories;

public interface IUnitOfWork
{
    IUserRepository Users { get; }

    IRoleRepository Roles { get; }

    Task<int> SaveChangesAsync();
}