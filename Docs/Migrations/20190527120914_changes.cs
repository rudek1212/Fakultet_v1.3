using Microsoft.EntityFrameworkCore.Migrations;

namespace Docs.Migrations
{
    public partial class changes : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Errors",
                table: "Files");

            migrationBuilder.RenameColumn(
                name: "IsSignedBy",
                table: "FileRecivers",
                newName: "IsSigned");

            migrationBuilder.AddColumn<string>(
                name: "Errors",
                table: "FileRecivers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Errors",
                table: "FileRecivers");

            migrationBuilder.RenameColumn(
                name: "IsSigned",
                table: "FileRecivers",
                newName: "IsSignedBy");

            migrationBuilder.AddColumn<string>(
                name: "Errors",
                table: "Files",
                nullable: true);
        }
    }
}
