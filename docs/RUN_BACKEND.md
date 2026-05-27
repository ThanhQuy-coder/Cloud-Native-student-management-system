# Hướng dẫn chạy Backend - Student Management

## 1. Yêu cầu môi trường

Trước khi chạy backend, cần cài đặt:

- .NET SDK
- Visual Studio Code hoặc Visual Studio
- MySQL Server
- Git
- Entity Framework Core CLI

Kiểm tra .NET SDK:

```bash
dotnet --version
```

Kiểm tra Git:

```bash
git --version
```

---

## 2. Di chuyển vào thư mục backend

Từ thư mục gốc của dự án, chạy:

```bash
cd backend
```

Kiểm tra trong thư mục backend có file solution:

```text
StudentManagement.sln
```

---

## 3. Restore package

Chạy lệnh:

```bash
dotnet restore
```

Lệnh này dùng để tải lại các package cần thiết cho project.

---

## 4. Build project

Chạy lệnh:

```bash
dotnet build
```

Nếu build thành công, terminal sẽ hiển thị tương tự:

```text
Build succeeded.
```

Nếu có lỗi, cần đọc message trong terminal để biết project nào đang bị lỗi.

---

## 5. Cấu hình connection string

> Đang cập nhật

## 6. Cài Entity Framework Core CLI

Nếu chưa cài EF Core CLI, chạy:

```bash
dotnet tool install --global dotnet-ef
```

Kiểm tra đã cài thành công chưa:

```bash
dotnet ef --version
```

Nếu đã cài rồi nhưng muốn cập nhật:

```bash
dotnet tool update --global dotnet-ef
```

---

## 7. Tạo migration

Chạy lệnh trong thư mục `backend`:

```bash
dotnet ef migrations add InitialCreate \
  --project StudentManagement.Infrastructure \
  --startup-project StudentManagement.Api
```

Nếu dùng PowerShell trên Windows, có thể viết một dòng:

```bash
dotnet ef migrations add InitialCreate --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

Ý nghĩa:

- `--project`: project chứa DbContext và migration
- `--startup-project`: project khởi chạy ứng dụng, thường là API

---

## 8. Cập nhật database

Sau khi tạo migration, chạy:

```bash
dotnet ef database update \
  --project StudentManagement.Infrastructure \
  --startup-project StudentManagement.Api
```

Nếu dùng PowerShell trên Windows:

```bash
dotnet ef database update --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

Lệnh này sẽ tạo database và các bảng tương ứng trong MySQL.

---

## 9. Chạy backend

Chạy API bằng lệnh:

```bash
dotnet run --project StudentManagement.Api
```

Sau khi chạy thành công, terminal sẽ hiển thị URL dạng:

```text
https://localhost:xxxx
http://localhost:xxxx
```

Ví dụ:

```text
https://localhost:7081
http://localhost:5081
```

---

## 10. Mở Swagger

Sau khi chạy backend, mở trình duyệt và truy cập:

```text
https://localhost:xxxx/swagger
```

Ví dụ:

```text
https://localhost:7081/swagger
```

Swagger dùng để kiểm tra API trực tiếp trên trình duyệt.

---

## 11. Các lệnh thường dùng

## Restore package

```bash
dotnet restore
```

## Build solution

```bash
dotnet build
```

## Run API

```bash
dotnet run --project StudentManagement.Api
```

## Tạo migration

```bash
dotnet ef migrations add MigrationName --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

Ví dụ:

```bash
dotnet ef migrations add AddStudentTable --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

## Update database

```bash
dotnet ef database update --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

## Xóa migration mới nhất

```bash
dotnet ef migrations remove --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
```

---

## 12. Một số lỗi thường gặp

## 12.1. Không nhận lệnh dotnet ef

Lỗi:

```text
Could not execute because the specified command or file was not found.
```

Cách xử lý:

```bash
dotnet tool install --global dotnet-ef
```

Sau đó mở lại terminal.

---

## 12.2. Sai connection string

Lỗi thường gặp:

```text
Access denied for user
Unable to connect to any of the specified MySQL hosts
```

Cách xử lý:

- Kiểm tra MySQL đã chạy chưa
- Kiểm tra user
- Kiểm tra password
- Kiểm tra port, thường là `3306`
- Kiểm tra database name

---

## 12.3. Không tìm thấy DbContext

Lỗi thường gặp:

```text
Unable to create a DbContext
```

Cách xử lý:

- Kiểm tra `AppDbContext` nằm trong Infrastructure
- Kiểm tra Api đã reference Infrastructure chưa
- Kiểm tra đã đăng ký DbContext trong `Program.cs` chưa

Ví dụ:

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    );
});
```

---

## 13. Quy trình chạy backend từ đầu

Tóm tắt các bước:

```bash
cd backend
dotnet restore
dotnet build
dotnet ef database update --project StudentManagement.Infrastructure --startup-project StudentManagement.Api
dotnet run --project StudentManagement.Api
```

Sau đó mở:

```text
https://localhost:xxxx/swagger
```

---

## 14. Ghi chú cho thành viên nhóm

Khi một thành viên mới clone source code về, chỉ cần làm theo thứ tự:

1. Cài .NET SDK
2. Cài MySQL
3. Cấu hình connection string
4. Chạy `dotnet restore`
5. Chạy `dotnet build`
6. Chạy `dotnet ef database update`
7. Chạy `dotnet run --project StudentManagement.Api`
8. Mở Swagger để kiểm tra API

---

## 15. Kết luận

File này dùng để hướng dẫn cách chạy backend của dự án Student Management.

Backend được chạy thông qua project:

```text
StudentManagement.Api
```

Database được quản lý thông qua project:

```text
StudentManagement.Infrastructure
```
