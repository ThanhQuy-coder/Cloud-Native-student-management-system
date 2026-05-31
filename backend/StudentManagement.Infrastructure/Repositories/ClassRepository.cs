using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Data;

namespace StudentManagement.Infrastructure.Repositories;

public class ClassRepository : IClassRepository
{
    private readonly AppDbContext _context;

    public ClassRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Class>> GetAllAsync()
    {
        return await _context.Classes
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Class?> GetByIdAsync(int id)
    {
        return await _context.Classes
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Class?> GetByClassCodeAsync(string classCode)
    {
        return await _context.Classes
            .FirstOrDefaultAsync(x => x.ClassCode == classCode);
    }

    public async Task AddAsync(Class entity)
    {
        await _context.Classes.AddAsync(entity);
    }

    public void Update(Class entity)
    {
        _context.Classes.Update(entity);
    }

    public void Delete(Class entity)
    {
        _context.Classes.Remove(entity);
    }
}