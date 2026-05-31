using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentManagement.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEnrollmentGeneratedColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalScore",
                table: "enrollments",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true,
                computedColumnSql: "CASE \r\n                    WHEN `ProcessScore` IS NOT NULL \r\n                     AND `MidtermScore` IS NOT NULL \r\n                     AND `FinalScore` IS NOT NULL\r\n                    THEN `ProcessScore` * 0.20 \r\n                       + `MidtermScore` * 0.30 \r\n                       + `FinalScore` * 0.50\r\n                    ELSE NULL\r\n                  END",
                stored: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(4,2)",
                oldPrecision: 4,
                oldScale: 2,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "GradeStatus",
                table: "enrollments",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true,
                computedColumnSql: "CASE \r\n                    WHEN `ProcessScore` IS NULL \r\n                      OR `MidtermScore` IS NULL \r\n                      OR `FinalScore` IS NULL\r\n                    THEN 'Chưa có điểm'\r\n                    WHEN (`ProcessScore` * 0.20 \r\n                        + `MidtermScore` * 0.30 \r\n                        + `FinalScore` * 0.50) >= 4.0\r\n                    THEN 'Đạt'\r\n                    ELSE 'Rớt'\r\n                  END",
                stored: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20,
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "TotalScore",
                table: "enrollments",
                type: "decimal(4,2)",
                precision: 4,
                scale: 2,
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(4,2)",
                oldPrecision: 4,
                oldScale: 2,
                oldNullable: true,
                oldComputedColumnSql: "CASE \r\n                    WHEN `ProcessScore` IS NOT NULL \r\n                     AND `MidtermScore` IS NOT NULL \r\n                     AND `FinalScore` IS NOT NULL\r\n                    THEN `ProcessScore` * 0.20 \r\n                       + `MidtermScore` * 0.30 \r\n                       + `FinalScore` * 0.50\r\n                    ELSE NULL\r\n                  END");

            migrationBuilder.AlterColumn<string>(
                name: "GradeStatus",
                table: "enrollments",
                type: "varchar(20)",
                maxLength: 20,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20,
                oldNullable: true,
                oldComputedColumnSql: "CASE \r\n                    WHEN `ProcessScore` IS NULL \r\n                      OR `MidtermScore` IS NULL \r\n                      OR `FinalScore` IS NULL\r\n                    THEN 'Chưa có điểm'\r\n                    WHEN (`ProcessScore` * 0.20 \r\n                        + `MidtermScore` * 0.30 \r\n                        + `FinalScore` * 0.50) >= 4.0\r\n                    THEN 'Đạt'\r\n                    ELSE 'Rớt'\r\n                  END")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
