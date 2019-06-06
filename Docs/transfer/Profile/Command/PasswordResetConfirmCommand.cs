using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.Profile.Command
{
    public class PasswordResetConfirmCommand
    {
        [Required]
        public string Email { get; set; }

        [Required]
        public string Token { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
