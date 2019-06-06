using Docs.Transfer.User;

namespace Docs.Transfer.Profile
{
    public class AuthResultDto
    {
        public string JwtToken { get; set; }
        public UserBasicDto User { get; set; }
    }
}
