using Docs.Db.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Docs.Db
{
    public class DocsDbContext : IdentityDbContext<DocsUser>
    {
        public DbSet<FileReciver> FileRecivers { get; set; }
        public DbSet<Token> Tokens { get; set; }
        public DbSet<File> Files { get; set; }

        public DocsDbContext() : base()
        {
        }
        public DocsDbContext(DbContextOptions opts) : base(opts)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer(@"Server=(localdb)\mssqllocaldb;Database=Test;Trusted_Connection=True;ConnectRetryCount=0");

            //optionsBuilder.UseSqlServer(@"Server=localhost;Database=db;User Id=sa;Password=1qaz!QAZ;");

            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<FileReciver>()
               .HasKey(x => new { x.FileId, x.Email });

            base.OnModelCreating(builder);
        }
    }
}
