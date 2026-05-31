using Microsoft.EntityFrameworkCore;
using Project.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Data;

public class StudentRepository : IStudentRepository
{
    private readonly AppDbContext _context;

    public StudentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Student>> GetAllAsync()
    {
        return await _context.Students
            .Include(x => x.Class)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Student?> GetByIdAsync(int id)
    {
        return await _context.Students
            .Include(x => x.Class)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task AddAsync(Student entity)
    {
        await _context.Students.AddAsync(entity);
    }

    public void Update(Student entity)
    {
        _context.Students.Update(entity);
    }

    public void Delete(Student entity)
    {
        _context.Students.Remove(entity);
    }

    public async Task<Student?> GetByStudentCodeAsync(string studentCode)
    {
        return await _context.Students
            .FirstOrDefaultAsync(x => x.StudentCode == studentCode);
    }

    public async Task<Student?> GetByEmailAsync(string email)
    {
        return await _context.Students
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<IReadOnlyList<Student>> SearchAsync(string keyword)
    {
        return await _context.Students
            .Where(x => x.StudentCode.Contains(keyword)
                     || x.FullName.Contains(keyword))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Student>> GetByClassIdAsync(int classId)
    {
        return await _context.Students
            .Where(x => x.ClassId == classId)
            .AsNoTracking()
            .ToListAsync();
    }
}