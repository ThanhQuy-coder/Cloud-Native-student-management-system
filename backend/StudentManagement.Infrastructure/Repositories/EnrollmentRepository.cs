using Microsoft.EntityFrameworkCore;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;
using StudentManagement.Infrastructure.Data;

namespace StudentManagement.Infrastructure.Repositories;

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly AppDbContext _context;

    public EnrollmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Enrollment>> GetAllAsync()
    {
        return await _context.Enrollments
            .Include(x => x.Student)
            .Include(x => x.Course)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Enrollment?> GetByIdAsync(int id)
    {
        return await _context.Enrollments
            .Include(x => x.Student)
            .Include(x => x.Course)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Enrollment?> GetByStudentAndCourseAsync(int studentId, int courseId)
    {
        return await _context.Enrollments
            .FirstOrDefaultAsync(x =>
                x.StudentId == studentId &&
                x.CourseId == courseId);
    }

    public async Task<IReadOnlyList<Enrollment>> GetByStudentIdAsync(int studentId)
    {
        return await _context.Enrollments
            .Include(x => x.Student)
            .Include(x => x.Course)
            .Where(x => x.StudentId == studentId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IReadOnlyList<Enrollment>> GetByCourseIdAsync(int courseId)
    {
        return await _context.Enrollments
            .Include(x => x.Student)
            .Include(x => x.Course)
            .Where(x => x.CourseId == courseId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task AddAsync(Enrollment entity)
    {
        await _context.Enrollments.AddAsync(entity);
    }

    public void Update(Enrollment entity)
    {
        _context.Enrollments.Update(entity);
    }

    public void Delete(Enrollment entity)
    {
        _context.Enrollments.Remove(entity);
    }

    public async Task<IReadOnlyList<Enrollment>> GetGradesByStudentIdAsync(int studentId)
    {
        return await _context.Enrollments
            .Include(x => x.Student)
            .Include(x => x.Course)
            .Where(x => x.StudentId == studentId)
            .AsNoTracking()
            .ToListAsync();
    }
}