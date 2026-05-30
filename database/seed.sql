SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Mẹo DevOps: Tắt kiểm tra khóa ngoại tạm thời để Docker nạp dữ liệu mẫu mượt mà, không lo sai thứ tự bảng
SET FOREIGN_KEY_CHECKS = 0;

--
-- Đang đổ dữ liệu cho bảng `roles`
--
INSERT INTO `roles` (`id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Teacher'),
(4, 'Student');

--
-- Đang đổ dữ liệu cho bảng `users`
--
INSERT INTO `users` (`id`, `username`, `password_hash`, `role_id`, `is_active`) VALUES
(1, 'admin01', 'hashed_password_admin', 1, 1),
(2, 'giaovu01', 'hashed_password_staff', 2, 1),
(3, 'giangvien01', 'hashed_password_teacher', 3, 1),
(4, 'sinhvien01', 'hashed_password_student', 4, 1),
(5, 'sinhvien02', 'hashed_password_student', 4, 1);

--
-- Đang đổ dữ liệu cho bảng `classes`
--
INSERT INTO `classes` (`id`, `class_code`, `class_name`, `major`, `academic_year`, `academic_advisor`) VALUES
(1, 'CNTT01', 'Công nghệ thông tin 01', 'Công nghệ thông tin', '2022-2026', 'Thầy Nguyễn Văn A'),
(2, 'ATTT01', 'An toàn thông tin 01', 'An toàn thông tin', '2022-2026', 'Cô Trần Thị B');

--
-- Đang đổ dữ liệu cho bảng `students`
--
INSERT INTO `students` (`id`, `student_code`, `full_name`, `email`, `dob`, `gender`, `phone`, `class_id`, `learning_status`, `user_id`) VALUES
(1, 'SV001', 'Huỳnh Đặng Trung Kiên', 'kien.hd@gmail.com', '2004-05-17', 'Nam', '0912345678', 1, 'Đang học', 4),
(2, 'SV002', 'Nguyễn Phan Khánh Hào', 'hao.npk@gmail.com', '2004-08-20', 'Nam', '0987654321', 1, 'Đang học', 5);

--
-- Đang đổ dữ liệu cho bảng `courses`
--
INSERT INTO `courses` (`id`, `course_code`, `course_name`, `credits`, `description`, `status`) VALUES
(1, 'DTDM', 'Điện toán đám mây', 3, 'Học về VM, Docker, Cloud-Native, Multi-Cloud', 'Mở'),
(2, 'CSDL', 'Cơ sở dữ liệu', 3, 'Học về thiết kế và tối ưu truy vấn SQL', 'Mở');

--
-- Đang đổ dữ liệu cho bảng `enrollments`
--
INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `process_score`, `midterm_score`, `final_score`) VALUES
(1, 1, 1, 8.50, 7.00, 9.00),
(2, 1, 2, NULL, NULL, NULL),
(3, 2, 1, 4.00, 3.00, 3.50);

-- Bật lại cấu hình kiểm tra khóa ngoại để bảo toàn logic hệ thống sau khi nạp xong dữ liệu
SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
