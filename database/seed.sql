SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ========================================================
-- 1. SEED DATA CHO AUTH SERVICE (`student_management_auth`)
-- ========================================================

-- ========================================================
-- DEMO ACCOUNTS
-- ========================================================
-- Admin:
--   username: admin01
--   password: Admin@123
--
-- Giáo vụ / Staff:
--   username: giaovu01
--   password: Staff@123
--
-- Giảng viên / Teacher:
--   username: teacher01
--   password: Teacher@123
--   username: teacher02
--   password: Teacher@123
--
-- Sinh viên / Student:
--   username: student01
--   password: Student@123
--   username: student02
--   password: Student@123
--   username: student03
--   password: Student@123
--   username: student04
--   password: Student@123
--
-- Tài khoản không hoạt động để test khóa đăng nhập:
--   username: locked_student
--   password: Student@123
-- =======================================================
USE `student_management_auth`;

-- Dọn dẹp dữ liệu cũ (nếu có) trước khi nạp mới
DELETE FROM `users`;
DELETE FROM `roles`;

ALTER TABLE `roles` AUTO_INCREMENT = 1;
ALTER TABLE `users` AUTO_INCREMENT = 1;

INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Teacher'),
(4, 'Student');

INSERT INTO `users` (`id`, `username`, `password_hash`, `role_id`, `is_active`) VALUES
(1, 'admin01', 'AQAAAAEAACcQAAAAEB4G3gm/pSuvdSg17aGcV+SZQlELFXDy/l0YNZVbPniNDKl+A4kpkCWclJfZzl4AwQ==', 1, 1),
(2, 'giaovu01', 'AQAAAAEAACcQAAAAEEFp9LC14xxCuf671YzryEO2dfM0giuqBXZ/JroJay4XZC66XrpmmtqypJ9SCAV0dQ==', 2, 1),
(3, 'teacher01', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),
(4, 'teacher02', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),
(5, 'student01', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(6, 'student02', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(7, 'student03', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(8, 'student04', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(9, 'locked_student', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 0);

ALTER TABLE `roles` AUTO_INCREMENT = 5;
ALTER TABLE `users` AUTO_INCREMENT = 10;


-- ========================================================
-- 2. SEED DATA CHO ACADEMIC SERVICE (`student_management_academic`)
-- ========================================================
USE `student_management_academic`;

DELETE FROM `courses`;
DELETE FROM `classes`;

ALTER TABLE `classes` AUTO_INCREMENT = 1;
ALTER TABLE `courses` AUTO_INCREMENT = 1;

INSERT INTO `classes` (`id`, `class_code`, `class_name`, `major`, `academic_year`, `academic_advisor`) VALUES
(1, 'CNTT01', 'Công nghệ thông tin 01', 'Công nghệ thông tin', '2022-2026', 'TS. Nguyễn Hữu Đức'),
(2, 'CNTT02', 'Công nghệ thông tin 02', 'Công nghệ thông tin', '2023-2027', 'ThS. Trần Văn Hòa'),
(3, 'KTPM01', 'Kỹ thuật phần mềm 01', 'Kỹ thuật phần mềm', '2022-2026', 'TS. Lê Thị Mai'),
(4, 'ATTT01', 'An toàn thông tin 01', 'An toàn thông tin', '2023-2027', 'ThS. Phạm Quang Nam'),
(5, 'HTTT01', 'Hệ thống thông tin 01', 'Hệ thống thông tin', '2024-2028', 'TS. Vũ Minh Tuấn');

INSERT INTO `courses` (`id`, `course_code`, `course_name`, `credits`, `description`, `teacher_id`, `status`) VALUES
(1, 'DTDM', 'Điện toán đám mây', 3, 'VM, Docker, Kubernetes, Cloud Native, Multi Cloud', 3, 'Mở'),
(2, 'CSDL', 'Cơ sở dữ liệu', 3, 'Thiết kế cơ sở dữ liệu, SQL, tối ưu truy vấn', 3, 'Mở'),
(3, 'KTPM', 'Kỹ thuật phần mềm', 3, 'Agile, Scrum, Clean Architecture, kiểm thử phần mềm', 4, 'Mở'),
(4, 'LTWEB', 'Lập trình Web', 3, 'React, API, bảo mật frontend/backend', 4, 'Mở'),
(5, 'MMT', 'Mạng máy tính', 3, 'TCP/IP, routing, switching, network services', 3, 'Mở'),
(6, 'ATBM', 'An toàn bảo mật', 3, 'Mã hóa, xác thực, bảo mật ứng dụng', 4, 'Mở'),
(7, 'AI101', 'Nhập môn trí tuệ nhân tạo', 3, 'Tổng quan AI và machine learning', 3, 'Đóng');

ALTER TABLE `classes` AUTO_INCREMENT = 6;
ALTER TABLE `courses` AUTO_INCREMENT = 8;


-- ========================================================
-- 3. SEED DATA CHO STUDENT SERVICE (`student_management_student`)
-- ========================================================
USE `student_management_student`;

DELETE FROM `students`;
ALTER TABLE `students` AUTO_INCREMENT = 1;

INSERT INTO `students` (`id`, `student_code`, `full_name`, `email`, `dob`, `gender`, `phone`, `class_id`, `learning_status`, `user_id`) VALUES
(1, 'SV001', 'Huỳnh Đặng Trung Kiên', 'kien.hd@example.edu.vn', '2004-05-17', 'Nam', '0912345678', 1, 'Đang học', 5),
(2, 'SV002', 'Nguyễn Phan Khánh Hào', 'hao.npk@example.edu.vn', '2004-08-20', 'Nam', '0987654321', 1, 'Đang học', 6),
(3, 'SV003', 'Trần Minh Quân', 'quan.tm@example.edu.vn', '2004-12-05', 'Nam', '0933111222', 2, 'Đang học', 7),
(4, 'SV004', 'Lê Thị Thanh Trúc', 'truc.ltt@example.edu.vn', '2005-01-11', 'Nữ', '0909001001', 3, 'Đang học', 8),
(5, 'SV005', 'Phạm Minh Anh', 'anh.pm@example.edu.vn', '2004-03-09', 'Nữ', '0909001002', 4, 'Đang học', 9),
(6, 'SV006', 'Đỗ Quốc Bảo', 'bao.dq@example.edu.vn', '2003-10-22', 'Nam', '0909001003', 5, 'Bảo lưu', NULL),
(7, 'SV007', 'Vũ Ngọc Hà', 'ha.vn@example.edu.vn', '2002-07-15', 'Nữ', '0909001004', 3, 'Tốt nghiệp', NULL),
(8, 'SV008', 'Bùi Hoàng Nam', 'nam.bh@example.edu.vn', '2005-04-02', 'Nam', '0909001005', NULL, 'Đang học', NULL);

ALTER TABLE `students` AUTO_INCREMENT = 9;


-- ========================================================
-- 4. SEED DATA CHO ENROLLMENT SERVICE (`student_management_enrollment`)
-- ========================================================
USE `student_management_enrollment`;

DELETE FROM `enrollments`;
ALTER TABLE `enrollments` AUTO_INCREMENT = 1;

INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `semester`, `status`, `process_score`, `midterm_score`, `final_score`) VALUES
(1, 1, 1, 'HK1 2025', 'Đang học', 8.50, 7.00, 9.00),
(2, 1, 2, 'HK1 2025', 'Đang học', 7.00, 8.00, 8.50),
(3, 1, 4, 'HK2 2025', 'Đang học', NULL, NULL, NULL),
(4, 2, 1, 'HK1 2025', 'Đang học', 4.00, 3.00, 3.50),
(5, 2, 3, 'HK2 2025', 'Đang học', 7.50, 8.00, 8.50),
(6, 2, 5, 'HK2 2025', 'Đang học', NULL, NULL, NULL),
(7, 3, 2, 'HK1 2025', 'Đang học', 9.00, 8.50, 9.50),
(8, 3, 3, 'HK1 2025', 'Đang học', 6.00, 6.50, 7.00),
(9, 3, 6, 'HK2 2025', 'Đang học', NULL, NULL, NULL),
(10, 4, 1, 'HK1 2026', 'Đang học', NULL, NULL, NULL),
(11, 4, 4, 'HK1 2026', 'Đang học', 8.00, 8.00, 8.00),
(12, 5, 6, 'HK1 2026', 'Đang học', 5.50, 5.00, 6.00),
(13, 6, 2, 'HK2 2024', 'Bảo lưu', 7.00, 7.00, 7.00),
(14, 7, 3, 'HK2 2024', 'Hoàn thành', 8.50, 8.00, 9.00),
(15, 8, 5, 'HK1 2026', 'Đang học', NULL, NULL, NULL);

ALTER TABLE `enrollments` AUTO_INCREMENT = 16;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;