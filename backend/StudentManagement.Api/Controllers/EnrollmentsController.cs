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

    [HttpDelete("api/enrollments/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _enrollmentService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}