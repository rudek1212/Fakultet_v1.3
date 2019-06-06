using Docs.Transfer;
using System;
using System.Collections.Generic;

namespace Docs.Db.Models
{
    public class File
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Filename { get; set; }

        public string Filepath { get; set; }

        public string Author { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime ExpiredAt { get; set; }

        public ICollection<FileReciver> Recivers { get; set; }

        public FileType FileType { get; set; }

        public FileState FileState { get; set; }
    }
}
