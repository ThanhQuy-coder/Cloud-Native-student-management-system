using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.DTOs.Subjects;
using StudentManagement.Application.Interfaces.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/subjects")]
public class SubjectsController : ControllerBase
{
    private readonly ICourseService _courseService;

    public SubjectsController(ICourseService courseService)
    {
        _courseService = courseService;
    }

    /// <summary>
    /// Retrieves all subject records from the system.
    /// </summary>
    /// <returns>
    /// A <see cref="List{T}"/> of <see cref="SubjectDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    ///   <item><description>Description</description></item>
    ///   <item><description>TeacherId</description></item>
    ///   <item><description>Status</description></item>
    /// </list>
    /// </returns>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subjects = await _courseService.GetAllAsync();

        return Ok(subjects);
    }

    /// <summary>
    /// Retrieves a single subject record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the subject.</param>
    /// <returns>
    /// A <see cref="SubjectDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    ///   <item><description>Description</description></item>
    ///   <item><description>TeacherId</description></item>
    ///   <item><description>Status</description></item>
    /// </list>
    /// If no subject is found with the given id, returns a NotFound result.
    /// </returns>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var subject = await _courseService.GetByIdAsync(id);

        if (subject is null)
            return NotFound();

        return Ok(subject);
    }

    /// <summary>
    /// Creates a new subject record in the system.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateSubjectDto"/>) containing the details
    /// required to create a new subject record.
    /// </param>
    /// <returns>
    /// A <see cref="SubjectDto"/> object representing the newly created subject, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>Credits</description></item>
    ///   <item><description>Description</description></item>
    ///   <item><description>TeacherId</description></item>
    ///   <item><description>Status</description></item>
    /// </list>
    /// If creation fails, returns a BadRequest result with the error message.
    /// </returns>
    [HttpPost]
    public async Task<IActionResult> Create(CreateSubjectDto dto)
    {
        try
        {
            var createdSubject = await _courseService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdSubject.Id },
                createdSubject);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Updates an existing subject record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the subject to update.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateSubjectDto"/>) containing the updated
    /// details for the subject record.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the subject record was successfully updated</description></item>
    ///   <item><description>false — if no subject record was found with the given id</description></item>
    /// </list>
    /// If the update is successful, returns a NoContent result.  
    /// If the subject is not found, returns a NotFound result.
    /// </returns>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateSubjectDto dto)
    {
        var result = await _courseService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Deletes an existing subject record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the subject to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the subject record was successfully deleted</description></item>
    ///   <item><description>false — if no subject record was found with the given id</description></item>
    /// </list>
    /// If the deletion is successful, returns a NoContent result.  
    /// If the subject is not found, returns a NotFound result.
    /// </returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _courseService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}