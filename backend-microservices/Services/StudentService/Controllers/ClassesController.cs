using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentService.DTOs;
using StudentService.Services;

namespace StudentManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/classes")]
public class ClassesController : ControllerBase
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    /// <summary>
    /// Retrieves all class records from the system.
    /// </summary>
    /// <param name="none">This method does not take any parameters.</param>
    /// <returns>
    /// A <see cref="List{T}"/> of <see cref="ClassDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>ClassCode</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>Major</description></item>
    ///   <item><description>AcademicYear</description></item>
    ///   <item><description>AcademicAdvisor</description></item>
    /// </list>
    /// </returns>
    [Authorize(Roles = "Admin,Staff,Teacher,Student")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _classService.GetAllAsync();

        return Ok(classes);
    }

    /// <summary>
    /// Retrieves a single class record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the class.</param>
    /// <returns>
    /// A <see cref="ClassDto"/> object containing:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>ClassCode</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>Major</description></item>
    ///   <item><description>AcademicYear</description></item>
    ///   <item><description>AcademicAdvisor</description></item>
    /// </list>
    /// If no class is found with the given id, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin,Staff,Teacher,Student")]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cls = await _classService.GetByIdAsync(id);

        if (cls is null)
            return NotFound();

        return Ok(cls);
    }

    /// <summary>
    /// Creates a new class record in the system.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateClassDto"/>) containing the details
    /// required to create a new class record.
    /// </param>
    /// <returns>
    /// A <see cref="ClassDto"/> object representing the newly created class, including:
    /// <list type="bullet">
    ///   <item><description>Id</description></item>
    ///   <item><description>ClassCode</description></item>
    ///   <item><description>ClassName</description></item>
    ///   <item><description>Major</description></item>
    ///   <item><description>AcademicYear</description></item>
    ///   <item><description>AcademicAdvisor</description></item>
    /// </list>
    /// If creation fails, returns a BadRequest result with the error message.
    /// </returns>
    [Authorize(Roles = "Admin,Staff")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateClassDto dto)
    {
        try
        {
            var createdClass = await _classService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = createdClass.Id },
                createdClass);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Updates an existing class record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the class to update.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateClassDto"/>) containing the updated
    /// details for the class record.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the class record was successfully updated</description></item>
    ///   <item><description>false — if no class record was found with the given id</description></item>
    /// </list>
    /// If the update is successful, returns a NoContent result.  
    /// If the class is not found, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin,Staff")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateClassDto dto)
    {
        var result = await _classService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Deletes an existing class record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the class to delete.</param>
    /// <returns>
    /// A boolean value indicating the result of the delete operation:
    /// <list type="bullet">
    ///   <item><description>true — if the class record was successfully deleted</description></item>
    ///   <item><description>false — if no class record was found with the given id</description></item>
    /// </list>
    /// If the deletion is successful, returns a NoContent result.  
    /// If the class is not found, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _classService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}