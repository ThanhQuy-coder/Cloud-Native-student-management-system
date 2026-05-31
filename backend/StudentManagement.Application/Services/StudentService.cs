using StudentManagement.Application.Interfaces.Services;
using StudentManagement.Application.DTOs.Students;
using StudentManagement.Application.Interfaces.Repositories;
using StudentManagement.Domain.Entities;

public class StudentService : IStudentService
{
    private readonly IUnitOfWork _unitOfWork;

    public StudentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<StudentDto>> GetAllAsync()
    {
        var students = await _unitOfWork.Students.GetAllAsync();

        return students.Select(x => new StudentDto
        {
            Id = x.Id,
            StudentCode = x.StudentCode,
            FullName = x.FullName,
            Email = x.Email,
            Dob = x.Dob,
            Gender = x.Gender,
            Phone = x.Phone,
            ClassId = x.ClassId,
            ClassName = x.Class?.ClassName,
            LearningStatus = x.LearningStatus
        }).ToList();
    }

    public async Task<StudentDto?> GetByIdAsync(int id)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);

        if (student is null)
            return null;

        return new StudentDto
        {
            Id = student.Id,
            StudentCode = student.StudentCode,
            FullName = student.FullName,
            Email = student.Email,
            Dob = student.Dob,
            Gender = student.Gender,
            Phone = student.Phone,
            ClassId = student.ClassId,
            ClassName = student.Class?.ClassName,
            LearningStatus = student.LearningStatus
        };
    }

    public async Task<StudentDto> CreateAsync(CreateStudentDto dto)
    {
        var student = new Student
        {
            StudentCode = dto.StudentCode,
            FullName = dto.FullName,
            Email = dto.Email,
            Dob = dto.Dob,
            Gender = dto.Gender,
            Phone = dto.Phone,
            ClassId = dto.ClassId,
            UserId = dto.UserId,
            LearningStatus = "Đang học"
        };

        await _unitOfWork.Students.AddAsync(student);
        await _unitOfWork.SaveChangesAsync();

        return new StudentDto
        {
            Id = student.Id,
            StudentCode = student.StudentCode,
            FullName = student.FullName,
            Email = student.Email,
            Dob = student.Dob,
            Gender = student.Gender,
            Phone = student.Phone,
            ClassId = student.ClassId,
            LearningStatus = student.LearningStatus
        };
    }

    public async Task<bool> UpdateAsync(int id, UpdateStudentDto dto)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);

        if (student is null)
            return false;

        student.FullName = dto.FullName;
        student.Email = dto.Email;
        student.Dob = dto.Dob;
        student.Gender = dto.Gender;
        student.Phone = dto.Phone;
        student.ClassId = dto.ClassId;
        student.LearningStatus = dto.LearningStatus;

        _unitOfWork.Students.Update(student);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);

        if (student is null)
            return false;

        _unitOfWork.Students.Delete(student);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }
}