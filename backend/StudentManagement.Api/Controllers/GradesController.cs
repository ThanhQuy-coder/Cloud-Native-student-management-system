using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.DTOs.Grades;
using StudentManagement.Application.Interfaces.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
public class GradesController : ControllerBase
{
    private readonly IGradeService _gradeService;

    public GradesController(IGradeService gradeService)
    {
        _gradeService = gradeService;
    }

    [HttpPost("api/grades")]
    public async Task<IActionResult> Create(CreateGradeDto dto)
    {
        try
        {
            var grade = await _gradeService.CreateAsync(dto);

            return Ok(grade);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("api/grades/{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateGradeDto dto)
    {
        var result = await _gradeService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpGet("api/students/{id:int}/grades")]
    public async Task<IActionResult> GetGradesByStudentId(int id)
    {
        try
        {
            var grades = await _gradeService.GetGradesByStudentIdAsync(id);

            return Ok(grades);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }
}