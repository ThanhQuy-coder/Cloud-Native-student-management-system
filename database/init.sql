SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `classes`
-- --------------------------------------------------------
CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `class_code` varchar(20) NOT NULL,
  `class_name` varchar(100) NOT NULL,
  `major` varchar(100) NOT NULL,
  `academic_year` varchar(20) NOT NULL,
  `academic_advisor` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `courses`
-- --------------------------------------------------------
CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `credits` int(11) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Mở'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `enrollments`
-- --------------------------------------------------------
CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `process_score` decimal(4,2) DEFAULT NULL,
  `midterm_score` decimal(4,2) DEFAULT NULL,
  `final_score` decimal(4,2) DEFAULT NULL,
  `total_score` decimal(4,2) GENERATED ALWAYS AS (if(`process_score` is not null and `midterm_score` is not null and `final_score` is not null,`process_score` * 0.20 + `midterm_score` * 0.30 + `final_score` * 0.50,NULL)) STORED,
  `grade_status` varchar(20) GENERATED ALWAYS AS (if(`total_score` is not null,if(`total_score` >= 4.0,'Đạt','Rớt'),'Chưa có điểm')) STORED
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `roles`
-- --------------------------------------------------------
CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `students`
-- --------------------------------------------------------
CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `student_code` varchar(20) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `dob` date NOT NULL,
  `gender` varchar(10) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `learning_status` varchar(50) DEFAULT 'Đang học',
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Cấu trúc bảng cho bảng `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Thiết lập Chỉ mục (Indexes) và Khóa chính
-- --------------------------------------------------------
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_code` (`class_code`);

ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `course_code` (`course_code`),
  ADD KEY `idx_course_search` (`course_code`,`course_name`);

ALTER TABLE `courses`
  ADD `teacher_id` int(11) DEFAULT NULL AFTER `description`,
  ADD CONSTRAINT `fk_course_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`course_id`),
  ADD KEY `fk_enroll_course` (`course_id`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_code` (`student_code`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_student_search` (`student_code`,`full_name`),
  ADD KEY `idx_student_filter` (`class_id`,`learning_status`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `fk_user_role` (`role_id`);

-- --------------------------------------------------------
-- Cấu hình AUTO_INCREMENT tăng tự động
-- --------------------------------------------------------
ALTER TABLE `classes` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `courses` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `enrollments` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
ALTER TABLE `roles` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `students` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

-- --------------------------------------------------------
-- Thiết lập Ràng buộc Khóa ngoại (Constraints)
-- --------------------------------------------------------
ALTER TABLE `enrollments`
  ADD CONSTRAINT `fk_enroll_course` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_enroll_student` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE;

ALTER TABLE `students`
  ADD CONSTRAINT `fk_student_class` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_student_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `users`
  ADD CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);

COMMIT;
