using EnrollmentService.Controllers;
using EnrollmentService.DTOs;
using EnrollmentService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnrollmentService.Controllers;

[Authorize]
[ApiController]
public class GradesController : BaseController
{
    private readonly IGradeService _gradeService;
    // private readonly IStudentService _studentService;

    public GradesController(IGradeService gradeService)
    {
        _gradeService = gradeService;
        // _studentService = studentService;
    }

    /// <summary>
    /// Creates a new grade record for a student enrollment.
    /// </summary>
    /// <param name="dto">
    /// The data transfer object (<see cref="CreateGradeDto"/>) containing the details
    /// required to create a new grade record.
    /// </param>
    /// <returns>
    /// A <see cref="GradeDto"/> object representing the newly created grade, including:
    /// <list type="bullet">
    ///   <item><description>EnrollmentId</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>ProcessScore</description></item>
    ///   <item><description>MidtermScore</description></item>
    ///   <item><description>FinalScore</description></item>
    ///   <item><description>TotalScore</description></item>
    ///   <item><description>GradeStatus</description></item>
    /// </list>
    /// If creation fails, returns a BadRequest result with the error message.
    /// </returns>
    [Authorize(Roles = "Admin,Teacher")]
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

    /// <summary>
    /// Updates an existing grade record by its unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the grade to update.</param>
    /// <param name="dto">
    /// The data transfer object (<see cref="UpdateGradeDto"/>) containing the updated
    /// details for the grade record.
    /// </param>
    /// <returns>
    /// A boolean value indicating the result of the update operation:
    /// <list type="bullet">
    ///   <item><description>true — if the grade record was successfully updated</description></item>
    ///   <item><description>false — if no grade record was found with the given id</description></item>
    /// </list>
    /// If the update is successful, returns a NoContent result.  
    /// If the grade is not found, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin,Teacher")]
    [HttpPut("api/grades/{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateGradeDto dto)
    {
        var result = await _gradeService.UpdateAsync(id, dto);

        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Retrieves all grade records for a student by their unique identifier.
    /// </summary>
    /// <param name="id">The unique integer identifier of the student.</param>
    /// <returns>
    /// A <see cref="List{T}"/> of <see cref="GradeDto"/> objects, each containing:
    /// <list type="bullet">
    ///   <item><description>EnrollmentId</description></item>
    ///   <item><description>StudentId</description></item>
    ///   <item><description>StudentCode</description></item>
    ///   <item><description>StudentName</description></item>
    ///   <item><description>SubjectId</description></item>
    ///   <item><description>SubjectCode</description></item>
    ///   <item><description>SubjectName</description></item>
    ///   <item><description>ProcessScore</description></item>
    ///   <item><description>MidtermScore</description></item>
    ///   <item><description>FinalScore</description></item>
    ///   <item><description>TotalScore</description></item>
    ///   <item><description>GradeStatus</description></item>
    /// </list>
    /// If no grades are found for the given student id, returns a NotFound result.
    /// </returns>
    [Authorize(Roles = "Admin,Staff,Teacher,Student")]
    [HttpGet("api/students/{id:int}/grades")]
    public async Task<IActionResult> GetGradesByStudentId(int id)
    {
        if (User.IsInRole("Student"))
        {
            var currentUserId = GetCurrentUserId();

            if (currentUserId is null)
                return Unauthorized();

            // var currentStudentId = await _studentService.GetStudentIdByUserIdAsync(currentUserId.Value);

            // if (currentStudentId != id)
            //     return Forbid();
        }

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

    [Authorize(Roles = "Student")]
    [HttpGet("api/students/me/grades")]
    public async Task<IActionResult> GetCurrentStudentGrades()
    {
        var currentUserId = GetCurrentUserId();

        if (currentUserId is null)
            return Unauthorized();

        // var currentStudentId = await _studentService.GetStudentIdByUserIdAsync(currentUserId.Value);

        // if (currentStudentId is null)
        //     return NotFound("Student profile chưa được liên kết với tài khoản.");

        // var grades = await _gradeService.GetGradesByStudentIdAsync(currentStudentId.Value);

        return Ok(); // ! Add grades
    }
}
