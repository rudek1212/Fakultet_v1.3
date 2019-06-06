using System;
using System.Collections.Generic;

namespace Docs.Transfer.File
{
    public class FileDto
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Filename { get; set; }

        public string Author { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ExpiredAt { get; set; }

        public ICollection<string> Recivers { get; set; }

        public FileType FileType { get; set; }

        public FileState FileState { get; set; }

        public string[] Errors { get; set; }
    }
}
