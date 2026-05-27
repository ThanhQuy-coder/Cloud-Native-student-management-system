export const students = [
    { id: 1, mssv: "SV2021001", name: "Nguyễn Văn An", class: "CNTT01", dob: "2003-05-12", email: "an.nv@edu.vn", phone: "0901234567", faculty: "CNTT", gpa: 3.45, status: "Đang học", semester: "HK2 2024" },
    { id: 2, mssv: "SV2021002", name: "Trần Thị Bình", class: "CNTT01", dob: "2003-08-22", email: "binh.tt@edu.vn", phone: "0912345678", faculty: "CNTT", gpa: 3.72, status: "Đang học", semester: "HK2 2024" },
    { id: 3, mssv: "SV2021003", name: "Lê Minh Cường", class: "KTPM02", dob: "2002-11-30", email: "cuong.lm@edu.vn", phone: "0923456789", faculty: "KTPM", gpa: 2.85, status: "Đang học", semester: "HK2 2024" },
    { id: 4, mssv: "SV2021004", name: "Phạm Thị Dung", class: "KTPM02", dob: "2003-01-14", email: "dung.pt@edu.vn", phone: "0934567890", faculty: "KTPM", gpa: 3.20, status: "Bảo lưu", semester: "HK2 2024" },
    { id: 5, mssv: "SV2021005", name: "Hoàng Văn Em", class: "HTTT03", dob: "2002-07-08", email: "em.hv@edu.vn", phone: "0945678901", faculty: "HTTT", gpa: 3.60, status: "Đang học", semester: "HK2 2024" },
    { id: 6, mssv: "SV2021006", name: "Nguyễn Thị Fang", class: "HTTT03", dob: "2003-03-25", email: "fang.nt@edu.vn", phone: "0956789012", faculty: "HTTT", gpa: 2.95, status: "Đang học", semester: "HK2 2024" },
    { id: 7, mssv: "SV2021007", name: "Vũ Đình Giang", class: "CNTT01", dob: "2002-09-17", email: "giang.vd@edu.vn", phone: "0967890123", faculty: "CNTT", gpa: 3.15, status: "Đang học", semester: "HK1 2024" },
    { id: 8, mssv: "SV2021008", name: "Đỗ Thị Hoa", class: "KTPM02", dob: "2003-12-05", email: "hoa.dt@edu.vn", phone: "0978901234", faculty: "KTPM", gpa: 3.85, status: "Đang học", semester: "HK1 2024" },
    { id: 9, mssv: "SV2022001", name: "Bùi Văn Inh", class: "CNTT04", dob: "2004-02-18", email: "inh.bv@edu.vn", phone: "0989012345", faculty: "CNTT", gpa: 3.30, status: "Đang học", semester: "HK2 2024" },
    { id: 10, mssv: "SV2022002", name: "Trịnh Thị Kim", class: "HTTT03", dob: "2004-06-29", email: "kim.tt@edu.vn", phone: "0990123456", faculty: "HTTT", gpa: 3.55, status: "Đang học", semester: "HK2 2024" },
];

export const classes = [
    { id: 1, code: "CNTT01", name: "Công nghệ thông tin K21 - Lớp 1", faculty: "CNTT", size: 35, lecturer: "TS. Nguyễn Hữu Đức" },
    { id: 2, code: "KTPM02", name: "Kỹ thuật phần mềm K21 - Lớp 2", faculty: "KTPM", size: 40, lecturer: "ThS. Trần Văn Hòa" },
    { id: 3, code: "HTTT03", name: "Hệ thống thông tin K21 - Lớp 3", faculty: "HTTT", size: 38, lecturer: "PGS. Lê Thị Mai" },
    { id: 4, code: "CNTT04", name: "Công nghệ thông tin K22 - Lớp 4", faculty: "CNTT", size: 42, lecturer: "TS. Phạm Quang Nam" },
    { id: 5, code: "ATTT05", name: "An toàn thông tin K22 - Lớp 5", faculty: "ATTT", size: 30, lecturer: "ThS. Vũ Minh Tuấn" },
];

