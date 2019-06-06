using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.Profile.Command
{
    public class PasswordResetCommand
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string CallbackUrl { get; set; }
    }
}
