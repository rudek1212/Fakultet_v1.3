using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.Profile.Command
{
    public class ConfirmRegisterCommand
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public string Email { get; set; }
    }
}
