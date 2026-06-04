import React, { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { GraduationCap, Eye, EyeOff, Users, Building2, BookOpen, Shield, LayoutDashboard, UserCog, UserCheck, Layers, BarChart2, ClipboardList, PenLine, LogOut, Search, Plus, Pencil, Trash2, ChevronRight } from "lucide-react";

import { students, classes, subjects, accounts, registrations, grades, lecturerClasses, classStudents } from "./mockData";
import { Role, useAuth, AuthProvider } from "./auth";
import { calcTK, xepLoai, calcGPA } from "./utils";
import { C, s } from "./theme";
import Modal from "./components/Modal";
import Badge, { roleBadge, statusBadge } from "./components/Badge";
import StatCard from "./components/StatCard";
import Sidebar from "./components/Sidebar";
import Layout from "./components/Layout";
import Guard from "./components/Guard";

import { useNavigate, useLocation, Link } from "react-router";

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  // Trạng thái Form thực tế từ người dùng nhập vào
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Trạng thái xử lý UI (báo lỗi hoặc đang gửi yêu cầu)
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Nếu đã đăng nhập thành công, tự động chuyển hướng theo Role thật từ Backend
  if (user) {
    // Ép kiểu sang any để TypeScript không báo lỗi đỏ chữ role/roleName
    let currentRole = ((user as any).role || (user as any).roleName || "").toLowerCase();

    // Chuẩn hóa tất cả các trường hợp chữ từ database về 4 nhóm quyền chuẩn
    if (currentRole === "staff" || currentRole === "giaovu" || currentRole === "giáo vụ") {
      currentRole = "giaovu";
    }
    if (currentRole === "teacher" || currentRole === "lecturer" || currentRole === "giảng viên") {
      currentRole = "lecturer";
    }
    if (currentRole === "student" || currentRole === "sinh viên") {
      currentRole = "student";
    }
    if (currentRole === "admin") {
      currentRole = "admin";
    }

    // Khai báo đường dẫn tương ứng (Record nới lỏng string để không bị bắt lỗi Type)
    const defaultRoutes: Record<string, string> = {
      admin: "/admin/dashboard",
      giaovu: "/giaovu/students",
      lecturer: "/lecturer/classes",
      student: "/student/profile"
    };

    // Nếu không khớp quyền nào thì đẩy về login, ngược lại điều hướng chuẩn đường dẫn
    const targetRoute = defaultRoutes[currentRole] || "/login";
    return <Navigate to={targetRoute} replace />;
  }

  // Hàm xử lý Đăng nhập Thực tế kết nối API
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault(); // Chặn hành vi reload lại trang
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu.");
      return;
    }

    setIsSubmitting(true);

    // Gọi hàm login thực tế qua API đã cấu hình ở auth.tsx
    const result = await login(username, password);

    setIsSubmitting(false);

    if (result.success) {
      // Khi login thành công, Context Provider sẽ cập nhật state `user`
      // Luồng xử lý component sẽ re-render và chạy vào khối điều hướng ở trên tự động.
    } else {
      setErrorMessage(result.message || "Đăng nhập thất bại.");
    }
  }

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Bao bọc bằng thẻ form để kích hoạt tính năng nhấn Enter để đăng nhập */}
      <form onSubmit={handleLogin} style={{ ...s.card, width: 400, padding: 40, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ background: C.navy, borderRadius: 16, padding: 14 }}>
            <GraduationCap size={32} color={C.white} />
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: "0 0 4px" }}>Hệ thống Quản lý Sinh viên</h1>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 24px" }}>Trường Đại học Công nghệ</p>

        {/* Hiển thị thông báo lỗi từ API nếu có */}
        {errorMessage && (
          <div style={{
            background: "#FEF2F2",
            color: C.danger,
            border: "1px solid #FEE2E2",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 13,
            marginBottom: 16,
            textAlign: "left"
          }}>
            {errorMessage}
          </div>
        )}

        <div style={s.formGroup}>
          <label style={s.label}>Tên đăng nhập</label>
          <input
            style={s.input}
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Mật khẩu</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPw ? "text" : "password"}
              style={{ ...s.input, paddingRight: 40 }}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="button" // Tránh nhầm lẫn submit form
              onClick={() => setShowPw(!showPw)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textSecondary, padding: 0, display: "flex" }}
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* BỎ thẻ <select> phân quyền cũ vì Role giờ đây sẽ do Backend kiểm tra và trả về dựa vào DB */}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            ...s.btn("primary"),
            width: "100%",
            justifyContent: "center",
            padding: "12px 16px",
            fontSize: 14,
            borderRadius: 10,
            marginTop: 16,
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}

