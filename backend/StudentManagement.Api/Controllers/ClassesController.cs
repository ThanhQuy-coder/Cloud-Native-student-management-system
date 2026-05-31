using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.DTOs.Classes;
using StudentManagement.Application.Interfaces.Services;

namespace StudentManagement.Api.Controllers;

[ApiController]
[Route("api/classes")]
public class ClassesController : ControllerBase
{
    private readonly IClassService _classService;

    public ClassesController(IClassService classService)
    {
        _classService = classService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var classes = await _classService.GetAllAsync();

        return Ok(classes);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var cls = await _classService.GetByIdAsync(id);

        if (cls is null)
            return NotFound();

        return Ok(cls);
    }

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

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateClassDto dto)
    {
        var result = await _classService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _classService.DeleteAsync(id);

        if (!result)
            return NotFound();

        return NoContent();
    }
}