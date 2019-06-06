using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.Profile.Command
{
    public class AuthCommand
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
