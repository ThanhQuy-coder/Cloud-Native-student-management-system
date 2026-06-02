-- Active: 1780148380502@@127.0.0.1@3306@student_management
INSERT INTO Roles (Id, RoleName) VALUES
(1, 'Admin'),
(2, 'Staff'),
(3, 'Teacher'),
(4, 'Student');

-- Username : Password
-- admin01 : Admin@123
-- giaovu01 : Staff@123
-- teacher01 : Teacher@123
-- student01 : Student@123
-- student02 : Student@123
-- student03 : Student@123
INSERT INTO Users
(
Id,
Username,
PasswordHash,
RoleId,
IsActive
)
VALUES
(1, 'admin01', 'AQAAAAEAACcQAAAAEB4G3gm/pSuvdSg17aGcV+SZQlELFXDy/l0YNZVbPniNDKl+A4kpkCWclJfZzl4AwQ==', 1, 1),
(2, 'giaovu01', 'AQAAAAEAACcQAAAAEEFp9LC14xxCuf671YzryEO2dfM0giuqBXZ/JroJay4XZC66XrpmmtqypJ9SCAV0dQ==', 2, 1),
(3, 'teacher01', 'AQAAAAEAACcQAAAAELCejl//tCaXHmYZRhoomWYw5FBsGLTIv46xN7qQFCnbVszCcOJkYvPkmlzdRmZrqQ==', 3, 1),
(4, 'student01', 'AQAAAAEAACcQAAAAEJtdseyiJZ5BmK8q6ZCVblJ6tJwJgTPkUAukiWkidBRFrRPpdKp6+xTcs9CKdVRFsg==', 4, 1),
(5, 'student02', 'AQAAAAEAACcQAAAAEBqapEREo5BBr3srYRPB/JpTnJEBH4ZxhtM1KkeLFopMTNMxKD02cxF+MmW2nl029w==', 4, 1),
(6, 'student03', 'AQAAAAEAACcQAAAAEJH8njBDFcQwL560R2wyByOrf4cxUZCE25eFThU+18T588R9iTEtbk/9wHH6rClrMQ==', 4, 1);

INSERT INTO Classes
(
Id,
ClassCode,
ClassName,
Major,
AcademicYear,
AcademicAdvisor
)
VALUES
(1, 'CNTT01', 'Công nghệ thông tin 01', 'Công nghệ thông tin', '2022-2026', 'Nguyễn Văn A'),
(2, 'ATTT01', 'An toàn thông tin 01', 'An toàn thông tin', '2022-2026', 'Trần Thị B'),
(3, 'KTPM01', 'Kỹ thuật phần mềm 01', 'Kỹ thuật phần mềm', '2022-2026', 'Lê Văn C');

INSERT INTO Students
(
Id,
StudentCode,
FullName,
Email,
Dob,
Gender,
Phone,
ClassId,
LearningStatus,
UserId
)
VALUES
(1, 'SV001', 'Huỳnh Đặng Trung Kiên',
'[kien.hd@gmail.com](mailto:kien.hd@gmail.com)', '2004-05-17',
'Nam', '0912345678', 1, 'Đang học', 4),

(2, 'SV002', 'Nguyễn Phan Khánh Hào',
'[hao.npk@gmail.com](mailto:hao.npk@gmail.com)', '2004-08-20',
'Nam', '0987654321', 1, 'Đang học', 5),

(3, 'SV003', 'Trần Minh Quân',
'[quan.tm@gmail.com](mailto:quan.tm@gmail.com)', '2004-12-05',
'Nam', '0933111222', 2, 'Đang học', 6);

INSERT INTO Courses
(
Id,
CourseCode,
CourseName,
Credits,
Description,
TeacherId,
Status
)
VALUES
(1, 'DTDM',
'Điện toán đám mây',
3,
'VM, Docker, Cloud Native, Multi Cloud',
3,
'Mở'),

(2, 'CSDL',
'Cơ sở dữ liệu',
3,
'Thiết kế và tối ưu SQL',
3,
'Mở'),

(3, 'KTPM',
'Kỹ thuật phần mềm',
3,
'Agile, Scrum, Clean Architecture',
3,
'Mở');

INSERT INTO Enrollments
(
Id,
StudentId,
CourseId,
ProcessScore,
MidtermScore,
FinalScore
)
VALUES

(1, 1, 1, 8.50, 7.00, 9.00),

(2, 1, 2, NULL, NULL, NULL),

(3, 2, 1, 4.00, 3.00, 3.50),

(4, 2, 3, 7.50, 8.00, 8.50),

(5, 3, 1, NULL, NULL, NULL),

(6, 3, 2, 9.00, 8.50, 9.50);