export const subjects = [
    { id: 1, code: "IT101", name: "Lập trình căn bản", credits: 3, faculty: "CNTT" },
    { id: 2, code: "IT201", name: "Cấu trúc dữ liệu & Giải thuật", credits: 4, faculty: "CNTT" },
    { id: 3, code: "IT301", name: "Cơ sở dữ liệu", credits: 3, faculty: "CNTT" },
    { id: 4, code: "IT302", name: "Lập trình Web", credits: 3, faculty: "KTPM" },
    { id: 5, code: "IT401", name: "Trí tuệ nhân tạo", credits: 3, faculty: "CNTT" },
    { id: 6, code: "IT402", name: "Mạng máy tính", credits: 3, faculty: "HTTT" },
    { id: 7, code: "IT303", name: "Kỹ thuật phần mềm", credits: 4, faculty: "KTPM" },
    { id: 8, code: "IT201B", name: "Toán rời rạc", credits: 3, faculty: "CNTT" },
];

export const accounts = [
    { id: 1, username: "admin01", name: "Nguyễn Quản Trị", role: "admin", status: "Hoạt động" },
    { id: 2, username: "giaovu01", name: "Trần Thị Giáo Vụ", role: "giaovu", status: "Hoạt động" },
    { id: 3, username: "gv.duc", name: "TS. Nguyễn Hữu Đức", role: "lecturer", status: "Hoạt động" },
    { id: 4, username: "gv.hoa", name: "ThS. Trần Văn Hòa", role: "lecturer", status: "Hoạt động" },
    { id: 5, username: "sv2021001", name: "Nguyễn Văn An", role: "student", status: "Hoạt động" },
    { id: 6, username: "sv2021002", name: "Trần Thị Bình", role: "student", status: "Hoạt động" },
    { id: 7, username: "gv.mai", name: "PGS. Lê Thị Mai", role: "lecturer", status: "Không hoạt động" },
];

export const registrations = [
    { id: 1, studentId: 1, subjectCode: "IT101", subjectName: "Lập trình căn bản", credits: 3, lecturer: "TS. Nguyễn Hữu Đức", semester: "HK1 2024", status: "Đang học" },
    { id: 2, studentId: 1, subjectCode: "IT201", subjectName: "Cấu trúc dữ liệu & Giải thuật", credits: 4, lecturer: "ThS. Trần Văn Hòa", semester: "HK1 2024", status: "Đang học" },
    { id: 3, studentId: 1, subjectCode: "IT301", subjectName: "Cơ sở dữ liệu", credits: 3, lecturer: "PGS. Lê Thị Mai", semester: "HK2 2024", status: "Đang học" },
    { id: 4, studentId: 1, subjectCode: "IT302", subjectName: "Lập trình Web", credits: 3, lecturer: "ThS. Trần Văn Hòa", semester: "HK2 2024", status: "Đang học" },
];

export const grades = [
    { id: 1, studentId: 1, subjectCode: "IT101", subjectName: "Lập trình căn bản", credits: 3, gk: 7.5, ck: 8.0, semester: "HK1 2024" },
    { id: 2, studentId: 1, subjectCode: "IT201", subjectName: "Cấu trúc dữ liệu & Giải thuật", credits: 4, gk: 8.0, ck: 9.0, semester: "HK1 2024" },
    { id: 3, studentId: 1, subjectCode: "IT301", subjectName: "Cơ sở dữ liệu", credits: 3, gk: 6.5, ck: 7.0, semester: "HK2 2024" },
    { id: 4, studentId: 1, subjectCode: "IT302", subjectName: "Lập trình Web", credits: 3, gk: 9.0, ck: 8.5, semester: "HK2 2024" },
];

export const lecturerClasses = [
    { id: 1, subjectName: "Lập trình căn bản", classCode: "CNTT01", semester: "HK2 2024", size: 35, subjectCode: "IT101" },
    { id: 2, subjectName: "Cơ sở dữ liệu", classCode: "KTPM02", semester: "HK2 2024", size: 40, subjectCode: "IT301" },
    { id: 3, subjectName: "Lập trình Web", classCode: "HTTT03", semester: "HK1 2024", size: 38, subjectCode: "IT302" },
];

export const classStudents = students.slice(0, 6).map((s, i) => ({
    ...s,
    gk: [7.5, 8.0, 6.5, 9.0, 7.0, 8.5][i],
    ck: [8.0, 7.5, 7.0, 8.5, 6.0, 9.0][i],
}));
