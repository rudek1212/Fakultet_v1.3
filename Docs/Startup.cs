using AutoMapper;
using Docs.Db;
using Docs.Db.Models;
using Docs.Services;
using Docs.Transfer;
using Docs.Transfer.File;
using Docs.Transfer.User;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using SendGrid;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Docs
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

            Mapper.Initialize(x =>
            {
                x.CreateMap<DocsUser, UserBasicDto>();
                x.CreateMap<Db.Models.File, FileDto>()
                    .ForMember(y => y.Errors, y => y.MapFrom(z => z.Recivers.Select(a => a.Errors)))
                    .ForMember(y => y.Recivers, y => y.MapFrom(z => z.Recivers.Select(a => a.Email)));
                x.CreateMap<DocsUser, UserDto>()
                    .ForMember(y => y.Role, y => y.Ignore());
            });
        }

        public IConfiguration Configuration { get; }
        public static byte[] JwtSecret = Encoding.ASCII.GetBytes("asfhnasodifjh aosdifbnahse rbhgapweo984tryaw0o3v 47yPQAW398N45by");

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(options =>
                {
                    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.DateFormatString = "yyyy-MM-ddTHH:mm:ss.fffZ";
                    options.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                });

            services.Configure<IdentityOptions>(options =>
                   {
                        // Password settings.
                        options.Password.RequireDigit = false;
                       options.Password.RequireLowercase = false;
                       options.Password.RequireNonAlphanumeric = false;
                       options.Password.RequireUppercase = false;
                       options.Password.RequiredLength = 8;
                       
                   });

            services.AddDbContext<DocsDbContext>((x) =>
            {
                x.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=Test;Trusted_Connection=True;ConnectRetryCount=0");
            });



            services.AddIdentity<DocsUser, IdentityRole>()
                .AddDefaultTokenProviders();

            services.AddScoped<IRoleStore<IdentityRole>, RoleStore<IdentityRole>>((x) => new RoleStore<IdentityRole>(x.GetService<DocsDbContext>()));

            services.AddScoped<IUserStore<DocsUser>, UserStore<DocsUser>>((x) => new UserStore<DocsUser>(x.GetService<DocsDbContext>()));

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Docs API", Version = "v1" });

                var security = new Dictionary<string, IEnumerable<string>>
                {
                    {"Bearer", new string[] { }},
                };

                c.AddSecurityRequirement(security);

                //Dodaje komentarze z kodu do swaggera
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);

                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
            });

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(JwtSecret),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            services.AddSingleton(new SendGridClient("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"));

            services.AddSingleton<IEmailService>((x) => new EmailService(x.GetService<SendGridClient>()));

            services.AddScoped<IUserService, UserService>();

            services.AddScoped<IFileService, FileService>();

            services.AddScoped<IExternalFileService, ExternalFileService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSwagger();

            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Docs API V1");
            });

            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseAuthentication();

            app.UseMvc();

            Task.Run(async () =>
            {
                using (var scope = app.ApplicationServices.CreateScope())
                {
                    var roleManager = scope.ServiceProvider.GetService<RoleManager<IdentityRole>>();
                    async Task EnsureRoleIsCreated(IdentityRole role)
                    {
                        if (!await roleManager.RoleExistsAsync(role.Name))
                        {
                            await roleManager.CreateAsync(role);
                        }
                    }

                    foreach (var role in new[] { nameof(Roles.Admin), nameof(Roles.ExternalUser), nameof(Roles.User) })
                    {
                        await EnsureRoleIsCreated(new IdentityRole()
                        {
                            Name = role
                        });
                    }

                    var userManager = scope.ServiceProvider.GetService<UserManager<DocsUser>>();

                    if (await userManager.FindByEmailAsync("admin@docs.pl") == null)
                    {
                        var user = new DocsUser()
                        {
                            UserName = "admin@docs.pl",
                            Email = "admin@docs.pl",
                            Name = "Administrator",
                            Lastname = "    ",
                        };

                        var u = await userManager.CreateAsync(user, "1qaz!QAZ");

                        var token = await userManager.GenerateEmailConfirmationTokenAsync(user);
                        await userManager.ConfirmEmailAsync(user, token);

                        await userManager.AddToRoleAsync(user, "Admin");
                    }
                }
            }).Wait(); // Not so good :P, but it runs :D
        }
    }
}
