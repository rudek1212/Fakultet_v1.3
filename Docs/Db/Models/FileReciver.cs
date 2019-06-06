using System.ComponentModel.DataAnnotations.Schema;

namespace Docs.Db.Models
{
    public class FileReciver
    {
        public string Email { get; set; }

        public string FileId { get; set; }

        [ForeignKey(nameof(FileId))]
        public File File { get; set; }

        public bool IsSigned { get; set; }
        public string Errors { get; internal set; }
    }
}
