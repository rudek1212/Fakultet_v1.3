using Microsoft.EntityFrameworkCore.Migrations;

namespace Docs.Migrations
{
    public partial class sharefix : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileRecivers_AspNetUsers_UserId",
                table: "FileRecivers");

            migrationBuilder.DropIndex(
                name: "IX_FileRecivers_UserId",
                table: "FileRecivers");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "FileRecivers",
                newName: "Email");

            migrationBuilder.AddColumn<bool>(
                name: "IsSignedBy",
                table: "FileRecivers",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsSignedBy",
                table: "FileRecivers");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "FileRecivers",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FileRecivers_UserId",
                table: "FileRecivers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_FileRecivers_AspNetUsers_UserId",
                table: "FileRecivers",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
