using AutoMapper.QueryableExtensions;
using Docs.Db;
using Docs.Db.Models;
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
    public interface IFileService
    {
        Task<FileDto> UpdateAsync(string fileId, FileUpdateCommand command);

        Task<FileDto> FindAsync(string fileId);

        Task<Stream> ReadAsync(string fileId);

        Task<ListDto<FileDto>> ListAsync(ListFileQuery query);

        Task ShareAsync(string id, FileShareCommand command);

        Task UploadAsync(Stream stream, FileUploadCommand command, string fileName);
    }


    public class FileService : IFileService
    {
        private readonly string FilesPath = $"{Environment.GetEnvironmentVariable("LocalAppData")}/docs";

        private readonly DocsDbContext _context;

        private readonly IEmailService _emailService;

        public FileService(DocsDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
            Directory.CreateDirectory(FilesPath);
        }

        public async Task<FileDto> FindAsync(string fileId)
        {
            return await _context.Files
                .ProjectTo<FileDto>()
                .FirstOrDefaultAsync(x => x.Id == fileId);
        }

        public Task<ListDto<FileDto>> ListAsync(ListFileQuery query)
        {
            var queryable = _context.Files.AsQueryable();

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

        public async Task<Stream> ReadAsync(string fileId)
        {
            var file = await _context.Files.FirstOrDefaultAsync(x => x.Id == fileId);

            if (file == null) return null;

            return System.IO.File.OpenRead(file.Filepath);
        }

        public async Task ShareAsync(string id, FileShareCommand command)
        {
            var recivers = await _context.FileRecivers
                .Where(x => x.FileId == id)
                .ToListAsync();

            var file = await _context.Files.FirstOrDefaultAsync(x=>x.Id == id);

            file.FileState = FileState.Sent;

            await _context.SaveChangesAsync();

            foreach (var reciver in recivers)
            {
                var fileAccessToken = string.Empty;

                var token = new Token()
                {
                    Type = TokenType.FileView,
                    Email = reciver.Email,
                    FileId = id,
                };

                await _context.Tokens.AddAsync(token);

                await _context.SaveChangesAsync();

                await _emailService.SendDocLinkAsync(id, reciver.Email, token.Id, command.CallbackUrl);
            }
        }

        public async Task<FileDto> UpdateAsync(string fileId, FileUpdateCommand command)
        {
            var file = await _context.Files
                .Include(x => x.Recivers)
                .FirstOrDefaultAsync(x => x.Id == fileId);

            if (file == null) return null;

            file.Author = command.Author;
            file.CreatedAt = command.CreatedAt;
            file.ExpiredAt = command.ExpiredAt;
            file.Name = command.Name;
            file.FileType = command.FileType;
            file.FileState = command.FileState;

            file.Recivers.Clear();

            await _context.SaveChangesAsync();

            foreach (var email in command.ShareMails)
            {
                file.Recivers.Add(new FileReciver()
                {
                    Email = email,
                    FileId = fileId
                });
            }

            await _context.SaveChangesAsync();

            return await FindAsync(fileId);
        }

        public async Task UploadAsync(Stream stream, FileUploadCommand command, string fileName)
        {
            var fileIdent = Guid.NewGuid().ToString();
            var filePath = Path.Combine(FilesPath, fileIdent);

            //Ensure that stream is at begining
            stream.Position = 0;

            using (var fs = System.IO.File.Create(filePath))
            {
                await stream.CopyToAsync(fs);

                //Ensure data is flushed
                await fs.FlushAsync();
            }

            var file = new Db.Models.File()
            {
                Author = command.Author,
                CreatedAt = command.CreatedAt,
                ExpiredAt = command.ExpiredAt,
                FileState = FileState.Created,
                Filepath = filePath,
                Filename = fileName,
                FileType = command.FileType,
                Name = command.Name
            };

            _context.Files.Add(file);

            await _context.SaveChangesAsync();
        }
    }
}
