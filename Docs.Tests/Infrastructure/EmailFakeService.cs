using Docs.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Docs.Tests.Infrastructure
{
    public class EmailFakeService : IEmailService
    {
        public List<FakeEmailInfo> SentMails =
            new List<FakeEmailInfo>();

        public Task SendDocLinkAsync(string id, string reciver, string fileAccessToken, string callbackUrl)
        {
            SentMails.Add(new FakeEmailInfo(id, reciver, fileAccessToken, callbackUrl));

            return Task.CompletedTask;
        }

        public Task SendPasswordResetAsync(string token, string reciver, string callbackUrl)
        {
            SentMails.Add(new FakeEmailInfo(string.Empty, reciver, token, callbackUrl));

            return Task.CompletedTask;
        }

        public Task SendRegisterConfirm(string token, string reciver, string callbackUrl)
        {
            SentMails.Add(new FakeEmailInfo(string.Empty, reciver, token, callbackUrl));

            return Task.CompletedTask;
        }
    }

    public class FakeEmailInfo
    {
        public string Reciver { get; set; }

        public string Token { get; set; }

        public string CallbackUrl { get; set; }

        public string Id { get; set; }

        public FakeEmailInfo(string id, string reciver, string token, string callbackUrl)
        {
            Reciver = reciver;
            Id = id;
            Token = token;
            CallbackUrl = callbackUrl;
        }
    }
}
