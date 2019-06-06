using Docs.Services;
using Docs.Transfer.File.Command;
using Docs.Transfer.File.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimeTypes;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Docs.Controllers
{
    [AllowAnonymous]
    public class ExternalUserController : ControllerBase
    {
        private readonly IExternalFileService _externalFileService;

        public ExternalUserController(IExternalFileService externalFileService)
        {
            _externalFileService = externalFileService;
        }

        private async Task<string> GetEmailAsync(string accessToken)
        {
            string email = string.Empty;
            if (User != null && User.Identity != null && User.Identity.IsAuthenticated)
            {
                email = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email).Value;
            }
            if (!string.IsNullOrEmpty(accessToken))
            {
                email = await _externalFileService.GetEmailFromTokenAsync(accessToken);
            }
            return email;
        }

        /// <summary>
        /// Pobieranie informacji o pliku 
        /// </summary>
        /// <param name="accessToken"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet("{accessToken}/{id}")]
        public async Task<IActionResult> GetAsync(string accessToken, string id)
        {
            var email = await GetEmailAsync(accessToken);

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            var file = await _externalFileService.FindAsync(id, email);

            if (file == null)
                return NotFound();

            return Ok(file);
        }

        /// <summary>
        /// Pobranie pliku do podglądu
        /// </summary>
        /// <param name="id"></param>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        [HttpGet("{accessToken}/download/{id}")]
        public async Task<IActionResult> Download(string id, string accessToken)
        {
            var email = await GetEmailAsync(accessToken);

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            var file = await _externalFileService.FindAsync(id, email);

            if (file == null)
            {
                return NotFound();
            }

            var fileStream = await _externalFileService.ReadAsync(id, email);

            return File(fileStream, MimeTypeMap.GetMimeType(Path.GetExtension(file.Filename)), file.Filename);
        }

        /// <summary>
        /// Lista plików dostępnych dla użytkownika
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [HttpGet("/externalUser/list")]
        [Authorize(Roles = "ExternalUser")]
        public async Task<IActionResult> ListAsync([FromQuery] ListFileQuery query)
        {
            string email = string.Empty;
            if (User.Identity.IsAuthenticated)
            {
                email = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email).Value;
            }

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            return Ok(await _externalFileService.ListAsync(query, email));
        }


        /// <summary>
        /// Podpisanie dokumentu, jeśli wszyscy użytkownicy podpiszą ten dokument, zmieni się jego status.
        /// </summary>
        /// <param name="id"></param>
        /// <param name="accessToken"></param>
        /// <returns></returns>
        [HttpPut("{accessToken}/sign/{id}")]
        public async Task<IActionResult> SignAsync(string id, string accessToken)
        {
            var email = await GetEmailAsync(accessToken);

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            var file = await _externalFileService.SingAsync(id, email);

            if (file == null)
            {
                return NotFound();
            }

            return Ok(file);
        }

        /// <summary>
        /// Zgłoszenie zastrzeżeń do dokumentu
        /// </summary>
        /// <param name="id"></param>
        /// <param name="accessToken"></param>
        /// <param name="command"></param>
        /// <returns></returns>
        [HttpPut("{accessToken}/errors/{id}")]
        public async Task<IActionResult> PostErrorsAsync(string id, string accessToken, [FromBody] ExternalFileUpdateCommand command)
        {
            var email = await GetEmailAsync(accessToken);

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized();
            }

            var file = await _externalFileService.SaveErrorsAsync(id, command, email);

            if (file == null)
            {
                return NotFound();
            }

            return Ok(file);
        }
    }
}
