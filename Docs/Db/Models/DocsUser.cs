using Microsoft.AspNetCore.Identity;

namespace Docs.Db.Models
{
    public class DocsUser : IdentityUser
    {
        public string Name { get; set; }

        public string Lastname { get; set; }
    }
}
