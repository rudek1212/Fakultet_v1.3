using Docs.Db;
using Docs.Db.Models;
using Docs.Services;
using Docs.Transfer;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.IO;
using System.Linq;

namespace Docs.Tests.Infrastructure
{
    public class WebAppFactory<TStartup>
    : WebApplicationFactory<TStartup> where TStartup : class
    {
        public static DocsUser UserForGet { get; set; }
        public static DocsUser UserForUpdate { get; set; }
        public static DocsUser UserForDelete { get; set; }

        public static string FileForGet { get; set; }
        public static string FileForUpdate { get; set; }
        public static string FileForDelete { get; set; }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureServices(services =>
            {
                services.AddDbContext<DocsDbContext>((x) =>
                 {
                     x.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=AppTests;Trusted_Connection=True;ConnectRetryCount=0");
                 });


                using (var scope = services.BuildServiceProvider().CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<DocsDbContext>();

                    db.Database.EnsureDeleted();

                    db.Database.EnsureCreated();

                    foreach (var role in new[] { nameof(Roles.Admin), nameof(Roles.ExternalUser), nameof(Roles.User) })
                    {
                        if (!db.Roles.Any(x => x.Name == role))
                        {
                            db.Add(new IdentityRole()
                            {
                                Name = role
                            });
                        }
                    }

                    db.SaveChanges();

                    var roles = db.Roles.ToList();

                    for (int i = 0; i < 10; i++)
                    {
                        var user = db.Users.Add(new Db.Models.DocsUser()
                        {
                            Email = $"text{i}@gmail.com",
                            Name = $"Test{i}",
                            Lastname = $"test{i}",
                            UserName = $"text{i}@gmail.com",
                            EmailConfirmed = true,
                            SecurityStamp = $"sadgasdg{i}"
                        });

                        if (i == 0)
                        {
                            UserForGet = user.Entity;
                        }
                        if (i == 1)
                        {
                            UserForUpdate = user.Entity;
                        }
                        if (i == 2)
                        {
                            UserForDelete = user.Entity;
                        }

                        db.UserRoles.Add(new IdentityUserRole<string>
                        {
                            UserId = user.Entity.Id,
                            RoleId = roles.FirstOrDefault(x => x.Name == nameof(Roles.ExternalUser)).Id,
                        });

                        db.SaveChanges();
                    }

                    var fileService = new FileService(db, new EmailFakeService());

                    fileService.UploadAsync(System.IO.File.OpenRead(Path.Combine(Directory.GetCurrentDirectory(), "fakepdf.pdf")), new Transfer.File.Command.FileUploadCommand()
                    {
                        Author = "Test",
                        CreatedAt = DateTime.Now,
                        ExpiredAt = DateTime.Now,
                        FileType = FileType.Claim,
                        Name = "abcd",

                    }, "fakepdf.pdf").Wait();

                    fileService.UploadAsync(System.IO.File.OpenRead(Path.Combine(System.IO.Directory.GetCurrentDirectory(), "fakepdf.pdf")), new Transfer.File.Command.FileUploadCommand()
                    {
                        Author = "Test",
                        CreatedAt = DateTime.Now,
                        ExpiredAt = DateTime.Now,
                        FileType = FileType.Claim,
                        Name = "abcd2",

                    }, "fakepdf.pdf").Wait();


                    fileService.UploadAsync(System.IO.File.OpenRead(Path.Combine(System.IO.Directory.GetCurrentDirectory(), "fakepdf.pdf")), new Transfer.File.Command.FileUploadCommand()
                    {
                        Author = "Test",
                        CreatedAt = DateTime.Now,
                        ExpiredAt = DateTime.Now,
                        FileType = FileType.Claim,
                        Name = "abcd3",

                    }, "fakepdf.pdf").Wait();

                    FileForGet = db.Files.Skip(0).Take(1).FirstOrDefault().Id;
                    FileForDelete = db.Files.Skip(1).Take(1).FirstOrDefault().Id;
                    FileForUpdate = db.Files.Skip(2).Take(1).FirstOrDefault().Id;
                }
            });
        }
    }
}
