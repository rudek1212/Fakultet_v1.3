using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.File.Command
{
    public class ExternalFileUpdateCommand
    {
        [Required]
        public string Errors { get; set; }
    }
}
