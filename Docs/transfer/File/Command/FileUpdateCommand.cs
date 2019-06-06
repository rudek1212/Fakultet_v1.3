using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.File.Command
{
    public class FileUpdateCommand
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
        [Required]
        public FileState FileState { get; set; }

        public IEnumerable<string> ShareMails { get; set; }
    }
}
