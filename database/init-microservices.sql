SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Chỉ khởi tạo các phân vùng dữ liệu biệt lập (Database Schema Containers)
CREATE DATABASE IF NOT EXISTS `student_management_auth`;
CREATE DATABASE IF NOT EXISTS `student_management_academic`;
CREATE DATABASE IF NOT EXISTS `student_management_student`;
CREATE DATABASE IF NOT EXISTS `student_management_enrollment`;

COMMIT;