// ─── ADMIN: DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const recent = students.slice(0, 7);
  return (
    <Layout>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Tổng quan hệ thống</h2>
        <p style={s.pageSub}>Chào mừng bạn đến với hệ thống quản lý sinh viên</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Users size={22} />} label="Tổng sinh viên" value="1,240" color={C.navy} />
        <StatCard icon={<Building2 size={22} />} label="Lớp học" value={32} color={C.info} />
        <StatCard icon={<BookOpen size={22} />} label="Môn học" value={48} color={C.teal} />
        <StatCard icon={<Shield size={22} />} label="Tài khoản" value={15} color={C.warning} />
      </div>

      <div style={s.card}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Sinh viên mới nhất</h3>
        <table style={s.table}>
          <thead>
            <tr><th style={s.th}>MSSV</th><th style={s.th}>Họ tên</th><th style={s.th}>Lớp</th><th style={s.th}>Ngày nhập học</th><th style={s.th}>Trạng thái</th></tr>
          </thead>
          <tbody>
            {recent.map(sv => (
              <tr key={sv.id}>
                <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{sv.mssv}</td>
                <td style={s.td}>{sv.name}</td>
                <td style={s.td}>{sv.class}</td>
                <td style={s.td}>{sv.dob}</td>
                <td style={s.td}>{statusBadge(sv.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

// ─── ADMIN: ACCOUNTS ──────────────────────────────────────────────────────────
const emptyAccount = { username: "", name: "", role: "student" as Role, status: "Hoạt động" };

function AccountManagement() {
  const [list, setList] = useState(accounts);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<null | "add" | number>(null); // null=closed, "add"=new, number=editing id
  const [form, setForm] = useState(emptyAccount);

  const filtered = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.username.includes(search));

  function openAdd() { setForm(emptyAccount); setModal("add"); }
  function openEdit(a: typeof accounts[0]) { setForm({ username: a.username, name: a.name, role: a.role as Role, status: a.status }); setModal(a.id); }
  function closeModal() { setModal(null); }

  function handleSave() {
    if (!form.username.trim() || !form.name.trim()) return;
    if (modal === "add") {
      setList(l => [...l, { id: Date.now(), ...form }]);
    } else {
      setList(l => l.map(a => a.id === modal ? { ...a, ...form } : a));
    }
    closeModal();
  }

  return (
    <Layout>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Quản lý tài khoản</h2>
        <p style={s.pageSub}>Danh sách tài khoản trong hệ thống</p>
      </div>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textSecondary }} />
            <input style={{ ...s.input, paddingLeft: 32 }} placeholder="Tìm kiếm tài khoản..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button style={s.btn("primary")} onClick={openAdd}><Plus size={15} /> Thêm tài khoản</button>
        </div>
        <table style={s.table}>
          <thead>
            <tr><th style={s.th}>STT</th><th style={s.th}>Tên đăng nhập</th><th style={s.th}>Họ tên</th><th style={s.th}>Vai trò</th><th style={s.th}>Trạng thái</th><th style={s.th}>Thao tác</th></tr>
          </thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={{ ...s.td, fontFamily: "monospace", color: C.navy }}>{a.username}</td>
                <td style={s.td}>{a.name}</td>
                <td style={s.td}>{roleBadge(a.role)}</td>
                <td style={s.td}>{statusBadge(a.status)}</td>
                <td style={s.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(a)} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                    <button onClick={() => setList(l => l.filter(x => x.id !== a.id))} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal title={modal === "add" ? "Thêm tài khoản" : "Chỉnh sửa tài khoản"} onClose={closeModal}>
          <div style={s.formGroup}>
            <label style={s.label}>Tên đăng nhập <span style={{ color: C.danger }}>*</span></label>
            <input style={s.input} placeholder="vd: gv.nguyen" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Họ và tên <span style={{ color: C.danger }}>*</span></label>
            <input style={s.input} placeholder="vd: Nguyễn Văn A" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={s.label}>Vai trò</label>
              <select style={{ ...s.select, width: "100%" }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
                <option value="admin">Admin</option>
                <option value="giaovu">Giáo vụ</option>
                <option value="lecturer">Giảng viên</option>
                <option value="student">Sinh viên</option>
              </select>
            </div>
            <div>
              <label style={s.label}>Trạng thái</label>
              <select style={{ ...s.select, width: "100%" }} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option>Hoạt động</option>
                <option>Không hoạt động</option>
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={s.btn("outline")} onClick={closeModal}>Hủy</button>
            <button style={s.btn("primary")} onClick={handleSave}>
              {modal === "add" ? "Thêm tài khoản" : "Lưu thay đổi"}
            </button>
          </div>
        </Modal>
      )}
    </Layout>
  );
}

// ─── SHARED: STUDENT TABLE ────────────────────────────────────────────────────
const emptySv = { mssv: "", name: "", class: "CNTT01", dob: "", email: "", phone: "", faculty: "CNTT", status: "Đang học" };

function StudentTable() {
  const { user } = useAuth();
  const [studentList, setStudentList] = useState<any[]>([]);
  const [classList, setClassList] = useState<any[]>([]); // State lưu danh sách lớp học thực tế từ DB
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);

  // Form State phục vụ Thêm/Sửa Sinh viên
  const [studentCode, setStudentCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Nam");
  const [phone, setPhone] = useState("");

  // SỬA: classId lưu dạng chuỗi để làm việc với thẻ select, mặc định ban đầu để trống ""
  const [classId, setClassId] = useState<string>("");
  const [learningStatus, setLearningStatus] = useState("Đang học");

  // 1. API lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("http://localhost:5111/api/students", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      });

      if (!response.ok) throw new Error("Không thể tải danh sách sinh viên.");
      const data = await response.json();
      setStudentList(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi kết nối dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // 2. API lấy danh sách lớp học để đổ vào thẻ Chọn (Select)
  const fetchClasses = async () => {
    try {
      // Lưu ý: Đổi lại URL này nếu endpoint lấy danh sách lớp của bạn khác /api/classes nhé!
      const response = await fetch("http://localhost:5111/api/classes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setClassList(data);
      }
    } catch (err) {
      console.error("Không thể tải danh sách lớp học:", err);
    }
  };

  // Tự động load dữ liệu sinh viên và lớp học khi mở màn hình
  useEffect(() => {
    if (user?.token) {
      fetchStudents();
      fetchClasses();
    }
  }, [user]);

  // Hàm xử lý Thêm mới hoặc Cập nhật sinh viên qua API
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentCode || !fullName || !email) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc!");
      return;
    }

    if (!classId) {
      alert("Vui lòng chọn một lớp học!");
      return;
    }

    // Định dạng lại ngày sinh thành kiểu yyyy-MM-dd phù hợp với DateOnly của C#
    const formattedDob = dob ? dob : new Date().toISOString().split('T')[0];

    // SỬA TẠI ĐÂY: Thêm thuộc tính `learningStatus` vào payload gửi đi
    const payload = {
      studentCode,
      fullName,
      email,
      dob: formattedDob, // Khớp với định dạng DateOnly ở Backend
      gender,
      phone: phone || null,
      classId: Number(classId), // Ép kiểu về INT chính xác để khớp với int? ClassId trong DTO .NET
      userId: null,
      learningStatus: learningStatus // <-- BỔ SUNG DÒNG NÀY ĐỂ GỬI TRẠNG THÁI SANG BACKEND API
    };

    try {
      let response;
      if (editingStudent) {
        response = await fetch(`http://localhost:5111/api/students/${editingStudent.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch("http://localhost:5111/api/students", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (response.ok) {
        setOpenModal(false);
        fetchStudents(); // Tải lại bảng dữ liệu thật
        resetForm();
      } else {
        const errorText = await response.text();
        console.error("Lỗi từ Server:", errorText);
        alert("Lưu thất bại! Bạn hãy kiểm tra lại xem Mã sinh viên hoặc Email có bị trùng trong DB không.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối API.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sinh viên này không?")) return;
    try {
      const response = await fetch(`http://localhost:5111/api/students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${user?.token}` }
      });
      if (response.ok) fetchStudents();
      else alert("Xóa thất bại!");
    } catch (err) {
      alert("Lỗi kết nối API khi xóa.");
    }
  };

  const resetForm = () => {
    setEditingStudent(null);
    setStudentCode("");
    setFullName("");
    setEmail("");
    setDob("");
    setGender("Nam");
    setPhone("");
    setClassId(""); // Reset về trống hoàn toàn
    setLearningStatus("Đang học"); // <-- Đã có sẵn và hoàn toàn chính xác!
  };

  const startEdit = (st: any) => {
    setEditingStudent(st);
    setStudentCode(st.studentCode || "");
    setFullName(st.fullName || "");
    setEmail(st.email || "");
    setDob(st.dob ? st.dob.substring(0, 10) : "");
    setGender(st.gender || "Nam");
    setPhone(st.phone || "");
    setClassId(st.classId ? String(st.classId) : ""); // Map ID lớp lên form chọn
    setLearningStatus(st.learningStatus || "Đang học");
    setOpenModal(true);
  };

  const filtered = studentList.filter(sItem =>
    (sItem.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
    (sItem.studentCode || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ position: "relative", width: 300 }}>
          <Search size={18} color={C.textSecondary} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input
            style={{ ...s.input, paddingLeft: 38 }}
            placeholder="Tìm kiếm mã, tên sinh viên..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          style={s.btn("primary")}
          onClick={() => {
            resetForm();        // <-- Thêm hàm này để xóa sạch form và đặt learningStatus về "Đang học" ban đầu
            setOpenModal(true);
          }}
        >
          <Plus size={16} style={{ marginRight: 6 }} /> Thêm Sinh viên mới
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: C.textSecondary }}>Đang tải dữ liệu từ máy chủ API .NET...</div>
      ) : error ? (
        <div style={{ color: C.danger, padding: 20, background: "#FEF2F2", borderRadius: 8 }}>{error}</div>
      ) : (
        <div style={s.tableContainer}>
          <table style={s.table}>
            <thead>
              <tr style={s.thRow}>
                <th style={s.th}>Mã SV</th>
                <th style={s.th}>Họ và Tên</th>
                <th style={s.th}>Lớp</th>
                <th style={s.th}>Ngày sinh</th>
                <th style={s.th}>Giới tính</th>
                <th style={s.th}>Trạng thái</th>
                <th style={{ ...s.th, textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.id} style={s.tr}>
                  <td style={{ ...s.td, fontWeight: 600 }}>{st.studentCode}</td>
                  <td style={s.td}>
                    <div>{st.fullName}</div>
                    <div style={{ fontSize: 11, color: C.textSecondary }}>{st.email}</div>
                  </td>
                  <td style={s.td}>{st.className || `ID Lớp: ${st.classId}`}</td>
                  <td style={s.td}>{st.dob ? new Date(st.dob).toLocaleDateString("vi-VN") : "---"}</td>
                  <td style={s.td}>{st.gender}</td>
                  <td style={s.td}>{statusBadge(st.learningStatus || "Đang học")}</td>
                  <td style={{ ...s.td, textAlign: "right" }}>
                    <button style={{ ...s.btnIcon, color: C.warning }} onClick={() => startEdit(st)}>
                      <Pencil size={16} />
                    </button>
                    <button style={{ ...s.btnIcon, color: C.danger, marginLeft: 8 }} onClick={() => handleDelete(st.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 30 }}>
                    Không tìm thấy dữ liệu sinh viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {openModal && (
        <Modal title={editingStudent ? "Cập nhật Sinh viên" : "Thêm Sinh viên mới"} onClose={() => setOpenModal(false)}>
          <form onSubmit={handleSave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={s.formGroup}>
                <label style={s.label}>Mã số Sinh viên *</label>
                <input style={s.input} value={studentCode} onChange={e => setStudentCode(e.target.value)} placeholder="VD: SV1001" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Họ và Tên *</label>
                <input style={s.input} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="VD: Nguyễn Văn A" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Địa chỉ Email *</label>
                <input type="email" style={s.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="VD: sv@utc.edu.vn" required />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Số điện thoại</label>
                <input style={s.input} value={phone} onChange={e => setPhone(e.target.value)} placeholder="VD: 0987654321" />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Ngày sinh</label>
                <input type="date" style={s.input} value={dob} onChange={e => setDob(e.target.value)} />
              </div>
              <div style={s.formGroup}>
                <label style={s.label}>Giới tính</label>
                <select style={s.input} value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* THAY THẾ: Ô nhập text sang danh sách chọn (Select) lấy dữ liệu thật từ DB */}
              <div style={s.formGroup}>
                <label style={s.label}>Lớp Học *</label>
                <select
                  style={s.input}
                  value={classId}
                  onChange={e => setClassId(e.target.value)}
                  required
                >
                  <option value="">-- Chọn lớp học --</option>
                  {classList.map((c) => (
                    // value lưu bằng ID số, nhưng hiển thị cho người dùng bằng Tên chữ (className)
                    <option key={c.id} value={c.id}>
                      {c.className || c.classCode || `Lớp ID: ${c.id}`}
                    </option>
                  ))}
                  {/* Trường hợp database của bạn chưa có dữ liệu lớp học, cho hiện tạm 1 option mẫu */}
                  {classList.length === 0 && (
                    <>
                      <option value="1">Công nghệ thông tin 01</option>
                      <option value="2">Công nghệ thông tin 02</option>
                    </>
                  )}
                </select>
              </div>

              <div style={s.formGroup}>
                <label style={s.label}>Tình trạng học tập</label>
                <select style={s.input} value={learningStatus} onChange={e => setLearningStatus(e.target.value)}>
                  <option value="Đang học">Đang học</option>
                  <option value="Bảo lưu">Bảo lưu</option>
                  <option value="Tốt nghiệp">Tốt nghiệp</option>
                  <option value="Thôi học">Thôi học</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button type="button" style={s.btn("secondary")} onClick={() => setOpenModal(false)}>Hủy bỏ</button>
              <button type="submit" style={s.btn("primary")}>Lưu thông tin</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function AdminStudents() {
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý sinh viên</h2><p style={s.pageSub}>Danh sách toàn bộ sinh viên</p></div>
      <StudentTable />
    </Layout>
  );
}

// ─── SHARED: CLASS/SUBJECT TABS ───────────────────────────────────────────────
const emptyClass = { code: "", name: "", faculty: "CNTT", size: 0, lecturer: "" };
const emptySubject = { code: "", name: "", credits: 3, faculty: "CNTT" };

function ClassSubjectTabs() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"classes" | "subjects">("classes");
  const [classList, setClassList] = useState<any[]>([]);
  const [subjectList, setSubjectList] = useState<any[]>([]);

  // --- State phục vụ tính năng tìm kiếm ---
  const [classSearchQuery, setClassSearchQuery] = useState("");
  const [subjectSearchQuery, setSubjectSearchQuery] = useState("");

  const [classModal, setClassModal] = useState<null | "add" | number>(null);
  const [subjectModal, setSubjectModal] = useState<null | "add" | number>(null);
  const [classForm, setClassForm] = useState(emptyClass);
  const [subjectForm, setSubjectForm] = useState(emptySubject);

  const token = user?.token || "";
  const API_BASE_URL = "http://localhost:5111";

  const fetchClasses = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/classes`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((c: any) => ({
          id: c.id,
          code: c.classCode,
          name: c.className,
          faculty: c.major || "CNTT",
          size: 45,
          lecturer: c.academicAdvisor || ""
        }));
        setClassList(mapped);
      }
    } catch (err) {
      console.error("Lỗi fetch classes:", err);
    }
  };

  const fetchSubjects = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/subjects`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((s: any) => ({
          id: s.id,
          code: s.subjectCode,
          name: s.subjectName,
          credits: s.credits,
          faculty: "CNTT"
        }));
        setSubjectList(mapped);
      }
    } catch (err) {
      console.error("Lỗi fetch subjects:", err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchSubjects();
  }, [token]);

  // --- Logic lọc dữ liệu theo từ khóa tìm kiếm (Không phân biệt hoa thường) ---
  const filteredClasses = classList.filter(c =>
    c.code.toLowerCase().includes(classSearchQuery.toLowerCase()) ||
    c.name.toLowerCase().includes(classSearchQuery.toLowerCase())
  );

  const filteredSubjects = subjectList.filter(sub =>
    sub.code.toLowerCase().includes(subjectSearchQuery.toLowerCase()) ||
    sub.name.toLowerCase().includes(subjectSearchQuery.toLowerCase())
  );

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: active ? 600 : 400,
    borderBottom: active ? `2px solid ${C.navy}` : "2px solid transparent",
    color: active ? C.navy : C.textSecondary, background: "transparent", fontSize: 14,
  });

  // CSS Style dùng chung cho thanh Search Container để giống trang Quản lý sinh viên
  const searchContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    position: "relative",
    flex: 1,
    maxWidth: "350px"
  };

  const searchInputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 12px 8px 36px",
    borderRadius: "6px",
    border: `1px solid ${C.border}`,
    fontSize: "14px",
    outline: "none"
  };

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    color: C.textSecondary
  };

  async function saveClass() {
    if (!classForm.code.trim() || !classForm.name.trim()) return;
    const isAdd = classModal === "add";
    const url = isAdd ? `${API_BASE_URL}/api/classes` : `${API_BASE_URL}/api/classes/${classModal}`;
    const method = isAdd ? "POST" : "PUT";

    const bodyData = {
      classCode: classForm.code.trim(),
      className: classForm.name.trim(),
      major: classForm.faculty || "CNTT",
      academicYear: "2024-2028",
      academicAdvisor: classForm.lecturer ? classForm.lecturer.trim() : null
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) { setClassModal(null); fetchClasses(); }
      else { const txt = await res.text(); alert(`Thất bại: ${txt}`); }
    } catch (err) { alert("Không thể kết nối đến máy chủ."); }
  }

  async function saveSubject() {
    if (!subjectForm.code.trim() || !subjectForm.name.trim()) return;
    const isAdd = subjectModal === "add";
    const url = isAdd ? `${API_BASE_URL}/api/subjects` : `${API_BASE_URL}/api/subjects/${subjectModal}`;
    const method = isAdd ? "POST" : "PUT";

    const bodyData = {
      subjectCode: subjectForm.code.trim(),
      subjectName: subjectForm.name.trim(),
      credits: Number(subjectForm.credits) || 3,
      description: `Môn học thuộc khoa ${subjectForm.faculty || "CNTT"}`,
      teacherId: null,
      status: "Mở"
    };

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(bodyData)
      });
      if (res.ok) { setSubjectModal(null); fetchSubjects(); }
      else { const txt = await res.text(); alert(`Thất bại: ${txt}`); }
    } catch (err) { alert("Không thể kết nối đến máy chủ."); }
  }

  const handleScaleDeleteClass = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lớp học này không?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/classes/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setClassList(l => l.filter(x => x.id !== id));
      else alert(`Xóa thất bại (${res.status})`);
    } catch (err) { console.error(err); }
  };

  const handleScaleDeleteSubject = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa môn học này không?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/subjects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) setSubjectList(l => l.filter(x => x.id !== id));
      else alert(`Xóa thất bại (${res.status})`);
    } catch (err) { console.error(err); }
  };

  const faculties = ["CNTT", "KTPM", "HTTT", "ATTT"];

  return (
    <div style={s.card}>
      <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 20, display: "flex" }}>
        <button style={tabStyle(tab === "classes")} onClick={() => setTab("classes")}>Lớp học</button>
        <button style={tabStyle(tab === "subjects")} onClick={() => setTab("subjects")}>Môn học</button>
      </div>

      {tab === "classes" && (
        <>
          {/* Thanh Search điều chỉnh nằm bên cạnh nút Thêm Lớp */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
            <div style={searchContainerStyle}>
              <Search size={16} style={searchIconStyle} />
              <input
                style={searchInputStyle}
                placeholder="Tìm kiếm mã lớp, tên lớp..."
                value={classSearchQuery}
                onChange={e => setClassSearchQuery(e.target.value)}
              />
            </div>
            <button style={s.btn("primary")} onClick={() => { setClassForm(emptyClass); setClassModal("add"); }}><Plus size={15} /> Thêm lớp</button>
          </div>

          <table style={s.table}>
            <thead><tr><th style={s.th}>Mã lớp</th><th style={s.th}>Tên lớp</th><th style={s.th}>Khoa</th><th style={s.th}>Sĩ số</th><th style={s.th}>Thao tác</th></tr></thead>
            <tbody>
              {filteredClasses.map(c => (
                <tr key={c.id}>
                  <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{c.code}</td>
                  <td style={s.td}>{c.name}</td>
                  <td style={s.td}><Badge label={c.faculty} color={C.teal} /></td>
                  <td style={s.td}>{c.size}</td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setClassForm({ code: c.code, name: c.name, faculty: c.faculty, size: c.size, lecturer: c.lecturer }); setClassModal(c.id); }} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                      <button onClick={() => handleScaleDeleteClass(c.id)} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClasses.length === 0 && (
                <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", color: C.textSecondary }}>Không tìm thấy lớp học phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {tab === "subjects" && (
        <>
          {/* Thanh Search điều chỉnh nằm bên cạnh nút Thêm Môn */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16 }}>
            <div style={searchContainerStyle}>
              <Search size={16} style={searchIconStyle} />
              <input
                style={searchInputStyle}
                placeholder="Tìm kiếm mã môn, tên môn..."
                value={subjectSearchQuery}
                onChange={e => setSubjectSearchQuery(e.target.value)}
              />
            </div>
            <button style={s.btn("primary")} onClick={() => { setSubjectForm(emptySubject); setSubjectModal("add"); }}><Plus size={15} /> Thêm môn</button>
          </div>

          <table style={s.table}>
            <thead><tr><th style={s.th}>Mã môn</th><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Khoa</th><th style={s.th}>Thao tác</th></tr></thead>
            <tbody>
              {filteredSubjects.map(sub => (
                <tr key={sub.id}>
                  <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{sub.code}</td>
                  <td style={s.td}>{sub.name}</td>
                  <td style={s.td}><Badge label={`${sub.credits} TC`} color={C.info} /></td>
                  <td style={s.td}><Badge label={sub.faculty} color={C.teal} /></td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setSubjectForm({ code: sub.code, name: sub.name, credits: sub.credits, faculty: sub.faculty }); setSubjectModal(sub.id); }} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                      <button onClick={() => handleScaleDeleteSubject(sub.id)} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubjects.length === 0 && (
                <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", color: C.textSecondary }}>Không tìm thấy môn học phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {/* --- Các Modal giữ nguyên gốc --- */}
      {classModal !== null && (
        <Modal title={classModal === "add" ? "Thêm lớp học" : "Chỉnh sửa lớp học"} onClose={() => setClassModal(null)}>
          <div style={s.formGroup}>
            <label style={s.label}>Mã lớp <span style={{ color: C.danger }}>*</span></label>
            <input style={s.input} placeholder="CNTT05" value={classForm.code} onChange={e => setClassForm(f => ({ ...f, code: e.target.value }))} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Tên lớp <span style={{ color: C.danger }}>*</span></label>
            <input style={s.input} placeholder="Công nghệ thông tin K22 - Lớp 5" value={classForm.name} onChange={e => setClassForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={s.label}>Khoa</label>
              <select style={{ ...s.select, width: "100%" }} value={classForm.faculty} onChange={e => setClassForm(f => ({ ...f, faculty: e.target.value }))}>
                {faculties.map(fc => <option key={fc}>{fc}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Sĩ số</label>
              <input type="number" style={s.input} placeholder="35" value={classForm.size || ""} onChange={e => setClassForm(f => ({ ...f, size: +e.target.value }))} />
            </div>
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Giảng viên chủ nhiệm</label>
            <input style={s.input} placeholder="TS. Nguyễn Văn A" value={classForm.lecturer} onChange={e => setClassForm(f => ({ ...f, lecturer: e.target.value }))} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={s.btn("outline")} onClick={() => setClassModal(null)}>Hủy</button>
            <button style={s.btn("primary")} onClick={saveClass}>{classModal === "add" ? "Thêm lớp" : "Lưu thay đổi"}</button>
          </div>
        </Modal>
      )}

      {subjectModal !== null && (
        <Modal title={subjectModal === "add" ? "Thêm môn học" : "Chỉnh sửa môn học"} onClose={() => setSubjectModal(null)}>
          <div style={s.formGroup}>
            <label style={s.label}>Mã môn <span style={{ color: C.danger }}>*</span></label>
            <input style={s.input} placeholder="IT501" value={subjectForm.code} onChange={e => setSubjectForm(f => ({ ...f, code: e.target.value }))} />
          </div>
          <div style={s.formGroup}>
            <label style={s.label}>Tên môn <span style={{ color: C.danger }}>*</span></label>
            <input style={s.input} placeholder="Học máy" value={subjectForm.name} onChange={e => setSubjectForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={s.label}>Số tín chỉ</label>
              <input type="number" min={1} max={6} style={s.input} value={subjectForm.credits} onChange={e => setSubjectForm(f => ({ ...f, credits: +e.target.value }))} />
            </div>
            <div>
              <label style={s.label}>Khoa</label>
              <select style={{ ...s.select, width: "100%" }} value={subjectForm.faculty} onChange={e => setSubjectForm(f => ({ ...f, faculty: e.target.value }))}>
                {faculties.map(fc => <option key={fc}>{fc}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={s.btn("outline")} onClick={() => setSubjectModal(null)}>Hủy</button>
            <button style={s.btn("primary")} onClick={saveSubject}>{subjectModal === "add" ? "Thêm môn" : "Lưu thay đổi"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminClasses() {
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý lớp & môn học</h2><p style={s.pageSub}>Quản lý thông tin lớp học và môn học</p></div>
      <ClassSubjectTabs />
    </Layout>
  );
}

// ─── ADMIN: REPORTS ───────────────────────────────────────────────────────────
const barData = classes.map(c => ({ name: c.code, value: c.size }));
const pieData = [
  { name: "Xuất sắc", value: 120, color: "#6366F1" },
  { name: "Giỏi", value: 250, color: "#3B82F6" },
  { name: "Khá", value: 430, color: "#10B981" },
  { name: "Trung bình", value: 300, color: "#F59E0B" },
  { name: "Yếu", value: 80, color: "#EF4444" },
];

function CSSBarChart({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200, padding: "0 8px" }}>
      {data.map(d => (
        <div key={d.name} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <div style={{ fontSize: 11, color: C.textSecondary, fontWeight: 600 }}>{d.value}</div>
          <div style={{ width: "100%", background: C.navy, borderRadius: "4px 4px 0 0", height: `${(d.value / max) * 160}px`, transition: "height 0.3s" }} />
          <div style={{ fontSize: 11, color: C.textSecondary, textAlign: "center" }}>{d.name}</div>
        </div>
      ))}
    </div>
  );
}

function CSSPieChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 70;

  const slices = data.map(d => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const large = pct > 0.5 ? 1 : 0;
    return { ...d, path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, pct };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {slices.map(sl => <path key={sl.name} d={sl.path} fill={sl.color} stroke="#fff" strokeWidth={2} />)}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
            <span style={{ color: C.textSecondary }}>{d.name}</span>
            <span style={{ fontWeight: 600, marginLeft: "auto" }}>{Math.round(d.value / total * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminReports() {
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Báo cáo thống kê</h2><p style={s.pageSub}>Tổng hợp số liệu toàn hệ thống</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={s.card}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600 }}>Sinh viên theo lớp</h3>
          <CSSBarChart data={barData} />
        </div>
        <div style={s.card}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600 }}>Kết quả học tập</h3>
          <CSSPieChart data={pieData} />
        </div>
      </div>
    </Layout>
  );
}

// ─── GIAOVU: REGISTRATION ─────────────────────────────────────────────────────
function CourseRegistration() {
  const [selectedStudent, setSelectedStudent] = useState(students[0].id);
  const [selectedSubject, setSelectedSubject] = useState(subjects[0].code);
  const [selectedSemester, setSelectedSemester] = useState("HK2 2024");
  const [regs, setRegs] = useState(registrations);

  const studentRegs = regs.filter(r => r.studentId === selectedStudent);

  function handleRegister() {
    const sub = subjects.find(s => s.code === selectedSubject);
    if (!sub) return;
    if (studentRegs.find(r => r.subjectCode === selectedSubject && r.semester === selectedSemester)) return;
    setRegs(prev => [...prev, {
      id: Date.now(), studentId: selectedStudent, subjectCode: sub.code,
      subjectName: sub.name, credits: sub.credits, lecturer: "TS. Nguyễn Hữu Đức",
      semester: selectedSemester, status: "Đang học",
    }]);
  }

  const semesters = ["HK1 2024", "HK2 2024", "HK1 2025"];

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Đăng ký môn học</h2><p style={s.pageSub}>Đăng ký môn học cho sinh viên</p></div>
      <div style={s.card}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <label style={s.label}>Sinh viên</label>
            <select style={{ ...s.select, width: "100%" }} value={selectedStudent} onChange={e => setSelectedStudent(+e.target.value)}>
              {students.map(sv => <option key={sv.id} value={sv.id}>{sv.mssv} - {sv.name}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Môn học</label>
            <select style={{ ...s.select, width: "100%" }} value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              {subjects.map(sub => <option key={sub.code} value={sub.code}>{sub.code} - {sub.name}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Học kỳ</label>
            <select style={{ ...s.select, width: "100%" }} value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
              {semesters.map(sem => <option key={sem}>{sem}</option>)}
            </select>
          </div>
          <button onClick={handleRegister} style={{ ...s.btn("primary"), height: 38, whiteSpace: "nowrap" }}>Đăng ký</button>
        </div>

        <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: C.textPrimary }}>
          Môn đã đăng ký của {students.find(s => s.id === selectedStudent)?.name}
        </h4>
        <table style={s.table}>
          <thead><tr><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Học kỳ</th><th style={s.th}>Thao tác</th></tr></thead>
          <tbody>
            {studentRegs.length === 0 && (
              <tr><td colSpan={4} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Chưa có môn đăng ký</td></tr>
            )}
            {studentRegs.map(r => (
              <tr key={r.id}>
                <td style={s.td}>{r.subjectName}</td>
                <td style={s.td}>{r.credits}</td>
                <td style={s.td}>{r.semester}</td>
                <td style={s.td}>
                  <button onClick={() => setRegs(prev => prev.filter(x => x.id !== r.id))} style={{ background: C.danger, color: C.white, border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}>
                    Hủy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

// ─── LECTURER: CLASSES ────────────────────────────────────────────────────────
function LecturerClasses() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Lớp phụ trách</h2><p style={s.pageSub}>Danh sách lớp học đang giảng dạy</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {lecturerClasses.map(lc => (
          <div key={lc.id} style={s.card}>
            <div style={{ color: C.navy, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{lc.subjectName}</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 12 }}>{lc.subjectCode} · {lc.classCode}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSecondary, marginBottom: 4 }}>
              <BookOpen size={14} /> Học kỳ: {lc.semester}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSecondary, marginBottom: 16 }}>
              <Users size={14} /> Sĩ số: {lc.size} sinh viên
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...s.btn("outline"), flex: 1, justifyContent: "center" }}>Xem chi tiết</button>
              <button onClick={() => navigate("/lecturer/grades")} style={{ ...s.btn("primary"), flex: 1, justifyContent: "center" }}>Nhập điểm</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}

// ─── LECTURER: GRADES ─────────────────────────────────────────────────────────
function EnterGrades() {
  const [selectedClass, setSelectedClass] = useState(lecturerClasses[0].classCode);
  const [selectedSemester, setSelectedSemester] = useState("HK2 2024");
  const [gradeState, setGradeState] = useState(
    classStudents.map(s => ({ ...s, inputGk: s.gk, inputCk: s.ck }))
  );

  function updateGrade(id: number, field: "inputGk" | "inputCk", val: string) {
    const num = Math.min(10, Math.max(0, parseFloat(val) || 0));
    setGradeState(prev => prev.map(g => g.id === id ? { ...g, [field]: num } : g));
  }

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Nhập điểm</h2><p style={s.pageSub}>Nhập điểm cho sinh viên</p></div>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 20, alignItems: "flex-end" }}>
          <div>
            <label style={s.label}>Lớp / Môn học</label>
            <select style={s.select} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {lecturerClasses.map(lc => <option key={lc.classCode} value={lc.classCode}>{lc.subjectName} - {lc.classCode}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Học kỳ</label>
            <select style={s.select} value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
              {["HK1 2024", "HK2 2024", "HK1 2025"].map(sem => <option key={sem}>{sem}</option>)}
            </select>
          </div>
          <div style={{ flex: 1 }} />
          <button style={s.btn("outline")}>Xuất Excel</button>
          <button style={s.btn("primary")}>Lưu điểm</button>
        </div>

        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>STT</th><th style={s.th}>MSSV</th><th style={s.th}>Họ tên</th>
              <th style={s.th}>Điểm GK</th><th style={s.th}>Điểm CK</th>
              <th style={s.th}>Điểm TK</th><th style={s.th}>Xếp loại</th>
            </tr>
          </thead>
          <tbody>
            {gradeState.map((g, i) => {
              const tk = calcTK(g.inputGk, g.inputCk);
              const xl = xepLoai(tk);
              const xlColor = xl === "Xuất sắc" ? "#6366F1" : xl === "Giỏi" ? C.info : xl === "Khá" ? C.teal : xl === "Trung bình" ? C.warning : C.danger;
              return (
                <tr key={g.id}>
                  <td style={s.td}>{i + 1}</td>
                  <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{g.mssv}</td>
                  <td style={s.td}>{g.name}</td>
                  <td style={s.td}>
                    <input type="number" min={0} max={10} step={0.5} value={g.inputGk}
                      onChange={e => updateGrade(g.id, "inputGk", e.target.value)}
                      style={{ ...s.input, width: 70, textAlign: "center" }} />
                  </td>
                  <td style={s.td}>
                    <input type="number" min={0} max={10} step={0.5} value={g.inputCk}
                      onChange={e => updateGrade(g.id, "inputCk", e.target.value)}
                      style={{ ...s.input, width: 70, textAlign: "center" }} />
                  </td>
                  <td style={{ ...s.td, fontWeight: 700, color: C.navy }}>{tk}</td>
                  <td style={s.td}><Badge label={xl} color={xlColor} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

// ─── STUDENT: PROFILE ─────────────────────────────────────────────────────────
function StudentProfile() {
  const sv = students[0];
  const initials = sv.name.split(" ").slice(-2).map(w => w[0]).join("");
  const totalCredits = registrations.filter(r => r.studentId === sv.id).reduce((s, r) => s + r.credits, 0);
  const semCount = new Set(registrations.filter(r => r.studentId === sv.id).map(r => r.semester)).size;

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Thông tin cá nhân</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, flexShrink: 0 }}>
              {initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{sv.name}</h2>
              <div style={{ color: C.textSecondary, fontSize: 13, marginTop: 4 }}>{sv.mssv}</div>
              <div style={{ marginTop: 8 }}>{statusBadge(sv.status)}</div>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <div style={{ background: C.navy + "12", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>{sv.gpa}</div>
                <div style={{ fontSize: 12, color: C.textSecondary }}>GPA / 4.0</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Lớp", sv.class], ["Khoa", sv.faculty],
              ["Email", sv.email], ["SĐT", sv.phone],
              ["Ngày sinh", sv.dob], ["Học kỳ hiện tại", sv.semester],
            ].map(([label, val]) => (
              <div key={label} style={{ padding: "12px 16px", background: C.pageBg, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Số môn đã học", value: registrations.filter(r => r.studentId === sv.id).length },
            { label: "Tổng tín chỉ", value: totalCredits },
            { label: "Học kỳ", value: semCount },
          ].map(item => (
            <div key={item.label} style={{ ...s.card, minWidth: 160, textAlign: "center", padding: "20px 24px" }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.navy }}>{item.value}</div>
              <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

// ─── STUDENT: COURSES ─────────────────────────────────────────────────────────
function RegisteredCourses() {
  const semesters = Array.from(new Set(registrations.map(r => r.semester)));
  const [tab, setTab] = useState(semesters[0]);
  const filtered = registrations.filter(r => r.studentId === 1 && r.semester === tab);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Môn học đã đăng ký</h2></div>
      <div style={s.card}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
          {semesters.map(sem => (
            <button key={sem} onClick={() => setTab(sem)} style={{ padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: tab === sem ? 600 : 400, borderBottom: tab === sem ? `2px solid ${C.navy}` : "2px solid transparent", color: tab === sem ? C.navy : C.textSecondary, background: "transparent", fontSize: 13 }}>
              {sem}
            </button>
          ))}
        </div>
        <table style={s.table}>
          <thead><tr><th style={s.th}>STT</th><th style={s.th}>Mã môn</th><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Giảng viên</th><th style={s.th}>Học kỳ</th><th style={s.th}>Trạng thái</th></tr></thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{r.subjectCode}</td>
                <td style={s.td}>{r.subjectName}</td>
                <td style={s.td}>{r.credits}</td>
                <td style={s.td}>{r.lecturer}</td>
                <td style={s.td}>{r.semester}</td>
                <td style={s.td}>{statusBadge(r.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

// ─── STUDENT: GRADES ──────────────────────────────────────────────────────────
function StudentGrades() {
  const semesters = Array.from(new Set(grades.map(g => g.semester)));
  const [tab, setTab] = useState(semesters[0]);
  const filtered = grades.filter(g => g.studentId === 1 && g.semester === tab);
  const gpa = calcGPA(filtered);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Xem điểm</h2></div>
      <div style={s.card}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
          {semesters.map(sem => (
            <button key={sem} onClick={() => setTab(sem)} style={{ padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: tab === sem ? 600 : 400, borderBottom: tab === sem ? `2px solid ${C.navy}` : "2px solid transparent", color: tab === sem ? C.navy : C.textSecondary, background: "transparent", fontSize: 13 }}>
              {sem}
            </button>
          ))}
        </div>
        <table style={s.table}>
          <thead><tr><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Điểm GK</th><th style={s.th}>Điểm CK</th><th style={s.th}>Điểm TK</th><th style={s.th}>Xếp loại</th><th style={s.th}>Kết quả</th></tr></thead>
          <tbody>
            {filtered.map(g => {
              const tk = calcTK(g.gk, g.ck);
              const xl = xepLoai(tk);
              const dat = tk >= 4.0;
              return (
                <tr key={g.id}>
                  <td style={s.td}>{g.subjectName}</td>
                  <td style={s.td}>{g.credits}</td>
                  <td style={s.td}>{g.gk}</td>
                  <td style={s.td}>{g.ck}</td>
                  <td style={{ ...s.td, fontWeight: 700 }}>{tk}</td>
                  <td style={s.td}><Badge label={xl} color={dat ? C.success : C.danger} /></td>
                  <td style={s.td}><Badge label={dat ? "Đạt" : "Không đạt"} color={dat ? C.success : C.danger} /></td>
                </tr>
              );
            })}
            {filtered.length > 0 && (
              <tr style={{ background: C.pageBg }}>
                <td colSpan={4} style={{ ...s.td, fontWeight: 700, textAlign: "right" }}>GPA học kỳ:</td>
                <td colSpan={3} style={{ ...s.td, fontWeight: 800, color: C.navy, fontSize: 16 }}>{gpa} / 4.0</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

// ─── GIAOVU PAGES ─────────────────────────────────────────────────────────────
function GiaovuStudents() {
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý sinh viên</h2><p style={s.pageSub}>Danh sách toàn bộ sinh viên</p></div>
      <StudentTable />
    </Layout>
  );
}
function GiaovuClasses() {
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý lớp & môn học</h2><p style={s.pageSub}>Quản lý thông tin lớp học và môn học</p></div>
      <ClassSubjectTabs />
    </Layout>
  );
}


// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin */}
            <Route path="/admin/dashboard" element={<Guard roles={["admin"]}><AdminDashboard /></Guard>} />
            <Route path="/admin/accounts" element={<Guard roles={["admin"]}><AccountManagement /></Guard>} />
            <Route path="/admin/students" element={<Guard roles={["admin"]}><AdminStudents /></Guard>} />
            <Route path="/admin/classes" element={<Guard roles={["admin"]}><AdminClasses /></Guard>} />
            <Route path="/admin/reports" element={<Guard roles={["admin"]}><AdminReports /></Guard>} />

            {/* Giáo vụ */}
            <Route path="/giaovu/students" element={<Guard roles={["giaovu"]}><GiaovuStudents /></Guard>} />
            <Route path="/giaovu/classes" element={<Guard roles={["giaovu"]}><GiaovuClasses /></Guard>} />
            <Route path="/giaovu/registration" element={<Guard roles={["giaovu"]}><CourseRegistration /></Guard>} />

            {/* Giảng viên */}
            <Route path="/lecturer/classes" element={<Guard roles={["lecturer"]}><LecturerClasses /></Guard>} />
            <Route path="/lecturer/grades" element={<Guard roles={["lecturer"]}><EnterGrades /></Guard>} />

            {/* Sinh viên */}
            <Route path="/student/profile" element={<Guard roles={["student"]}><StudentProfile /></Guard>} />
            <Route path="/student/courses" element={<Guard roles={["student"]}><RegisteredCourses /></Guard>} />
            <Route path="/student/grades" element={<Guard roles={["student"]}><StudentGrades /></Guard>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

