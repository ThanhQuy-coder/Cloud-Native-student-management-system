-- CREATE DATABASE IF NOT EXISTS student_management_auth;
-- CREATE DATABASE IF NOT EXISTS student_management_student;
-- CREATE DATABASE IF NOT EXISTS student_management_academic;
-- CREATE DATABASE IF NOT EXISTS student_management_enrollment;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ============================================================================
-- 1. DATABASE & DATA CHO AUTH SERVICE (`student_management_auth`)
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_auth`;
USE `student_management_auth`;

CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_user_role` (`role_id`),
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nạp dữ liệu mẫu cho Auth Service
INSERT INTO `roles` (`id`, `role_name`) VALUES 
(1, 'Admin'),
(2, 'GiaoVu'),
(3, 'SinhVien');

-- Mật khẩu mẫu đã được hash (ở đây giả lập chuỗi hash dạng BCrypt/Identity thông dụng)
INSERT INTO `users` (`id`, `username`, `password_hash`, `role_id`, `is_active`) VALUES 
(1, 'admin_thien', '$2a$12$R9h/l5jN36vfB9ky8L2UO.VbM7C7XJ7d0mS1X5G8x5pQ5eR5t5y5u', 1, 1),
(2, 'giaovu_an', '$2a$12$R9h/l5jN36vfB9ky8L2UO.VbM7C7XJ7d0mS1X5G8x5pQ5eR5t5y5u', 2, 1),
(3, 'sinhvien_01', '$2a$12$R9h/l5jN36vfB9ky8L2UO.VbM7C7XJ7d0mS1X5G8x5pQ5eR5t5y5u', 3, 1),
(4, 'sinhvien_02', '$2a$12$R9h/l5jN36vfB9ky8L2UO.VbM7C7XJ7d0mS1X5G8x5pQ5eR5t5y5u', 3, 1);


-- ============================================================================
-- 2. DATABASE & DATA CHO ACADEMIC SERVICE (`student_management_academic`)
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_academic`;
USE `student_management_academic`;

CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class_code` varchar(20) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `major` varchar(100) NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `academic_advisor` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `class_code` (`class_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `courses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `credits` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `teacher_id` int(11) DEFAULT NULL, -- Lưu ID của User (Giáo viên) từ Auth, gỡ Khóa ngoại liên DB
  `status` varchar(20) DEFAULT 'Mở',
  PRIMARY KEY (`id`),
  UNIQUE KEY `course_code` (`course_code`),
  KEY `idx_course_search` (`course_code`,`course_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nạp dữ liệu mẫu cho Academic Service
INSERT INTO `classes` (`id`, `class_code`, `class_name`, `major`, `academic_year`, `academic_advisor`) VALUES 
(1, 'D20-CNTT01', 'Công nghệ thông tin 1 Khóa 2020', 'Công nghệ thông tin', '2020-2024', 'Thầy Nguyễn Văn A'),
(2, 'D21-VT01', 'Điện tử Viễn thông 1 Khóa 2021', 'Điện tử Viễn thông', '2021-2025', 'Cô Lê Thị B');

INSERT INTO `courses` (`id`, `course_code`, `course_name`, `credits`, `description`, `teacher_id`, `status`) VALUES 
(1, 'INT1410', 'Điện toán đám mây', 3, 'Môn học cốt lõi về đám mây và container', 2, 'Mở'),
(2, 'INT1425', 'Kiến trúc Microservices', 3, 'Môn học nâng cao thiết kế phần mềm', 2, 'Mở');


-- ============================================================================
-- 3. DATABASE & DATA CHO STUDENT SERVICE (`student_management_student`)
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_student`;
USE `student_management_student`;

CREATE TABLE `students` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_code` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,   -- Tham chiếu sang id lớp của Academic Service (Gỡ bỏ FOREIGN KEY)
  `learning_status` varchar(50) DEFAULT 'Đang học',
  `user_id` int(11) DEFAULT NULL,    -- Tham chiếu sang id của Auth Service (Gỡ bỏ FOREIGN KEY)
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_code` (`student_code`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_student_search` (`student_code`,`full_name`),
  KEY `idx_student_filter` (`class_id`,`learning_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nạp dữ liệu mẫu cho Student Service
INSERT INTO `students` (`id`, `student_code`, `full_name`, `email`, `dob`, `gender`, `phone`, `class_id`, `learning_status`, `user_id`) VALUES 
(1, 'B20DCCN001', 'Nguyễn Phan Thiện', 'thien@student.edu.vn', '2002-05-15', 'Nam', '0912345678', 1, 'Đang học', 3),
(2, 'B21DCVT099', 'Trần Bảo An', 'an@student.edu.vn', '2003-09-20', 'Nam', '0987654321', 2, 'Đang học', 4);


-- ============================================================================
-- 4. DATABASE & DATA CHO ENROLLMENT SERVICE (`student_management_enrollment`)
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_enrollment`;
USE `student_management_enrollment`;

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL, -- Tham chiếu sang Student Service, gỡ Khóa ngoại liên DB
  `course_id` int(11) NOT NULL,  -- Tham chiếu sang Academic Service, gỡ Khóa ngoại liên DB
  `process_score` decimal(4,2) DEFAULT NULL,
  `midterm_score` decimal(4,2) DEFAULT NULL,
  `final_score` decimal(4,2) DEFAULT NULL,
  -- Giữ nguyên cột tự động tính điểm theo công thức đề bài yêu cầu
  `total_score` decimal(4,2) GENERATED ALWAYS AS (if(`process_score` is not null and `midterm_score` is not null and `final_score` is not null,`process_score` * 0.20 + `midterm_score` * 0.30 + `final_score` * 0.50,NULL)) STORED,
  `grade_status` varchar(20) GENERATED ALWAYS AS (if(`total_score` is not null,if(`total_score` >= 4.0,'Đạt','Rớt'),'Chưa có điểm')) STORED,
  PRIMARY KEY (`id`),
  UNIQUE KEY `student_id` (`student_id`,`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Nạp dữ liệu mẫu cho Enrollment Service (Đăng ký môn học & Điểm)
INSERT INTO `enrollments` (`id`, `student_id`, `course_id`, `process_score`, `midterm_score`, `final_score`) VALUES 
(1, 1, 1, 8.50, 7.00, 9.00), -- Sinh viên 1 đăng ký môn 1 và đạt điểm Đạt
(2, 1, 2, 6.00, 5.50, 4.00), -- Sinh viên 1 đăng ký môn 2
(3, 2, 1, 4.00, 3.00, 2.00); -- Sinh viên 2 đăng ký môn 1 và bị Rớt

COMMIT;