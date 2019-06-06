using System;
using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.File.Command
{
    public class FileUploadCommand
    {
        [Required]
        public string Author { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        public DateTime ExpiredAt { get; set; }
        [Required]
        public FileType FileType { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
