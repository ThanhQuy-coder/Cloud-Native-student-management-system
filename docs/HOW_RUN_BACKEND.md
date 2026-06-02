# Hướng dẫn chạy Backend - Student Management

> Ngày cập nhật 31/05/2026

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

## 5. Cấu hình connection string để kết nối với Database

Hãy vào trong ứng dụng MySQL WorkBench và tạo một Database

Sau khi tạo xong, hãy vào cho terminal vào thư mục StudentManagement thực hiện lệnh sau:

```bash
# Thay đổi các phần như your_db_name thành thông tin DB đã tạo
# Lệnh này sẽ tạo ra một nơi lưu trữ chuỗi connection string giúp không bị lộ
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "server=localhost;port=3306;database=`your_db_name`;user=`your_user`;password=`your_password`"
```

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

## 7. Tạo migration (Bỏ qua bước này vì đây dành cho việc khởi tạo do người đảm nhận nhiệm vụ backend thực hiện)

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

## 8.1. user-secrets cho JWT

Mở terminal ở thư mục StudentManagement.Domain

```bash
cd StudentManagement.Domain/
```

Chạy lệnh sau:

```bash
# "your_super_secret_key_at_least_32_characters" đặt tùy ý nhưng phải đủ hoặc hơn 32 ký tự
dotnet user-secrets set "Jwt:Key" "your_super_secret_key_at_least_32_characters"
dotnet user-secrets set "Jwt:Issuer" "StudentManagementApi"
dotnet user-secrets set "Jwt:Audience" "StudentManagementClient"
```

Lệnh này giúp sinh mã JWT để xác thực ở backend

## 9. Chạy backend

Chạy API bằng lệnh:

```bash
# Phải đang ở thư mục backend
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

## 10. Mở Scalar (Nếu muốn test api qua giao diện)

> Tài liệu API tổng hợp giúp dễ quan sát các api hiện có

Sau khi chạy backend, mở trình duyệt và truy cập:

```text
https://localhost:xxxx/Scalar/v1
```

Ví dụ:

```text
https://localhost:7081/Scalar/v1
```

Scalar dùng để kiểm tra API trực tiếp trên trình duyệt.

---
