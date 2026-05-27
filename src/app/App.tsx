import React, { useState } from "react";
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
  const [role, setRole] = useState<Role>("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (user) {
    const defaultRoutes: Record<Role, string> = { admin: "/admin/dashboard", giaovu: "/giaovu/students", lecturer: "/lecturer/classes", student: "/student/profile" };
    return <Navigate to={defaultRoutes[user.role]} replace />;
  }

  const nameMap: Record<Role, string> = { admin: "Nguyễn Quản Trị", giaovu: "Trần Thị Giáo Vụ", lecturer: "TS. Nguyễn Hữu Đức", student: "Nguyễn Văn An" };

  function handleLogin() {
    const defaultRoutes: Record<Role, string> = { admin: "/admin/dashboard", giaovu: "/giaovu/students", lecturer: "/lecturer/classes", student: "/student/profile" };
    login({ role, name: nameMap[role], username: username || role + "01" });
    navigate(defaultRoutes[role]);
  }

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...s.card, width: 400, padding: 40, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ background: C.navy, borderRadius: 16, padding: 14 }}>
            <GraduationCap size={32} color={C.white} />
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: "0 0 4px" }}>Hệ thống Quản lý Sinh viên</h1>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 28px" }}>Trường Đại học Công nghệ</p>

        <div style={s.formGroup}>
          <label style={s.label}>Tên đăng nhập</label>
          <input style={s.input} placeholder="Nhập tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Mật khẩu</label>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} style={{ ...s.input, paddingRight: 40 }} placeholder="Nhập mật khẩu" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textSecondary, padding: 0, display: "flex" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Vai trò</label>
          <select style={{ ...s.select, width: "100%" }} value={role} onChange={e => setRole(e.target.value as Role)}>
            <option value="admin">Admin</option>
            <option value="giaovu">Giáo vụ</option>
            <option value="lecturer">Giảng viên</option>
            <option value="student">Sinh viên</option>
          </select>
        </div>

        <button onClick={handleLogin} style={{ ...s.btn("primary"), width: "100%", justifyContent: "center", padding: "12px 16px", fontSize: 14, borderRadius: 10, marginTop: 8 }}>
          Đăng nhập
        </button>
      </div>
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
  const [list, setList] = useState(students);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState(emptySv);

  const uniqueClasses = Array.from(new Set(list.map(sv => sv.class)));
  const filtered = list.filter(sv =>
    (filterClass === "all" || sv.class === filterClass) &&
    (sv.name.toLowerCase().includes(search.toLowerCase()) || sv.mssv.includes(search))
  );

  function openAdd() { setForm(emptySv); setModal("add"); }
  function openEdit(sv: typeof students[0]) {
    setForm({ mssv: sv.mssv, name: sv.name, class: sv.class, dob: sv.dob, email: sv.email, phone: sv.phone, faculty: sv.faculty, status: sv.status });
    setModal(sv.id);
  }
  function closeModal() { setModal(null); }

  function handleSave() {
    if (!form.mssv.trim() || !form.name.trim()) return;
    if (modal === "add") {
      setList(l => [...l, { id: Date.now(), gpa: 0, semester: "HK2 2024", ...form }]);
    } else {
      setList(l => l.map(sv => sv.id === modal ? { ...sv, ...form } : sv));
    }
    closeModal();
  }

  const f = (field: keyof typeof emptySv) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div style={s.card}>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textSecondary }} />
          <input style={{ ...s.input, paddingLeft: 32 }} placeholder="Tìm kiếm sinh viên..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={s.select} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          <option value="all">Tất cả lớp</option>
          {uniqueClasses.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button style={s.btn("primary")} onClick={openAdd}><Plus size={15} /> Thêm sinh viên</button>
      </div>
      <table style={s.table}>
        <thead>
          <tr><th style={s.th}>STT</th><th style={s.th}>MSSV</th><th style={s.th}>Họ tên</th><th style={s.th}>Lớp</th><th style={s.th}>Ngày sinh</th><th style={s.th}>Email</th><th style={s.th}>Thao tác</th></tr>
        </thead>
        <tbody>
          {filtered.map((sv, i) => (
            <tr key={sv.id}>
              <td style={s.td}>{i + 1}</td>
              <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{sv.mssv}</td>
              <td style={s.td}>{sv.name}</td>
              <td style={s.td}><Badge label={sv.class} color={C.navy} /></td>
              <td style={s.td}>{sv.dob}</td>
              <td style={{ ...s.td, color: C.textSecondary }}>{sv.email}</td>
              <td style={s.td}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => openEdit(sv)} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                  <button onClick={() => setList(l => l.filter(x => x.id !== sv.id))} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modal !== null && (
        <Modal title={modal === "add" ? "Thêm sinh viên" : "Chỉnh sửa sinh viên"} onClose={closeModal}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={s.formGroup}>
              <label style={s.label}>MSSV <span style={{ color: C.danger }}>*</span></label>
              <input style={s.input} placeholder="SV2024001" value={form.mssv} onChange={f("mssv")} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Họ và tên <span style={{ color: C.danger }}>*</span></label>
              <input style={s.input} placeholder="Nguyễn Văn A" value={form.name} onChange={f("name")} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Lớp</label>
              <input style={s.input} placeholder="CNTT01" value={form.class} onChange={f("class")} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Khoa</label>
              <select style={{ ...s.select, width: "100%" }} value={form.faculty} onChange={f("faculty")}>
                {["CNTT", "KTPM", "HTTT", "ATTT"].map(fc => <option key={fc}>{fc}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Ngày sinh</label>
              <input type="date" style={s.input} value={form.dob} onChange={f("dob")} />
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>Trạng thái</label>
              <select style={{ ...s.select, width: "100%" }} value={form.status} onChange={f("status")}>
                <option>Đang học</option>
                <option>Bảo lưu</option>
                <option>Tốt nghiệp</option>
              </select>
            </div>
            <div style={{ ...s.formGroup, gridColumn: "span 2" }}>
              <label style={s.label}>Email</label>
              <input style={s.input} placeholder="sv@edu.vn" value={form.email} onChange={f("email")} />
            </div>
            <div style={{ ...s.formGroup, gridColumn: "span 2" }}>
              <label style={s.label}>Số điện thoại</label>
              <input style={s.input} placeholder="09xxxxxxxx" value={form.phone} onChange={f("phone")} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
            <button style={s.btn("outline")} onClick={closeModal}>Hủy</button>
            <button style={s.btn("primary")} onClick={handleSave}>
              {modal === "add" ? "Thêm sinh viên" : "Lưu thay đổi"}
            </button>
          </div>
        </Modal>
      )}
    </div>
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
  const [tab, setTab] = useState<"classes" | "subjects">("classes");
  const [classList, setClassList] = useState(classes);
  const [subjectList, setSubjectList] = useState(subjects);
  const [classModal, setClassModal] = useState<null | "add" | number>(null);
  const [subjectModal, setSubjectModal] = useState<null | "add" | number>(null);
  const [classForm, setClassForm] = useState(emptyClass);
  const [subjectForm, setSubjectForm] = useState(emptySubject);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: active ? 600 : 400,
    borderBottom: active ? `2px solid ${C.navy}` : "2px solid transparent",
    color: active ? C.navy : C.textSecondary, background: "transparent", fontSize: 14,
  });

  function saveClass() {
    if (!classForm.code.trim() || !classForm.name.trim()) return;
    if (classModal === "add") {
      setClassList(l => [...l, { id: Date.now(), ...classForm }]);
    } else {
      setClassList(l => l.map(c => c.id === classModal ? { ...c, ...classForm } : c));
    }
    setClassModal(null);
  }

  function saveSubject() {
    if (!subjectForm.code.trim() || !subjectForm.name.trim()) return;
    if (subjectModal === "add") {
      setSubjectList(l => [...l, { id: Date.now(), ...subjectForm }]);
    } else {
      setSubjectList(l => l.map(s => s.id === subjectModal ? { ...s, ...subjectForm } : s));
    }
    setSubjectModal(null);
  }

  const faculties = ["CNTT", "KTPM", "HTTT", "ATTT"];

  return (
    <div style={s.card}>
      <div style={{ borderBottom: `1px solid ${C.border}`, marginBottom: 20, display: "flex" }}>
        <button style={tabStyle(tab === "classes")} onClick={() => setTab("classes")}>Lớp học</button>
        <button style={tabStyle(tab === "subjects")} onClick={() => setTab("subjects")}>Môn học</button>
      </div>

      {tab === "classes" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button style={s.btn("primary")} onClick={() => { setClassForm(emptyClass); setClassModal("add"); }}><Plus size={15} /> Thêm lớp</button>
          </div>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Mã lớp</th><th style={s.th}>Tên lớp</th><th style={s.th}>Khoa</th><th style={s.th}>Sĩ số</th><th style={s.th}>Thao tác</th></tr></thead>
            <tbody>
              {classList.map(c => (
                <tr key={c.id}>
                  <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{c.code}</td>
                  <td style={s.td}>{c.name}</td>
                  <td style={s.td}><Badge label={c.faculty} color={C.teal} /></td>
                  <td style={s.td}>{c.size}</td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setClassForm({ code: c.code, name: c.name, faculty: c.faculty, size: c.size, lecturer: c.lecturer }); setClassModal(c.id); }} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                      <button onClick={() => setClassList(l => l.filter(x => x.id !== c.id))} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "subjects" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button style={s.btn("primary")} onClick={() => { setSubjectForm(emptySubject); setSubjectModal("add"); }}><Plus size={15} /> Thêm môn</button>
          </div>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Mã môn</th><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Khoa</th><th style={s.th}>Thao tác</th></tr></thead>
            <tbody>
              {subjectList.map(sub => (
                <tr key={sub.id}>
                  <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{sub.code}</td>
                  <td style={s.td}>{sub.name}</td>
                  <td style={s.td}><Badge label={`${sub.credits} TC`} color={C.info} /></td>
                  <td style={s.td}><Badge label={sub.faculty} color={C.teal} /></td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { setSubjectForm({ code: sub.code, name: sub.name, credits: sub.credits, faculty: sub.faculty }); setSubjectModal(sub.id); }} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                      <button onClick={() => setSubjectList(l => l.filter(x => x.id !== sub.id))} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

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

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
