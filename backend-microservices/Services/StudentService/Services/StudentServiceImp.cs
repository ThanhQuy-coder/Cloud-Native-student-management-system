using StudentService.DTOs;
using StudentService.Models;
using StudentService.Repositories;

namespace StudentService.Services;

public class StudentServiceImp : IStudentService
{
    private readonly IUnitOfWork _unitOfWork;

    public StudentServiceImp(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Retrieves all student records from the system.
    /// </summary>
    /// <returns>
    /// A <see cref="IReadOnlyList{T}"/> of <see cref="StudentDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>FullName</description></item>
    ///   <item><description>Email</description></item>
    ///   <item><description>Dob</description></item>
    ///   <item><description>Gender</description></item>
    ///   <item><description>Phone</description></item>
    ///   <item><description>ClassId</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>LearningStatus</description></item>
    /// </list>
    /// </returns>
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

    /// <summary>
    /// Retrieves a single student record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the student.</param>
    /// <returns>
    /// A <see cref="StudentDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>FullName</description></item>
    ///   <item><description>Email</description></item>
    ///   <item><description>Dob</description></item>
    ///   <item><description>Gender</description></item>
    ///   <item><description>Phone</description></item>
    ///   <item><description>ClassId</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>LearningStatus</description></item>
    /// </list>
    /// Returns null if no student is found with the given id.
    /// </returns>
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

    /// <summary>
    /// Creates a new student record in the system.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateStudentDto"/>) containing the details
    /// required to create a new student record.
    /// </param>
    /// <returns>
    /// A <see cref="StudentDto"/> object representing the newly created student, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>FullName</description></item>
    ///   <item><description>Email</description></item>
    ///   <item><description>Dob</description></item>
    ///   <item><description>Gender</description></item>
    ///   <item><description>Phone</description></item>
    ///   <item><description>ClassId</description></item>
    ///   <item><description>LearningStatus</description></item>
    /// </list>
    /// </returns>
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
            LearningStatus = dto.LearningStatus
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

    /// <summary>
    /// Updates an existing student record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the student to update.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateStudentDto"/>) containing the updated
    /// details for the student record.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the student record was successfully updated</description></item>
    ///   <item><description>false — if no student record was found with the given id</description></item>
    /// </list>
    /// </returns>
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

    /// <summary>
    /// Deletes an existing student record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the student to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the student record was successfully deleted</description></item>
    ///   <item><description>false — if no student record was found with the given id</description></item>
    /// </list>
    /// </returns>
    public async Task<bool> DeleteAsync(int id)
    {
        var student = await _unitOfWork.Students.GetByIdAsync(id);

        if (student is null)
            return false;

        _unitOfWork.Students.Delete(student);
        await _unitOfWork.SaveChangesAsync();

        return true;
    }

    /// <summary>
    /// Get the StudentId based on the provided UserId
    /// Retrieves the StudentId associated with a given UserId.
    /// Returns null if no student record is found.
    /// </summary>
    /// <param name="userId">The unique identifier of the user</param>
    /// <returns>The StudentId if found, otherwise null</returns>
    public async Task<int?> GetStudentIdByUserIdAsync(int userId)
    {
        var student = await _unitOfWork.Students.GetByUserIdAsync(userId);

        return student?.Id;
    }
}