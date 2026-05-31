using Microsoft.AspNetCore.Mvc;
using StudentManagement.Application.DTOs.Auth;
using StudentManagement.Application.Interfaces.Services;

namespace Project.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result is null)
            return Unauthorized("Username hoặc password không đúng.");

        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);

        if (result is null)
            return BadRequest("Username đã tồn tại.");

        return Ok(result);
    }
}