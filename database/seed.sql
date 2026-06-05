-- Seed data for Student Management System
-- Run after database schema/migrations are applied.
-- This script resets demo data for convenient end-to-end testing.

SET FOREIGN_KEY_CHECKS = 0;

DELETE FROM Enrollments;
DELETE FROM Students;
DELETE FROM Courses;
DELETE FROM Users;
DELETE FROM Roles;

ALTER TABLE Enrollments AUTO_INCREMENT = 1;
ALTER TABLE Students AUTO_INCREMENT = 1;
ALTER TABLE Courses AUTO_INCREMENT = 1;
ALTER TABLE Classes AUTO_INCREMENT = 1;
ALTER TABLE Users AUTO_INCREMENT = 1;
ALTER TABLE Roles AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;

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
-- ========================================================

INSERT INTO Roles (Id, RoleName) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Teacher'),
(4, 'Student');

INSERT INTO Users (Id, Username, PasswordHash, RoleId, IsActive) VALUES
-- Admin@123
(1, 'admin01', 'AQAAAAEAACcQAAAAEB4G3gm/pSuvdSg17aGcV+SZQlELFXDy/l0YNZVbPniNDKl+A4kpkCWclJfZzl4AwQ==', 1, 1),

-- Staff@123
(2, 'giaovu01', 'AQAAAAEAACcQAAAAEEFp9LC14xxCuf671YzryEO2dfM0giuqBXZ/JroJay4XZC66XrpmmtqypJ9SCAV0dQ==', 2, 1),

-- Teacher@123
(3, 'teacher01', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),
(4, 'teacher02', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),

