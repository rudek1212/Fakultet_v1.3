using AutoMapper.QueryableExtensions;
using Docs.Db;
using Docs.Transfer;
using Docs.Transfer.File;
using Docs.Transfer.File.Command;
using Docs.Transfer.File.Query;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Docs.Services
{
    public interface IExternalFileService
    {
        Task<FileDto> SaveErrorsAsync(string fileId, ExternalFileUpdateCommand command, string email);

        Task<FileDto> SingAsync(string fileId, string email);

        Task<FileDto> FindAsync(string fileId, string email);

        Task<Stream> ReadAsync(string fileId, string email);

        Task<ListDto<FileDto>> ListAsync(ListFileQuery query, string email);

        Task<string> GetEmailFromTokenAsync(string token);
    }

    public class ExternalFileService : IExternalFileService
    {
        private readonly string FilesPath = $"{Environment.GetEnvironmentVariable("LocalAppData")}/docs";

        private readonly DocsDbContext _context;

        public ExternalFileService(DocsDbContext context)
        {
            _context = context;
        }

        public async Task<FileDto> FindAsync(string fileId, string email)
        {
            return await _context.Files
               .Include(x => x.Recivers)
               .Where(x => x.Recivers.Any(y => y.Email == email))
               .ProjectTo<FileDto>()
               .FirstOrDefaultAsync(x => x.Id == fileId);
        }

        public async Task<string> GetEmailFromTokenAsync(string token)
        {
            return (await _context.Tokens
                .FirstOrDefaultAsync(x => x.Id == token)).Email;
        }

        public Task<ListDto<FileDto>> ListAsync(ListFileQuery query, string email)
        {
            var queryable = _context.Files
                .Include(x => x.Recivers)
                .Where(x => x.CreatedAt < DateTime.Now && DateTime.Now < x.ExpiredAt)
                .Where(x => x.Recivers.Any(y => y.Email == email));

            if (!string.IsNullOrEmpty(query.SearchBy))
            {
                var searchBy = query.SearchBy.Trim().ToLower();

                queryable = queryable.Where(x =>
                   x.Author.ToLower().Contains(searchBy) ||
                   x.Filename.ToLower().Contains(searchBy) ||
                   x.Id.ToLower().Contains(searchBy)
                );
            }

            if (query.FileState.HasValue)
            {
                queryable = queryable.Where(x => x.FileState == query.FileState.Value);
            }

            if (query.FileType.HasValue)
            {
                queryable = queryable.Where(x => x.FileType == query.FileType.Value);
            }

            return queryable
                .ProjectAndPageAsync<Db.Models.File, FileDto>(query);
        }

        public async Task<Stream> ReadAsync(string fileId, string email)
        {
            var file = await _context.Files
                .Include(x => x.Recivers)
                .Where(x => x.Recivers.Any(y => y.Email == email))
                .FirstOrDefaultAsync(x => x.Id == fileId);

            if (file == null) return null;

            return File.OpenRead(file.Filepath);
        }

        public async Task<FileDto> SaveErrorsAsync(string fileId, ExternalFileUpdateCommand command, string email)
        {
            var fileReciver = await _context.FileRecivers
             .FirstOrDefaultAsync(x => x.FileId == fileId && x.Email == email);

            if (fileReciver == null) return null;

            fileReciver.Errors = command.Errors;

            var file = await _context.Files.FirstOrDefaultAsync(x => fileId == x.Id);

            file.FileState = FileState.Rejected;

            await _context.SaveChangesAsync();

            return await FindAsync(fileId, email);
        }

        public async Task<FileDto> SingAsync(string fileId, string email)
        {
            var fileReciver = await _context.FileRecivers
                .FirstOrDefaultAsync(x => x.FileId == fileId && x.Email == email);

            if (fileReciver == null) return null;

            fileReciver.IsSigned = true;
            fileReciver.Errors = null;

            await _context.SaveChangesAsync();

            var file = await _context.Files
                .Include(x => x.Recivers)
                .FirstOrDefaultAsync(x => x.Id == fileId);

            if (file.Recivers.All(x => x.IsSigned))
            {
                file.FileState = FileState.Signed;

                var oldTokens = await _context.Tokens
                    .Where(x => x.FileId == fileId)
                    .ToListAsync();

                _context.RemoveRange(oldTokens);

                await _context.SaveChangesAsync();
            }

            return await FindAsync(fileId, email);
        }
    }
}
