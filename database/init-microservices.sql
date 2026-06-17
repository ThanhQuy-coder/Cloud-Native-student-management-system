SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- 1. DATABASE CHO AUTH SERVICE
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_auth`;
USE `student_management_auth`;

CREATE TABLE IF NOT EXISTS `Roles` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(50) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `Users` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(50) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `RoleId` int(11) NOT NULL,
  `IsActive` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Id`),
  CONSTRAINT `FK_Users_Roles` FOREIGN KEY (`RoleId`) REFERENCES `Roles` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- 2. DATABASE CHO ACADEMIC SERVICE
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_academic`;
USE `student_management_academic`;

CREATE TABLE IF NOT EXISTS `Courses` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `CourseCode` varchar(20) NOT NULL,
  `CourseName` varchar(100) NOT NULL,
  `Credits` int(11) NOT NULL,
  `Description` text DEFAULT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Mở',
  `TeacherId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- 3. DATABASE CHO STUDENT SERVICE
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_student`;
USE `student_management_student`;

CREATE TABLE IF NOT EXISTS `Classes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `ClassCode` varchar(20) NOT NULL,
  `ClassName` varchar(100) NOT NULL,
  `Major` varchar(100) NOT NULL,
  `AcademicYear` varchar(20) NOT NULL,
  `AcademicAdvisor` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `Students` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `StudentCode` varchar(20) NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Dob` date NOT NULL,
  `Gender` varchar(10) NOT NULL,
  `Phone` varchar(15) DEFAULT NULL,
  `ClassId` int(11) DEFAULT NULL,
  `LearningStatus` varchar(50) NOT NULL DEFAULT 'Đang học',
  `UserId` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  CONSTRAINT `FK_Students_Classes` FOREIGN KEY (`ClassId`) REFERENCES `Classes` (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================================================
-- 4. DATABASE CHO ENROLLMENT SERVICE
-- ============================================================================
CREATE DATABASE IF NOT EXISTS `student_management_enrollment`;
USE `student_management_enrollment`;

CREATE TABLE IF NOT EXISTS `Enrollments` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `StudentId` int(11) NOT NULL,
  `CourseId` int(11) NOT NULL,
  `Semester` varchar(20) NOT NULL DEFAULT 'HK1 2026',
  `Status` varchar(20) NOT NULL DEFAULT 'Đang học',
  `ProcessScore` decimal(4,2) DEFAULT NULL,
  `MidtermScore` decimal(4,2) DEFAULT NULL,
  `FinalScore` decimal(4,2) DEFAULT NULL,
  `TotalScore` decimal(4,2) DEFAULT NULL,
  `GradeStatus` varchar(20) DEFAULT 'Chưa có điểm',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Thêm bảng ẩn lưu vết mapping sinh viên trong Enrollment Service
CREATE TABLE IF NOT EXISTS `Student_References` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `UserId` int(11) NOT NULL,
  `StudentId` int(11) NOT NULL,
  `StudentCode` varchar(20) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;