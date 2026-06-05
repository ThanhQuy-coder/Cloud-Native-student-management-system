using StudentManagement.Infrastructure;
using Scalar.AspNetCore;
using StudentManagement.Infrastructure.Data;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore; // Thêm using này để sử dụng tính năng Migrate()

var builder = WebApplication.CreateBuilder(args);
var jwtKey = builder.Configuration["Jwt:Key"]!;
var allowOrigin = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()!;

// Configure CORS to frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactVite", policy =>
    {
        policy.WithOrigins(allowOrigin)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Hỗ trợ nếu sau này bạn dùng Cookie/Credentials
    });
});

// Configure JWT authentication with validation rules
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Add services
builder.Services.AddAuthorization();
builder.Services.AddOpenApi();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddControllers();

var app = builder.Build();

// Check database connection on startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        /* // ĐOẠN CODE CŨ: Chỉ kiểm tra kết nối chứ không tạo bảng dữ liệu (Gây lỗi 500)
        if (dbContext.Database.CanConnect())
        {
            Console.WriteLine("--> Connection DB Success");
        }
        else
        {
            Console.WriteLine("--> Connection DB Failed");
        }
        */

        // ĐOẠN CODE MỚI: Tự động chạy Migration để sinh cấu trúc bảng mới tinh vào Docker MySQL
        Console.WriteLine("--> Kiểm tra và thực thi Migration tự động vào Database...");
        dbContext.Database.Migrate();
        Console.WriteLine("--> Khởi tạo cấu trúc các bảng dữ liệu THÀNH CÔNG!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"--> LỖI HỆ THỐNG DATABASE: {ex.Message}");
    }
}

// Configure middleware and request pipeline
/*
// ĐOẠN CODE CŨ: Bị bọc trong IsDevelopment() khiến Scalar bị ẩn đi khi lên Docker (Production environment)
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}
*/

// ĐOẠN CODE MỚI: Cho phép chạy OpenAPI và giao diện Scalar ở cả môi trường Cloud/Docker Production để kiểm thử
app.MapOpenApi();
app.MapScalarApiReference();

// THỨ TỰ MIDDLEWARE QUAN TRỌNG:
app.UseCors("AllowReactVite");

// Nếu chạy local bị lỗi ép chuyển hướng HTTPS thì comment dòng dưới lại
// app.UseHttpsRedirection(); 

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();