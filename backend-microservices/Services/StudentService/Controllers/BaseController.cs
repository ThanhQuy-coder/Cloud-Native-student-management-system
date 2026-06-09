using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;

namespace StudentService.Controllers
{
    public class BaseController : ControllerBase
    {
        /// <summary>
        /// Retrieves the current authenticated user's ID from the claims.
        /// Returns null if the claim is missing or cannot be parsed as an integer.
        /// </summary>
        protected int? GetCurrentUserId()
        {
            var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (int.TryParse(userIdValue, out var userId))
                return userId;

            return null;
        }
    }
}