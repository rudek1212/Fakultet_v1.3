using AutoMapper;
using Docs.Db;
using Docs.Db.Models;
using Docs.Transfer;
using Docs.Transfer.Profile;
using Docs.Transfer.Profile.Command;
using Docs.Transfer.User;
using Docs.Transfer.User.Command;
using Docs.Transfer.User.Query;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Docs.Services
{

    public interface IUserService
    {
        Task<AuthResultDto> AuthenticateAsync(string username, string password);
        Task<ListDto<UserDto>> ListAsync(ListUserQuery query);
        Task<UserDto> GetByIdAsync(string id);
        Task<bool> RegisterUserAsync(RegisterCommand command, bool requiresConfirm = true);
        Task<bool> ConfirmUserAsync(ConfirmRegisterCommand command);
        Task<UserDto> UpdateAsync(string id, UpdateUserCommand command);
        Task DeleteAsync(string id);
        Task<bool> ResetPasswordAsync(PasswordResetCommand command);
        Task<bool> ResetConfirmAsync(PasswordResetConfirmCommand command);
    }

    public class UserService : IUserService
    {
        private readonly DocsDbContext _context;

        private readonly UserManager<DocsUser> _userManager;

        private readonly IEmailService _emailService;

        public UserService(UserManager<DocsUser> userManager, DocsDbContext context, IEmailService emailService)
        {
            _userManager = userManager;

            _context = context;

            _emailService = emailService;
        }

        public async Task<AuthResultDto> AuthenticateAsync(string login, string password)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == login);

            if (user == null || !await _userManager.CheckPasswordAsync(user, password) || !await _userManager.IsEmailConfirmedAsync(user))
            {
                return null;
            }

            var roles = await _userManager.GetRolesAsync(user);

            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Startup.JwtSecret;
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.Email)

                }.Union(roles.Select(x => new Claim(ClaimTypes.Role, x)))),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return new AuthResultDto()
            {
                JwtToken = tokenHandler.WriteToken(token),
                User = Mapper.Map<UserBasicDto>(user)
            };
        }

        public async Task<ListDto<UserDto>> ListAsync(ListUserQuery query)
        {
            //Geeeeeeez this .net core identity :| 
            var queryable = _context.UserRoles
                .Join(_context.Users, x => x.UserId, x => x.Id, (x, y) => new { x.RoleId, User = y })
                .Join(_context.Roles,
                    x => x.RoleId,
                    x => x.Id,
                    (x, y) => new { x.User, Role = y.Name == "User" ? Roles.User : y.Name == "Externaluser" ? Roles.ExternalUser : Roles.Admin }
                );

            if (!string.IsNullOrEmpty(query.SearchBy))
            {
                var searchBy = query.SearchBy.Trim().ToLower();

                queryable = queryable.Where(x =>
                   x.User.Email.ToLower().Contains(searchBy) ||
                   x.User.Lastname.ToLower().Contains(searchBy) ||
                   x.User.Name.ToLower().Contains(searchBy)
                );
            }

            var results = await queryable
                .Where(x => x.Role != Roles.Admin)
                .Skip(query.PageIndex * query.PageSize)
                .Take(query.PageSize)
                .Select(x => new UserDto()
                {
                    Id = x.User.Id,
                    Role = x.Role,
                    Name = x.User.Name,
                    Email = x.User.Email,
                    Lastname = x.User.Lastname
                }).ToListAsync();

            return new ListDto<UserDto>()
            {
                Count = await queryable.CountAsync(),
                Items = results,
                PageIndex = query.PageIndex,
                PageSize = query.PageSize
            };
        }

        public async Task<UserDto> GetByIdAsync(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null) return null;

            var role = await _userManager.GetRolesAsync(user);

            var result = Mapper.Map<UserDto>(user);

            result.Role = Enum.Parse<Roles>(role.SingleOrDefault());

            return result;
        }

        public async Task<bool> RegisterUserAsync(RegisterCommand command, bool requiresConfirm = true)
        {
            try
            {
                var user = new DocsUser()
                {
                    Email = command.Email,
                    UserName = command.Email,
                    Name = command.Name,
                    Lastname = command.Lastname
                };

                var result = await _userManager.CreateAsync(user, command.Password);

                var confirmToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                if (result.Succeeded)
                {
                    await _emailService.SendRegisterConfirm(confirmToken, user.Email, command.CallbackUrl); 
                }

                return result.Succeeded;
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
                return false;
            }
        }

        public async Task<bool> ConfirmUserAsync(ConfirmRegisterCommand command)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(command.Email);

                var confirmResult = await _userManager.ConfirmEmailAsync(user, command.Token);
                var addRoleResult = await _userManager.AddToRoleAsync(user, nameof(Roles.ExternalUser));

                return user != null && confirmResult.Succeeded && addRoleResult.Succeeded;
            }
            catch (Exception ex)
            {
                Trace.WriteLine(ex.Message);
            }

            return false;
        }

        public async Task<UserDto> UpdateAsync(string id, UpdateUserCommand command)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null) return null;

            user.Name = command.Name;

            user.Lastname = command.Lastname;

            var toDelete = await _context.UserRoles.Where(x => x.UserId == id).ToListAsync();

            _context.UserRoles.RemoveRange(toDelete);

            await _context.SaveChangesAsync();

            await _userManager.AddToRoleAsync(user, command.Role.ToString());

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task DeleteAsync(string id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user != null)
                await _userManager.DeleteAsync(user);
        }

        public async Task<bool> ResetPasswordAsync(PasswordResetCommand command)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == command.Email);

            if (user == null)
            {
                return false;
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            await _emailService.SendPasswordResetAsync(token, command.Email, command.CallbackUrl);

            return true;
        }

        public async Task<bool> ResetConfirmAsync(PasswordResetConfirmCommand command)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == command.Email);

            if (user == null)
            {
                return false;
            }

            var result = await _userManager.ResetPasswordAsync(user, command.Token, command.Password);

            return result.Succeeded;
        }
    }
}
