SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED AUTH SERVICE
USE `student_management_auth`;
DELETE FROM `Users`;
DELETE FROM `Roles`;
ALTER TABLE `Roles` AUTO_INCREMENT = 1;
ALTER TABLE `Users` AUTO_INCREMENT = 1;

INSERT INTO `Roles` (`Id`, `RoleName`) VALUES
(1, 'Admin'), (2, 'Staff'), (3, 'Teacher'), (4, 'Student');

INSERT INTO `Users` (`Id`, `Username`, `PasswordHash`, `RoleId`, `IsActive`) VALUES
(1, 'admin01', 'AQAAAAEAACcQAAAAEB4G3gm/pSuvdSg17aGcV+SZQlELFXDy/l0YNZVbPniNDKl+A4kpkCWclJfZzl4AwQ==', 1, 1),
(2, 'giaovu01', 'AQAAAAEAACcQAAAAEEFp9LC14xxCuf671YzryEO2dfM0giuqBXZ/JroJay4XZC66XrpmmtqypJ9SCAV0dQ==', 2, 1),
(3, 'teacher01', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),
(4, 'teacher02', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),
(5, 'student01', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(6, 'student02', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(7, 'student03', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(8, 'student04', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(9, 'locked_student', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 0);

-- 2. SEED ACADEMIC SERVICE
USE `student_management_academic`;
DELETE FROM `Courses`;
ALTER TABLE `Courses` AUTO_INCREMENT = 1;

INSERT INTO `Courses` (`Id`, `CourseCode`, `CourseName`, `Credits`, `Description`, `Status`, `TeacherId`) VALUES
(1, 'DTDM', 'Điện toán đám mây', 3, 'VM, Docker, Kubernetes, Cloud Native, Multi Cloud', 'Mở', 3),
(2, 'CSDL', 'Cơ sở dữ liệu', 3, 'Thiết kế cơ sở dữ liệu, SQL, tối ưu truy vấn', 'Mở', 3),
(3, 'KTPM', 'Kỹ thuật phần mềm', 3, 'Agile, Scrum, Clean Architecture, kiểm thử phần mềm', 'Mở', 4),
(4, 'LTWEB', 'Lập trình Web', 3, 'React, API, bảo mật frontend/backend', 'Mở', 4),
(5, 'MMT', 'Mạng máy tính', 3, 'TCP/IP, routing, switching, network services', 'Mở', 3),
(6, 'ATBM', 'An toàn bảo mật', 3, 'Mã hóa, xác thực, bảo mật ứng dụng', 'Mở', 4),
(7, 'AI101', 'Nhập môn trí tuệ nhân tạo', 3, 'Tổng quan AI và machine learning', 'Đóng', 3);

-- 3. SEED STUDENT SERVICE
USE `student_management_student`;
DELETE FROM `Students`;
DELETE FROM `Classes`;
ALTER TABLE `Classes` AUTO_INCREMENT = 1;
ALTER TABLE `Students` AUTO_INCREMENT = 1;

INSERT INTO `Classes` (`Id`, `ClassCode`, `ClassName`, `Major`, `AcademicYear`, `AcademicAdvisor`) VALUES
(1, 'CNTT01', 'Công nghệ thông tin 01', 'Công nghệ thông tin', '2022-2026', 'TS. Nguyễn Hữu Đức'),
(2, 'CNTT02', 'Công nghệ thông tin 02', 'Công nghệ thông tin', '2023-2027', 'ThS. Trần Văn Hòa'),
(3, 'KTPM01', 'Kỹ thuật phần mềm 01', 'Kỹ thuật phần mềm', '2022-2026', 'TS. Lê Thị Mai'),
(4, 'ATTT01', 'An toàn thông tin 01', 'An toàn thông tin', '2023-2027', 'ThS. Phạm Quang Nam'),
(5, 'HTTT01', 'Hệ thống thông tin 01', 'Hệ thống thông tin', '2024-2028', 'TS. Vũ Minh Tuấn');

INSERT INTO `Students` (`Id`, `StudentCode`, `FullName`, `Email`, `Dob`, `Gender`, `Phone`, `ClassId`, `LearningStatus`, `UserId`) VALUES
(1, 'SV001', 'Huỳnh Đặng Trung Kiên', 'kien.hd@example.edu.vn', '2004-05-17', 'Nam', '0912345678', 1, 'Đang học', 5),
(2, 'SV002', 'Nguyễn Phan Khánh Hào', 'hao.npk@example.edu.vn', '2004-08-20', 'Nam', '0987654321', 1, 'Đang học', 6),
(3, 'SV003', 'Trần Minh Quân', 'quan.tm@example.edu.vn', '2004-12-05', 'Nam', '0933111222', 2, 'Đang học', 7),
(4, 'SV004', 'Lê Thị Thanh Trúc', 'truc.ltt@example.edu.vn', '2005-01-11', 'Nữ', '0909001001', 3, 'Đang học', 8),
(5, 'SV005', 'Phạm Minh Anh', 'anh.pm@example.edu.vn', '2004-03-09', 'Nữ', '0909001002', 4, 'Đang học', 9),
(6, 'SV006', 'Đỗ Quốc Bảo', 'bao.dq@example.edu.vn', '2003-10-22', 'Nam', '0909001003', 5, 'Bảo lưu', NULL),
(7, 'SV007', 'Vũ Ngọc Hà', 'ha.vn@example.edu.vn', '2002-07-15', 'Nữ', '0909001004', 3, 'Tốt nghiệp', NULL),
(8, 'SV008', 'Bùi Hoàng Nam', 'nam.bh@example.edu.vn', '2005-04-02', 'Nam', '0909001005', NULL, 'Đang học', NULL);

-- 4. SEED ENROLLMENT SERVICE
USE `student_management_enrollment`;
DELETE FROM `Enrollments`;
DELETE FROM `Student_References`;
ALTER TABLE `Enrollments` AUTO_INCREMENT = 1;
ALTER TABLE `Student_References` AUTO_INCREMENT = 1;

INSERT INTO `Enrollments` (`Id`, `StudentId`, `CourseId`, `Semester`, `Status`, `ProcessScore`, `MidtermScore`, `FinalScore`, `TotalScore`, `GradeStatus`) VALUES
(1, 1, 1, 'HK1 2025', 'Đang học', 8.50, 7.00, 9.00, 8.30, 'Đạt'),
(2, 1, 2, 'HK1 2025', 'Đang học', 7.00, 8.00, 8.50, 8.05, 'Đạt'),
(3, 1, 4, 'HK2 2025', 'Đang học', NULL, NULL, NULL, NULL, 'Chưa có điểm'),
(4, 2, 1, 'HK1 2025', 'Đang học', 4.00, 3.00, 3.50, 3.45, 'Rớt'),
(5, 2, 3, 'HK2 2025', 'Đang học', 7.50, 8.00, 8.50, 8.15, 'Đạt'),
(6, 2, 5, 'HK2 2025', 'Đang học', NULL, NULL, NULL, NULL, 'Chưa có điểm'),
(7, 3, 2, 'HK1 2025', 'Đang học', 9.00, 8.50, 9.50, 9.10, 'Đạt'),
(8, 3, 3, 'HK1 2025', 'Đang học', 6.00, 6.50, 7.00, 6.65, 'Đạt'),
(9, 3, 6, 'HK2 2025', 'Đang học', NULL, NULL, NULL, NULL, 'Chưa có điểm'),
(10, 4, 1, 'HK1 2026', 'Đang học', NULL, NULL, NULL, NULL, 'Chưa có điểm'),
(11, 4, 4, 'HK1 2026', 'Đang học', 8.00, 8.00, 8.00, 8.00, 'Đạt'),
(12, 5, 6, 'HK1 2026', 'Đang học', 5.50, 5.00, 6.00, 5.60, 'Đạt'),
(13, 6, 2, 'HK2 2024', 'Bảo lưu', 7.00, 7.00, 7.00, 7.00, 'Đạt'),
(14, 7, 3, 'HK2 2024', 'Hoàn thành', 8.50, 8.00, 9.00, 8.60, 'Đạt'),
(15, 8, 5, 'HK1 2026', 'Đang học', NULL, NULL, NULL, NULL, 'Chưa có điểm');

-- Đồng bộ trước dữ liệu vào bảng StudentReferences để phục vụ hiển thị thông tin sinh viên ở phân hệ điểm
INSERT INTO `Student_References` (`Id`, `UserId`, `StudentId`, `StudentCode`) VALUES
(1, 5, 1, 'SV001'), (2, 6, 2, 'SV002'), (3, 7, 3, 'SV003'), (4, 8, 4, 'SV004'), (5, 9, 5, 'SV005');

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;