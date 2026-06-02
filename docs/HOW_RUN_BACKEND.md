# Hướng dẫn chạy Backend - Student Management

> Ngày cập nhật 02/06/2026

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

Kiểm tra đã cài EF Core CLI chưa:

```bash
dotnet ef --version
```

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

## 7. Cập nhật database

Lưu ý không sử dụng file `init.sql` để tạo DB vì có thể sẽ bị lệch về các thuộc tính.

Phần này sẽ tạo bảng Database mà không phải làm thủ công và cũng giúp đồng bộ thuộc tính giữa code và database vậy nên cần phải làm, chạy lệnh sau để sinh các bảng bên trong database nhờ vào chuỗi connection string đã kết nối trước đó:

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

## 7.1. Chạy seed để có dữ liệu mẫu

Mở file `database\seed.sql` và chạy để có dữ liệu mẫu

Có nhiều cách để chạy, đơn giản nhất là mở MySQL workbench truy cập vào đúng Database và chạy file, toàn bộ dữ liệu mẫu sẽ có trong DB sau khi chạy.

---

## 7.2. user-secrets cho JWT

Phần này quan trọng bởi vì phải có nó thì mới có thể có token, có token thì mới truy cập được vào các API khác.

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

## 8. Chạy backend

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

## 9. Mở Scalar (Nếu muốn test api qua giao diện)

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
