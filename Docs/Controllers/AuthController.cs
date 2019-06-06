using Docs.Services;
using Docs.Transfer.Profile.Command;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Docs.Controllers
{
    [AllowAnonymous]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Zwraca jwt token dla użytkownika, należy go używać w nagłówku "Authorization: Beare {token}"
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]AuthCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            var authResult = await _userService.AuthenticateAsync(command.Email, command.Password);

            if (authResult == null)
                return Unauthorized();

            return Ok(authResult);
        }

        /// <summary>
        /// Rejestruje użytkownika, callback url to adres na który ma być przekierowany użytkownik z poziomu maila
        /// dopisywany jest do niego token po slashu. Przykładowo dla http://test.pl/passwordConfirm powstanie
        /// http://test.pl/passwordConfirm/{token}
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]RegisterCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            if (!await _userService.RegisterUserAsync(command))
                return BadRequest(new string[] { "Adres email zajęty." });

            return Ok();
        }


        /// <summary>
        /// Potwierdza adres email użytkownika
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("confirm")]
        public async Task<IActionResult> Confirm([FromBody]ConfirmRegisterCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            if (!await _userService.ConfirmUserAsync(command))
                return BadRequest(new string[] { "Nie udało się potwierdzić adresu email." });

            return Ok();
        }

        /// <summary>
        /// Wysyła na maila linka to resetowania hasła.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("passwordReset")]
        public async Task<IActionResult> PasswordReset([FromBody]PasswordResetCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            await _userService.ResetPasswordAsync(command);

            return Ok();
        }

        /// <summary>
        /// Wysyła na maila linka to resetowania hasła.
        /// </summary>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPost("passwordResetConfirm")]
        public async Task<IActionResult> PasswordResetConfirm([FromBody]PasswordResetConfirmCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            await _userService.ResetConfirmAsync(command);

            return Ok();
        }
    }
}