-- Student@123
(5, 'student01', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(6, 'student02', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(7, 'student03', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(8, 'student04', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(9, 'locked_student', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 0);

-- ========================================================
-- CLASSES
-- Covers several majors and academic years for filters/reports.
-- ========================================================
INSERT INTO Classes (Id, ClassCode, ClassName, Major, AcademicYear, AcademicAdvisor) VALUES
(1, 'CNTT01', 'Công nghệ thông tin 01', 'Công nghệ thông tin', '2022-2026', 'TS. Nguyễn Hữu Đức'),
(2, 'CNTT02', 'Công nghệ thông tin 02', 'Công nghệ thông tin', '2023-2027', 'ThS. Trần Văn Hòa'),
(3, 'KTPM01', 'Kỹ thuật phần mềm 01', 'Kỹ thuật phần mềm', '2022-2026', 'TS. Lê Thị Mai'),
(4, 'ATTT01', 'An toàn thông tin 01', 'An toàn thông tin', '2023-2027', 'ThS. Phạm Quang Nam'),
(5, 'HTTT01', 'Hệ thống thông tin 01', 'Hệ thống thông tin', '2024-2028', 'TS. Vũ Minh Tuấn');

-- ========================================================
-- STUDENTS
-- Students 1-4 are linked to active demo accounts.
-- Student 5 is linked to an inactive account for login/active-status testing.
-- Students 6-8 have no account to test admin/staff data management.
-- ========================================================
INSERT INTO Students
(Id, StudentCode, FullName, Email, Dob, Gender, Phone, ClassId, LearningStatus, UserId)
VALUES
(1, 'SV001', 'Huỳnh Đặng Trung Kiên', 'kien.hd@example.edu.vn', '2004-05-17', 'Nam', '0912345678', 1, 'Đang học', 5),
(2, 'SV002', 'Nguyễn Phan Khánh Hào', 'hao.npk@example.edu.vn', '2004-08-20', 'Nam', '0987654321', 1, 'Đang học', 6),
(3, 'SV003', 'Trần Minh Quân', 'quan.tm@example.edu.vn', '2004-12-05', 'Nam', '0933111222', 2, 'Đang học', 7),
(4, 'SV004', 'Lê Thị Thanh Trúc', 'truc.ltt@example.edu.vn', '2005-01-11', 'Nữ', '0909001001', 3, 'Đang học', 8),
(5, 'SV005', 'Phạm Minh Anh', 'anh.pm@example.edu.vn', '2004-03-09', 'Nữ', '0909001002', 4, 'Đang học', 9),
(6, 'SV006', 'Đỗ Quốc Bảo', 'bao.dq@example.edu.vn', '2003-10-22', 'Nam', '0909001003', 5, 'Bảo lưu', NULL),
(7, 'SV007', 'Vũ Ngọc Hà', 'ha.vn@example.edu.vn', '2002-07-15', 'Nữ', '0909001004', 3, 'Tốt nghiệp', NULL),
(8, 'SV008', 'Bùi Hoàng Nam', 'nam.bh@example.edu.vn', '2005-04-02', 'Nam', '0909001005', NULL, 'Đang học', NULL);

-- ========================================================
-- COURSES
-- Courses 1-6 are open for registration.
-- Course 7 is closed to test filtering in student registration.
-- TeacherId 3 = teacher01, TeacherId 4 = teacher02.
-- ========================================================
INSERT INTO Courses (Id, CourseCode, CourseName, Credits, Description, TeacherId, Status) VALUES
(1, 'DTDM', 'Điện toán đám mây', 3, 'VM, Docker, Kubernetes, Cloud Native, Multi Cloud', 3, 'Mở'),
(2, 'CSDL', 'Cơ sở dữ liệu', 3, 'Thiết kế cơ sở dữ liệu, SQL, tối ưu truy vấn', 3, 'Mở'),
(3, 'KTPM', 'Kỹ thuật phần mềm', 3, 'Agile, Scrum, Clean Architecture, kiểm thử phần mềm', 4, 'Mở'),
(4, 'LTWEB', 'Lập trình Web', 3, 'React, API, bảo mật frontend/backend', 4, 'Mở'),
(5, 'MMT', 'Mạng máy tính', 3, 'TCP/IP, routing, switching, network services', 3, 'Mở'),
(6, 'ATBM', 'An toàn bảo mật', 3, 'Mã hóa, xác thực, bảo mật ứng dụng', 4, 'Mở'),
(7, 'AI101', 'Nhập môn trí tuệ nhân tạo', 3, 'Tổng quan AI và machine learning', 3, 'Đóng');

-- ========================================================
-- ENROLLMENTS
-- Coverage:
-- - Full scores: test grade display and GPA.
-- - NULL scores: test "Chưa có điểm" and lecturer grade input.
-- - Low scores: test failed grade status.
-- - Multiple semesters: test course registration history.
-- ========================================================
INSERT INTO Enrollments
(Id, StudentId, CourseId, Semester, Status, ProcessScore, MidtermScore, FinalScore)
VALUES
-- student01 / SV001: good grades + one pending subject
(1, 1, 1, 'HK1 2025', 'Đang học', 8.50, 7.00, 9.00),
(2, 1, 2, 'HK1 2025', 'Đang học', 7.00, 8.00, 8.50),
(3, 1, 4, 'HK2 2025', 'Đang học', NULL, NULL, NULL),

-- student02 / SV002: one failed grade + one good grade
(4, 2, 1, 'HK1 2025', 'Đang học', 4.00, 3.00, 3.50),
(5, 2, 3, 'HK2 2025', 'Đang học', 7.50, 8.00, 8.50),
(6, 2, 5, 'HK2 2025', 'Đang học', NULL, NULL, NULL),

-- student03 / SV003: mixed teacher/course ownership
(7, 3, 2, 'HK1 2025', 'Đang học', 9.00, 8.50, 9.50),
(8, 3, 3, 'HK1 2025', 'Đang học', 6.00, 6.50, 7.00),
(9, 3, 6, 'HK2 2025', 'Đang học', NULL, NULL, NULL),

-- student04 / SV004: current semester registration for student self-service testing
(10, 4, 1, 'HK1 2026', 'Đang học', NULL, NULL, NULL),
(11, 4, 4, 'HK1 2026', 'Đang học', 8.00, 8.00, 8.00),

-- inactive-account student and non-account students for reports/management views
(12, 5, 6, 'HK1 2026', 'Đang học', 5.50, 5.00, 6.00),
(13, 6, 2, 'HK2 2024', 'Bảo lưu', 7.00, 7.00, 7.00),
(14, 7, 3, 'HK2 2024', 'Hoàn thành', 8.50, 8.00, 9.00),
(15, 8, 5, 'HK1 2026', 'Đang học', NULL, NULL, NULL);

-- Keep AUTO_INCREMENT after seeded IDs.
ALTER TABLE Roles AUTO_INCREMENT = 5;
ALTER TABLE Users AUTO_INCREMENT = 10;
ALTER TABLE Classes AUTO_INCREMENT = 6;
ALTER TABLE Students AUTO_INCREMENT = 9;
ALTER TABLE Courses AUTO_INCREMENT = 8;
ALTER TABLE Enrollments AUTO_INCREMENT = 16;
