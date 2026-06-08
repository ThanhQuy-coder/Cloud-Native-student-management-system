using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Authenticates a user and returns a JWT token upon successful login.
    /// </summary>
    /// <param name="dto">
    /// Login credentials containing the username and password.
    /// </param>
    /// <returns>
    /// Returns the authenticated user's information, including:
    /// UserId, Username, RoleName, and JWT Token.
    /// Returns 401 Unauthorized if the credentials are invalid.
    /// </returns>
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (result is null)
            return Unauthorized("Username hoặc password không đúng.");

        return Ok(result);
    }

    /// <summary>
    /// Registers a new user and returns an authentication token.
    /// </summary>
    /// <param name="dto">
    /// Registration information containing the username and password.
    /// </param>
    /// <returns>
    /// Returns the newly created user's information, including:
    /// UserId, Username, RoleName, and JWT Token.
    /// Returns an error if the username already exists.
    /// </returns>
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var result = await _authService.RegisterAsync(dto);

        if (result is null)
            return BadRequest("Username đã tồn tại.");

        return Ok(result);
    }
}