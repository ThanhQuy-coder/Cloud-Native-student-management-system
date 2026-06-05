# Frontend API connection and security review

## Đã cải thiện trong lần cập nhật này

- Tách `frontend/src/app/App.tsx` thành route shell gọn, các màn được chia theo nhóm:
  - `frontend/src/app/api.ts`: API client, type dùng chung, chuẩn hóa role.
  - `frontend/src/app/pages/LoginPage.tsx`: đăng nhập.
  - `frontend/src/app/pages/AdminPages.tsx`: dashboard, tài khoản, báo cáo.
  - `frontend/src/app/pages/AcademicPages.tsx`: quản lý sinh viên, lớp, môn, giáo vụ đăng ký môn cho sinh viên.
  - `frontend/src/app/pages/LecturerPages.tsx`: lớp/môn phụ trách, nhập điểm.
  - `frontend/src/app/pages/StudentPages.tsx`: sinh viên đăng ký môn, xem hồ sơ, môn đã đăng ký, điểm.
- Bổ sung API quản lý tài khoản:
  - `GET /api/users`
  - `POST /api/users`
  - `PUT /api/users/{id}`
  - `DELETE /api/users/{id}`
  - API không trả về password hash.
- Bổ sung API nhận diện sinh viên hiện tại:
  - `GET /api/students/me`
  - `GET /api/students/me/subjects`
  - `GET /api/students/me/grades`
  - `POST /api/students/me/subjects`
- Bổ sung `studentId` trong response đăng nhập để frontend không phải suy luận từ username.
- Bổ sung đăng ký môn học dành cho sinh viên theo use case.
- Bổ sung học kỳ và trạng thái đăng ký vào `Enrollment`/`EnrollmentDto`.
- Bổ sung migration `AddEnrollmentSemesterStatus` cho hai cột `Semester` và `Status`.
- Bổ sung API giảng viên xem môn phụ trách: `GET /api/subjects/my-teaching`.
- Chuẩn hóa role frontend:
  - Backend `Staff` -> frontend `giaovu`
  - Backend `Teacher` -> frontend `lecturer`
  - Backend `Student` -> frontend `student`
  - Backend `Admin` -> frontend `admin`
- Làm sạch `auth.tsx`, `Sidebar.tsx`, `Badge.tsx` để tránh lỗi hiển thị tiếng Việt bị sai encoding.
- Tiếp tục giữ `ConnectionStrings:DefaultConnection` và `Jwt:Key` ngoài `appsettings.json`; các giá trị này nên lấy từ user-secrets/environment.

## Use case đã phủ

### Admin

- Đăng nhập.
- Quản lý tài khoản.
- Quản lý sinh viên.
- Quản lý lớp học.
- Quản lý môn học.
- Xem dashboard và báo cáo.

### Giáo vụ

- Đăng nhập.
- Quản lý sinh viên.
- Quản lý lớp học.
- Quản lý môn học.
- Đăng ký môn cho sinh viên.

### Giảng viên

- Đăng nhập.
- Xem môn/lớp phụ trách theo `TeacherId`.
- Nhập điểm sinh viên theo enrollment.

### Sinh viên

- Đăng nhập.
- Đăng ký môn học cho chính mình.
- Xem thông tin cá nhân.
- Xem môn học đã đăng ký.
- Xem điểm.

## Điểm còn cần lưu ý

- `UsersController` đang đặt ở API layer và dùng `IUnitOfWork` trực tiếp để giữ thay đổi nhỏ. Khi hệ thống lớn hơn, nên tách thành `IUserService`.
- `TeacherId` khi tạo/sửa môn học hiện nhập bằng số ID. Nên bổ sung dropdown danh sách giảng viên khi backend có endpoint lọc users theo role.
- Endpoint thống kê riêng cho dashboard/report chưa được tạo; frontend vẫn tổng hợp từ danh sách sinh viên/lớp/môn/tài khoản. Cách này ổn cho bài tập nhỏ nhưng không tối ưu khi dữ liệu lớn.
- JWT vẫn đang lưu trong `localStorage`. Với production nên chuyển sang cookie `HttpOnly`, `Secure`, `SameSite` hoặc thiết kế refresh token an toàn.
- `AllowedHosts` đang là `"*"`. Khi triển khai thật nên giới hạn hostname hợp lệ.
- Cần chạy migration mới trước khi dùng đăng ký môn có học kỳ/trạng thái:
  - `dotnet ef database update`
- Cần bảo đảm role `Staff` tồn tại trong bảng `roles` để tài khoản giáo vụ hoạt động. File `database/seed.sql` hiện đã có role này.

## Kiểm tra đã thực hiện

- `npm.cmd run build`: build frontend thành công.
- `dotnet build backend\StudentManagement.slnx`: build backend thành công sau khi chạy ngoài sandbox để SDK đọc được NuGet config.
