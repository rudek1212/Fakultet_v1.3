using Docs.Tests.Infrastructure;
using Docs.Transfer;
using Docs.Transfer.File;
using Docs.Transfer.File.Command;
using Docs.Transfer.File.Query;
using Docs.Transfer.Profile;
using Docs.Transfer.Profile.Command;
using Docs.Transfer.User;
using Docs.Transfer.User.Command;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace Docs.Tests.Controllers
{
    public class ControllersTests
        : IClassFixture<WebAppFactory<Startup>>
    {
        private readonly WebAppFactory<Startup> _factory;

        public ControllersTests(WebAppFactory<Startup> factory)
        {
            _factory = factory;
        }

        private async Task<HttpClient> GetAuthorizedClientAsync()
        {
            var client = _factory.CreateClient();
            var command = new AuthCommand()
            {
                Email = "admin@docs.pl",
                Password = "1qaz!QAZ"
            };
            var response = await client.PostAsJsonAsync("/auth/authenticate", command);

            var jsonResult = await response.Content.ReadAsAsync<AuthResultDto>();

            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", jsonResult.JwtToken);

            return client;
        }

        [Fact]
        public async Task Authorize_ExceptedBehaviour()
        {
            //Arrange
            var client = _factory.CreateClient();
            var command = new AuthCommand()
            {
                Email = "admin@docs.pl",
                Password = "1qaz!QAZ"
            };

            //Act
            var response = await client.PostAsJsonAsync("/auth/authenticate", command);

            //Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);

            var jsonResult = await response.Content.ReadAsAsync<AuthResultDto>();
            Assert.NotNull(jsonResult);
            Assert.True(!string.IsNullOrEmpty(jsonResult.JwtToken));
            Assert.NotNull(jsonResult.User);
            Assert.Equal(command.Email, jsonResult.User.Email);
        }

        [Fact]
        public async Task Authorize_InvalidModel()
        {
            //Arrange
            var client = _factory.CreateClient();
            var command = new AuthCommand()
            {
                Email = "",
                Password = ""
            };

            //Act
            var response = await client.PostAsJsonAsync("/auth/authenticate", command);

            //Assert
            Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Fact]
        public async Task Authorize_Unauthorized()
        {
            //Arrange
            var client = _factory.CreateClient();
            var command = new AuthCommand()
            {
                Email = "admin@docs.pl",
                Password = "gsdfjhsdfjhsdf"
            };

            //Act
            var response = await client.PostAsJsonAsync("/auth/authenticate", command);

            //Assert
            Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        }

        [Fact]
        public async Task UserList_ExceptedBehaviour()
        {
            //Arrange
            var queryString = "pageSize=20&pageIndex=0";
            var authClient = await GetAuthorizedClientAsync();

            //Act
            var result = await authClient.GetAsync($"/user/list?{queryString}");
            var jsonResult = await result.Content.ReadAsAsync<ListDto<UserDto>>();

            //Assert
            Assert.NotNull(jsonResult);
            Assert.True(jsonResult.Items.Count > 8);
            Assert.Equal(0, jsonResult.PageIndex);
            Assert.True(jsonResult.Count > 9);
            Assert.Equal(20, jsonResult.PageSize);
        }

        [Fact]
        public async Task User_ExceptedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();

            //Act
            var result = await authClient.GetAsync($"/user/{WebAppFactory<Startup>.UserForGet.Id}");
            var jsonResult = await result.Content.ReadAsAsync<UserDto>();

            //Assert
            Assert.NotNull(jsonResult);
            Assert.Equal(WebAppFactory<Startup>.UserForGet.Email, jsonResult.Email);
            Assert.Equal(WebAppFactory<Startup>.UserForGet.Id, jsonResult.Id);
            Assert.Equal(WebAppFactory<Startup>.UserForGet.Name, jsonResult.Name);
            Assert.Equal(WebAppFactory<Startup>.UserForGet.Lastname, jsonResult.Lastname);
        }

        [Fact]
        public async Task UserUpdate_ExceptedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();
            var updateUserCommand = new UpdateUserCommand()
            {
                Role = Roles.User,
                Name = "Andrzej",
                Lastname = "Duda"
            };

            //Act
            var result = await authClient.PutAsJsonAsync($"/user/{WebAppFactory<Startup>.UserForUpdate.Id}", updateUserCommand);

            //Assert
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        }

        [Fact]
        public async Task UserDelete_ExceptedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();

            //Act
            var result = await authClient.DeleteAsync($"/user/{WebAppFactory<Startup>.UserForDelete.Id}");

            //Assert
            Assert.NotNull(result);
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
        }


        [Fact]
        public async Task ListFiles_ExpectedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();
            var query = new ListFileQuery()
            {
                PageSize = 20,
                PageIndex = 0,
            };

            //Act
            var result = await authClient.GetAsync($"/file/list?pageSize={query.PageSize}&pageIndex={query.PageIndex}");
            var jsonResult = await result.Content.ReadAsAsync<ListDto<FileDto>>();

            //Assert
            Assert.NotNull(jsonResult);
            Assert.True(jsonResult.Items.Count > 1);
            Assert.Equal(0, jsonResult.PageIndex);
            Assert.True(jsonResult.Count > 1);
            Assert.Equal(20, jsonResult.PageSize);
        }

        [Fact]
        public async Task GetFile_ExpectedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();

            //Act
            var result = await authClient.GetAsync($"/file/{WebAppFactory<Startup>.FileForGet}");
            var jsonResult = await result.Content.ReadAsAsync<FileDto>();

            //Assert
            Assert.NotNull(jsonResult);
            Assert.Equal(WebAppFactory<Startup>.FileForGet, jsonResult.Id);
        }

        [Fact]
        public async Task UpdateFile_ExpectedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();
            var command = new FileUpdateCommand()
            {
                Author = "testowy update",
                CreatedAt = DateTime.Now.AddDays(3),
                ExpiredAt = DateTime.Now.AddDays(4),
                FileState = FileState.Confirmed,
                FileType = FileType.Claim,
                ShareMails = new string[0],
                Name = "testowy update",
            };

            //Act
            var result = await authClient.PutAsJsonAsync($"/file/{WebAppFactory<Startup>.FileForUpdate}", command);
            var jsonResult = await result.Content.ReadAsAsync<FileDto>();

            //Assert
            Assert.NotNull(jsonResult);
            Assert.Equal(WebAppFactory<Startup>.FileForUpdate, jsonResult.Id);
            Assert.Equal(command.Name, jsonResult.Name);
            Assert.Equal(command.FileType, jsonResult.FileType);
            Assert.Equal(command.FileState, jsonResult.FileState);
            Assert.Equal(command.Author, jsonResult.Author);
        }

        [Fact]
        public async Task DownloadFile_ExpectedBehaviour()
        {
            //Arrange
            var authClient = await GetAuthorizedClientAsync();
            var originalFileStream = File.OpenRead(Path.Combine(Directory.GetCurrentDirectory(), "fakepdf.pdf"));

            //Act
            var result = await authClient.GetAsync($"/file/download/{WebAppFactory<Startup>.FileForGet}");

            //Assert
            Assert.NotNull(result);
            Assert.Equal(HttpStatusCode.OK, result.StatusCode);
            var stream = await result.Content.ReadAsStreamAsync();

            Assert.Equal(originalFileStream.Length, stream.Length);

            for (int i = 0; i < originalFileStream.Length; i++)
            {
                Assert.True(originalFileStream.ReadByte() == stream.ReadByte(), $"Pliki są inne, różnią się na pozycji {i}");
            }
        }
    }
}
