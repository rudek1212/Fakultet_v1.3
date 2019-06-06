using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.File.Command
{
    public class FileShareCommand
    {
        [Required]
        public string CallbackUrl { get; set; }
    }
}
