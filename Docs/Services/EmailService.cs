using SendGrid;
using System.Threading.Tasks;
using System.Web;

namespace Docs.Services
{
    public class EmailModel
    {
        public string[] Recivers { get; set; }

        public string Text { get; set; }

        public string Subject { get; set; }

    }

    public interface IEmailService
    {
        Task SendRegisterConfirm(string token, string reciver, string callbackUrl);
        Task SendDocLinkAsync(string id, string reciver, string fileAccessTokenm, string callbackUrl);
        Task SendPasswordResetAsync(string token, string reciver, string callbackUrl);
    }

    public class EmailService : IEmailService
    {
        private readonly SendGridClient _sendGridClient;

        public EmailService(SendGridClient sendGridClient)
        {
            _sendGridClient = sendGridClient;
        }

        public async Task SendDocLinkAsync(string id, string reciver, string fileAccessToken, string callbackUrl)
        {
            var message = new SendGrid.Helpers.Mail.SendGridMessage()
            {
                Subject = "Udostępniony dokument",
                HtmlContent = $"{callbackUrl}/{reciver}/shared/{id}?fileAccessToken={HttpUtility.UrlEncode(fileAccessToken)}",
                PlainTextContent = $"{callbackUrl}/{reciver}/shared/{id}?fileAccessToken={HttpUtility.UrlEncode(fileAccessToken)}",
                From = new SendGrid.Helpers.Mail.EmailAddress("noreply@system-docs.pl")
            };

            message.AddTo(reciver);

            await _sendGridClient.SendEmailAsync(message);
        }

        public async Task SendPasswordResetAsync(string token, string reciver, string callbackUrl)
        {
            var message = new SendGrid.Helpers.Mail.SendGridMessage()
            {
                Subject = "Resetowanie hasła",
                HtmlContent = $"{callbackUrl}/{reciver}?token={HttpUtility.UrlEncode(token)}",
                PlainTextContent = $"{callbackUrl}/{reciver}/?token={HttpUtility.UrlEncode(token)}",
                From = new SendGrid.Helpers.Mail.EmailAddress("noreply@system-docs.pl")
            };

            message.AddTo(reciver);

            await _sendGridClient.SendEmailAsync(message);
        }

        public async Task SendRegisterConfirm(string token, string reciver, string callbackUrl)
        {
            var message = new SendGrid.Helpers.Mail.SendGridMessage()
            {
                Subject = "Potwierdzenie rejestracji",
                HtmlContent = $"{callbackUrl}/{reciver}?token={HttpUtility.UrlEncode(token)}",
                PlainTextContent = $"{callbackUrl}/{reciver}?token={HttpUtility.UrlEncode(token)}",
                From = new SendGrid.Helpers.Mail.EmailAddress("noreply@system-docs.pl")
            };

            message.AddTo(reciver);

            await _sendGridClient.SendEmailAsync(message);
        }
    }
}