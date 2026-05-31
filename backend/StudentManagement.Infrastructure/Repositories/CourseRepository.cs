using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Data;

namespace StudentManagement.Infrastructure.Repositories;

public class CourseRepository : ICourseRepository
{
    private readonly AppDbContext _context;

    public CourseRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Course>> GetAllAsync()
    {
        return await _context.Courses
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Course?> GetByIdAsync(int id)
    {
        return await _context.Courses
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Course?> GetByCourseCodeAsync(string courseCode)
    {
        return await _context.Courses
            .FirstOrDefaultAsync(x => x.CourseCode == courseCode);
    }

    public async Task<IReadOnlyList<Course>> SearchAsync(string keyword)
    {
        return await _context.Courses
            .Where(x => x.CourseCode.Contains(keyword)
                     || x.CourseName.Contains(keyword))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Course>> GetByTeacherIdAsync(int teacherId)
    {
        return await _context.Courses
            .Where(x => x.TeacherId == teacherId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(Course entity)
    {
        await _context.Courses.AddAsync(entity);
    }

    public void Update(Course entity)
    {
        _context.Courses.Update(entity);
    }

    public void Delete(Course entity)
    {
        _context.Courses.Remove(entity);
    }
}