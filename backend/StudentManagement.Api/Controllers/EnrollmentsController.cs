using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.DTOs.Enrollments;
using StudentManagement.Application.Interfaces.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentsController(IEnrollmentService enrollmentService)
    {
        _enrollmentService = enrollmentService;
    }

    /// <summary>
    /// Creates a new enrollment record for a student in a subject.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateEnrollmentDto"/>) containing the details
    /// required to create a new enrollment.
    /// </param>
    /// <returns>
    /// An <see cref="EnrollmentDto"/> object representing the newly created enrollment, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    /// </list>
    /// If creation fails, returns a BadRequest result with the error message.
    /// </returns>
    [HttpPost("api/enrollments")]
    public async Task<IActionResult> Create(CreateEnrollmentDto dto)
    {
        try
        {
            var enrollment = await _enrollmentService.CreateAsync(dto);

            return Created(
                $"api/enrollments/{enrollment.Id}",
                enrollment);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Retrieves all subjects that a student is enrolled in by their unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the student.</param>
    /// <returns>
    /// A <see cref="List{T}"/> of <see cref="EnrollmentDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    /// </list>
    /// If no subjects are found for the given student id, returns a NotFound result.
    /// </returns>
    [HttpGet("api/students/{id:int}/subjects")]
    public async Task<IActionResult> GetSubjectsByStudentId(int id)
    {
        try
        {
            var subjects = await _enrollmentService.GetSubjectsByStudentIdAsync(id);

            return Ok(subjects);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }

    /// <summary>
    /// Deletes an existing enrollment record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the enrollment to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the enrollment record was successfully deleted</description></item>
    ///   <item><description>false — if no enrollment record was found with the given id</description></item>
    /// </list>
    /// If the deletion is successful, returns a NoContent result.  
    /// If the enrollment is not found, returns a NotFound result.
    /// </returns>
    [HttpDelete("api/enrollments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _enrollmentService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}