using System.ComponentModel.DataAnnotations;

namespace Docs.Transfer.Profile.Command
{
    public class RegisterCommand
    {
        [Required]
        [MaxLength(100)]
        public string Email { get; set; }

        [Required]
        [MaxLength(100)]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public string Lastname { get; set; }

        [Required]
        public string CallbackUrl { get; set; }
    }
}
