using Docs.Transfer;
using System.ComponentModel.DataAnnotations.Schema;

namespace Docs.Db.Models
{
    public class Token
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public TokenType Type { get; set; }

        public string FileId { get; set; }

        [ForeignKey(nameof(FileId))]
        public File File { get; set; }
    }
}
