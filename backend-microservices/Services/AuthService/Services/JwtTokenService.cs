using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AuthService.Models;
using AuthService.Services;
using Microsoft.IdentityModel.Tokens;

namespace AuthService.Services;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    /// <summary>
    /// Generates a JWT token for a given user with claims for authentication and authorization.
    /// </summary>
    /// <param name="user">
    /// The <see cref="User"/> entity containing the user details required to generate the token.
    /// </param>
    /// <returns>
    /// A <see cref="string"/> representing the generated JWT token, which includes claims:
    /// <list type="bullet">
    ///   <item><description>NameIdentifier — the unique user Id</description></item>
    ///   <item><description>Name — the username</description></item>
    ///   <item><description>Role — the role name assigned to the user</description></item>
    /// </list>
    /// The token is signed using HMAC-SHA256 and expires after 2 hours.
    /// </returns>
    public string GenerateToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"]!;
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.RoleName)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}