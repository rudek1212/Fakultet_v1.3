using Docs.Transfer;

namespace Docs.Transfer.User.Command
{
    public class UpdateUserCommand
    {
        public Roles Role { get; set; }

        public string Name { get; set; }

        public string Lastname { get; set; }
    }
}
