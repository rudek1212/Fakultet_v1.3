using Docs.Services;
using Docs.Transfer;
using Docs.Transfer.File.Command;
using Docs.Transfer.File.Query;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MimeTypes;
using System.IO;
using System.Threading.Tasks;

namespace Docs.Controllers
{
    [Route("file")]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;

        public FileController(IFileService fileService)
        {
            _fileService = fileService;
        }

        /// <summary>
        /// Pobranie danych pliku
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,User")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAsync(string id)
        {
            var file = await _fileService.FindAsync(id);

            if (file == null)
                return NotFound();

            return Ok(file);

        }

        /// <summary>
        /// Pobranie pliku
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,User")]
        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(string id)
        {
            var file = await _fileService.FindAsync(id);

            if (file == null)
            {
                return NotFound();
            }

            var fileStream = await _fileService.ReadAsync(id);

            return File(fileStream, MimeTypeMap.GetMimeType(Path.GetExtension(file.Filename)), file.Filename);
        }

        /// <summary>
        /// Lista plików
        /// </summary>
        /// <param name="query"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,User")]
        [HttpGet("list")]
        public async Task<IActionResult> ListAsync([FromQuery] ListFileQuery query)
        {
            return Ok(await _fileService.ListAsync(query));
        }

        /// <summary>
        /// Upload pliku, format daty "2001-02-11T12:10:11.123Z"
        /// </summary>
        /// <param name="command"></param>
        /// <param name="file"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,User")]
        [HttpPost]
        public async Task<IActionResult> Upload([FromForm] FileUploadCommand command, IFormFile file)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            await _fileService.UploadAsync(file.OpenReadStream(), command, file.FileName);

            return Ok();
        }

        /// <summary>
        /// Aktualizacja pliku
        /// </summary>
        /// <param name="command"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,User")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] FileUpdateCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            var result = await _fileService.UpdateAsync(id, command);

            if(result == null)
            {
                return BadRequest(new []{"Nie znaleziono pliku."});
            }

            return Ok(result);
        }

        /// <summary>
        /// Udostępnianie dokumentu, adres w zwrotce z maila będzie reprezentowany jako {callbackUrl}/{reciver}/shared/{fileId}/{fileAccessToken}
        /// </summary>          
        /// <param name="command"></param>
        /// <param name="id"></param>
        /// <returns></returns>
        [Authorize(Roles = "Admin,User")]
        [HttpPut("share/{id}")]
        public async Task<IActionResult> Share(string id, [FromBody] FileShareCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState.GetErrorsArray());
            }

            await _fileService.ShareAsync(id, command);

            return Ok();
        }
    }
}
