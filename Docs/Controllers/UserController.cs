using Docs.Services;
using Docs.Transfer;
using Docs.Transfer.User.Command;
using Docs.Transfer.User.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Docs.Controllers.Admin
{
    [Authorize(Roles = nameof(Roles.Admin))]
    [Route("user")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        /// <summary>
        /// Pobranie danych użytkownika
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(string id)
        {
            var user = await _userService.GetByIdAsync(id);

            if (user == null)
                return NotFound();

            return Ok(user);

        }

        /// <summary>
        /// Lista użytkowników
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] ListUserQuery query)
        {
            return Ok(await _userService.ListAsync(query));
        }

        /// <summary>
        /// Aktualizacja użytkownika
        /// 1 - pracownik
        /// 2 - zewnętrzny
        /// </summary>
        /// <param name="id"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAsync(string id, [FromBody]UpdateUserCommand command)
        {
            if (command.Role == Roles.Admin)
            {
                return BadRequest(new[] { "Nieprawidłowa rola." });
            }

            var user = await _userService.UpdateAsync(id, command);

            if (user == null)
                return NotFound();

            return Ok();
        }

        /// <summary>
        /// Usuwanie użytkownika
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(string id)
        {
            await _userService.DeleteAsync(id);

            return Ok();
        }
    }
}
