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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var subjects = await _courseService.GetAllAsync();

        return Ok(subjects);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var subject = await _courseService.GetByIdAsync(id);

        if (subject is null)
            return NotFound();

        return Ok(subject);
    }

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

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateSubjectDto dto)
    {
        var result = await _courseService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _courseService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}