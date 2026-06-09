using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentService.Controllers;
using StudentService.DTOs;
using StudentService.Services;

namespace StudentService.Controllers;

[Authorize]
[ApiController]
[Route("api/students")]
public class StudentsController : BaseController
{
    private readonly IStudentService _studentService;

    public StudentsController(IStudentService studentService)
    {
        _studentService = studentService;
    }

    /// <summary>
    /// Retrieves all student records from the system.
    /// </summary>
    /// <returns>
    /// A <see cref="List{T}"/> of <see cref="StudentDto"/> objects, each containing:
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
    [Authorize(Roles = "Admin,Staff,Teacher")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _studentService.GetAllAsync();
        return Ok(students);
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
    /// If no student is found with the given id, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin,Staff,Teacher,Student")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (User.IsInRole("Student"))
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId is null)
                return Unauthorized();

            var currentStudentId = await _studentService.GetStudentIdByUserIdAsync(currentUserId.Value);

            if (currentStudentId != id)
                return Forbid();
        }

        var student = await _studentService.GetByIdAsync(id);

        if (student is null)
            return NotFound();

        return Ok(student);
    }

    [Authorize(Roles = "Student")]
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId is null)
            return Unauthorized();

        var currentStudentId = await _studentService.GetStudentIdByUserIdAsync(currentUserId.Value);

        if (currentStudentId is null)
            return NotFound("Student profile chưa được liên kết với tài khoản.");

        var student = await _studentService.GetByIdAsync(currentStudentId.Value);

        return student is null ? NotFound() : Ok(student);
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
    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateStudentDto dto)
    {
        var student = await _studentService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = student.Id },
            student);
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
    /// If the update is successful, returns a NoContent result.  
    /// If the student is not found, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateStudentDto dto)
    {
        var result = await _studentService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
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
    /// If the deletion is successful, returns a NoContent result.  
    /// If the student is not found, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _studentService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}
