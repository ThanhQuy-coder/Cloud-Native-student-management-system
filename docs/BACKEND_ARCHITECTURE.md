# Backend Architecture - Student Management

## 1. Tổng quan kiến trúc

Backend của dự án **Student Management** được tổ chức theo mô hình **Clean Architecture**.

Mục tiêu chính của kiến trúc này là tách biệt rõ ràng giữa:

- Logic nghiệp vụ
- API giao tiếp với người dùng
- Database và hạ tầng kỹ thuật
- Entity cốt lõi của hệ thống

Cấu trúc thư mục backend:

```text
backend/
├── StudentManagement.Api/
├── StudentManagement.Application/
├── StudentManagement.Domain/
└── StudentManagement.Infrastructure/
```

---

## 2. Vai trò từng project

## 2.1. StudentManagement.Domain

Đây là tầng lõi của hệ thống.

Tầng này chứa các thành phần quan trọng nhất của nghiệp vụ, ví dụ:

```text
StudentManagement.Domain/
├── Entities/
├── Enums/
└── Common/
```

Ví dụ nội dung:

- Entity `Student`
- Entity `Class`
- Entity `Subject`
- Enum trạng thái sinh viên
- Các quy tắc nghiệp vụ cốt lõi

Nguyên tắc quan trọng:

> Domain không phụ thuộc vào bất kỳ tầng nào khác.

---

## 2.2. StudentManagement.Application

Đây là tầng xử lý nghiệp vụ ứng dụng.

Tầng này chịu trách nhiệm điều phối logic giữa API, Domain và Infrastructure.

```text
StudentManagement.Application/
├── DTOs/
├── Interfaces/
└── Services/
```

Ví dụ nội dung:

- DTO dùng để nhận/trả dữ liệu
- Interface repository
- Service xử lý use case
- Logic tạo, sửa, xóa, tìm kiếm sinh viên

Ví dụ:

```text
Api gọi StudentService
StudentService gọi IStudentRepository
IStudentRepository được cài đặt ở Infrastructure
```

Nguyên tắc:

> Application được phép tham chiếu Domain, nhưng không làm việc trực tiếp với database.

---

## 2.3. StudentManagement.Infrastructure

Đây là tầng kỹ thuật của hệ thống.

Tầng này chịu trách nhiệm làm việc với database, Entity Framework Core, repository và các dịch vụ bên ngoài.

```text
StudentManagement.Infrastructure/
├── Data/
├── Repositories/
└── Configurations/
```

Ví dụ nội dung:

- `AppDbContext`
- Migration
- Repository implementation
- Cấu hình Entity Framework Core
- Kết nối MySQL

Nguyên tắc:

> Infrastructure triển khai các interface được khai báo ở Application.

Ví dụ:

```text
Application định nghĩa IStudentRepository
Infrastructure cài đặt StudentRepository
```

---

## 2.4. StudentManagement.Api

Đây là tầng giao tiếp bên ngoài.

Tầng này nhận request từ client và trả response về cho client.

```text
StudentManagement.Api/
├── Controllers/
├── Program.cs
└── appsettings.json
```

Ví dụ nội dung:

- Controller
- Cấu hình Swagger
- Cấu hình Dependency Injection
- Cấu hình middleware
- Cấu hình kết nối database

Nguyên tắc:

> API không nên chứa quá nhiều logic nghiệp vụ. Logic chính nên nằm ở Application.

---

## 3. Sơ đồ phụ thuộc giữa các tầng

```text
StudentManagement.Api
        ↓
StudentManagement.Application
        ↓
StudentManagement.Domain

StudentManagement.Infrastructure
        ↓
StudentManagement.Application
        ↓
StudentManagement.Domain
```

Nói đơn giản:

```text
Api gọi Application
Application xử lý nghiệp vụ
Domain chứa model cốt lõi
Infrastructure làm việc với database
```

---

## 4. Luồng xử lý request

Ví dụ: Lấy danh sách sinh viên.

```text
Client
  ↓
StudentController
  ↓
StudentService
  ↓
IStudentRepository
  ↓
StudentRepository
  ↓
AppDbContext
  ↓
Database
```

Giải thích:

1. Client gửi request đến API.
2. Controller nhận request.
3. Controller gọi Service ở tầng Application.
4. Service xử lý logic nghiệp vụ.
5. Service gọi Repository thông qua interface.
6. Repository truy vấn database.
7. Kết quả được trả ngược lại cho client.

---

## 5. Vì sao dùng Clean Architecture?

Clean Architecture giúp dự án:

- Dễ mở rộng
- Dễ bảo trì
- Dễ test
- Tách biệt rõ logic nghiệp vụ và database
- Có thể thay đổi database mà ít ảnh hưởng đến nghiệp vụ
- Phù hợp với dự án backend lớn hoặc cloud-native

---

## 6. Quy tắc khi code

## 6.1. Không viết logic nghiệp vụ trong Controller

Controller chỉ nên nhận request và gọi service.

Không nên viết nhiều logic như:

- Kiểm tra nghiệp vụ phức tạp
- Truy vấn database trực tiếp
- Xử lý dữ liệu quá nhiều

---

## 6.2. Không để Domain phụ thuộc tầng khác

Domain là lõi của hệ thống.

Không nên thêm reference từ Domain sang:

- Api
- Application
- Infrastructure

---

## 6.3. Repository implementation nằm ở Infrastructure

Ví dụ:

```text
IStudentRepository nằm ở Application
StudentRepository nằm ở Infrastructure
```

---

## 6.4. DTO nằm ở Application

DTO dùng để truyền dữ liệu giữa API và Application.

Không nên trả trực tiếp Entity ra ngoài nếu hệ thống bắt đầu phức tạp.

---

## 7. Gợi ý cấu trúc mở rộng

Khi dự án lớn hơn, có thể tổ chức như sau:

```text
StudentManagement.Application/
├── DTOs/
│   └── Students/
├── Interfaces/
├── Services/
└── UseCases/

StudentManagement.Domain/
├── Entities/
├── ValueObjects/
├── Enums/
└── Common/

StudentManagement.Infrastructure/
├── Data/
├── Repositories/
├── Configurations/
└── Migrations/

StudentManagement.Api/
├── Controllers/
├── Middlewares/
├── Extensions/
└── Filters/
```

---

## 8. Kết luận

Backend được thiết kế theo Clean Architecture để đảm bảo code rõ ràng, dễ bảo trì và dễ mở rộng.

Mỗi tầng có một trách nhiệm riêng:

```text
Domain: lõi nghiệp vụ
Application: xử lý use case
Infrastructure: database và kỹ thuật
Api: giao tiếp với client
```
