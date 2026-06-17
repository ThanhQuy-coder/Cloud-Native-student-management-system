import React, { useEffect, useState } from "react";
import { BookOpen, Building2, Pencil, Plus, Search, Shield, Trash2, Users } from "lucide-react";
import { api, ApiClass, ApiStudent, ApiSubject, ApiUser, backendRole, normalizeRole, Role } from "../api";
import { useAuth } from "../auth";
import { roleBadge, statusBadge } from "../components/Badge";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import StatCard from "../components/StatCard";
import { C, s } from "../theme";

const emptyAccount = {
  username: "",
  password: "",
  role: "student" as Role,
  isActive: true,
  fullName: "",
  email: "",
  dob: "",
  gender: "Nam"
};

export function AdminDashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [accounts, setAccounts] = useState<ApiUser[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([
      api.get<ApiStudent[]>("/gateway/students", user.token),
      api.get<ApiClass[]>("/gateway/classes", user.token),
      api.get<ApiSubject[]>("/gateway/subjects", user.token),
      api.get<ApiUser[]>("/gateway/users", user.token)
    ]).then(([studentData, classData, subjectData, accountData]) => {
      setStudents(studentData);
      setClasses(classData);
      setSubjects(subjectData);
      setAccounts(accountData);
    }).catch(console.error);
  }, [user?.token]);

  return (
    <Layout>
      <div style={s.pageHeader}>
        <h2 style={s.pageTitle}>Tổng quan hệ thống</h2>
        <p style={s.pageSub}>Số liệu lấy trực tiếp từ API</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <StatCard icon={<Users size={22} />} label="Tổng sinh viên" value={students.length} color={C.navy} />
        <StatCard icon={<Building2 size={22} />} label="Lớp học" value={classes.length} color={C.info} />
        <StatCard icon={<BookOpen size={22} />} label="Môn học" value={subjects.length} color={C.teal} />
        <StatCard icon={<Shield size={22} />} label="Tài khoản" value={accounts.length} color={C.warning} />
      </div>

      <div style={s.card}>
        <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>Sinh viên mới nhất</h3>
        <table style={s.table}>
          <thead><tr><th style={s.th}>MSSV</th><th style={s.th}>Họ tên</th><th style={s.th}>Lớp</th><th style={s.th}>Email</th><th style={s.th}>Trạng thái</th></tr></thead>
          <tbody>
            {students.slice(0, 7).map(st => (
              <tr key={st.id}>
                <td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{st.studentCode}</td>
                <td style={s.td}>{st.fullName}</td>
                <td style={s.td}>{st.className || "-"}</td>
                <td style={s.td}>{st.email}</td>
                <td style={s.td}>{statusBadge(st.learningStatus)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export function AccountManagement() {
  const { user } = useAuth();
  const [list, setList] = useState<ApiUser[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState(emptyAccount);

  const load = () => user?.token && api.get<ApiUser[]>("/gateway/users", user.token).then(setList).catch(err => alert(err.message));
  useEffect(() => { load(); }, [user?.token]);

  const filtered = list.filter(a => a.username.toLowerCase().includes(search.toLowerCase()) || a.roleName.toLowerCase().includes(search.toLowerCase()));
  const isAddingStudent = modal === "add" && form.role === "student";

  function openEdit(account: ApiUser) {
    setForm({ ...emptyAccount, username: account.username, password: "", role: normalizeRole(account.roleName), isActive: account.isActive });
    setModal(account.id);
  }

  async function save() {
    if (!user?.token || !form.username.trim()) return;
    if (modal === "add" && !form.password.trim()) return alert("Mật khẩu là bắt buộc khi tạo tài khoản.");

    try {
      if (modal === "add" && form.role === "student") {
        if (!form.fullName.trim() || !form.email.trim() || !form.dob || !form.gender) {
          return alert("Vui lòng nhập đủ Username, Password, FullName, Email, Dob và Gender.");
        }

        await api.post("/gateway/auth/register-student", {
          username: form.username.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          dob: form.dob,
          gender: form.gender
        }, user.token);
      } else if (modal === "add") {
        await api.post("/gateway/users", {
          username: form.username.trim(),
          password: form.password,
          roleName: backendRole(form.role),
          isActive: form.isActive
        }, user.token);
      } else if (typeof modal === "number") {
        await api.put(`/gateway/users/${modal}`, {
          username: form.username.trim(),
          password: form.password || undefined,
          roleName: backendRole(form.role),
          isActive: form.isActive
        }, user.token);
      }

      setModal(null);
      setForm(emptyAccount);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function remove(id: number) {
    if (!user?.token || !window.confirm("Xóa tài khoản này?")) return;
    await api.delete(`/gateway/users/${id}`, user.token);
    setList(prev => prev.filter(x => x.id !== id));
  }

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý tài khoản</h2><p style={s.pageSub}>Danh sách tài khoản hệ thống</p></div>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textSecondary }} />
            <input style={{ ...s.input, paddingLeft: 32 }} placeholder="Tìm tài khoản..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button style={s.btn("primary")} onClick={() => { setForm(emptyAccount); setModal("add"); }}><Plus size={15} /> Thêm tài khoản</button>
        </div>
        <table style={s.table}>
          <thead><tr><th style={s.th}>STT</th><th style={s.th}>Tên đăng nhập</th><th style={s.th}>Vai trò</th><th style={s.th}>Trạng thái</th><th style={s.th}>Thao tác</th></tr></thead>
          <tbody>
            {filtered.map((a, i) => (
              <tr key={a.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={{ ...s.td, fontFamily: "monospace", color: C.navy }}>{a.username}</td>
                <td style={s.td}>{roleBadge(normalizeRole(a.roleName))}</td>
                <td style={s.td}>{statusBadge(a.isActive ? "Hoạt động" : "Không hoạt động")}</td>
                <td style={s.td}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => openEdit(a)} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button>
                    <button onClick={() => remove(a.id)} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal title={modal === "add" ? "Thêm tài khoản" : "Chỉnh sửa tài khoản"} onClose={() => setModal(null)}>
          <div style={s.formGroup}><label style={s.label}>Username</label><input style={s.input} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} /></div>
          <div style={s.formGroup}><label style={s.label}>Password {modal !== "add" && "(để trống nếu không đổi)"}</label><input type="password" style={s.input} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></div>
          <div style={{ display: "grid", gridTemplateColumns: isAddingStudent ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div><label style={s.label}>Vai trò</label><select style={{ ...s.select, width: "100%" }} value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}><option value="admin">Admin</option><option value="giaovu">Giáo vụ</option><option value="lecturer">Giảng viên</option><option value="student">Sinh viên</option></select></div>
            {!isAddingStudent && <div><label style={s.label}>Trạng thái</label><select style={{ ...s.select, width: "100%" }} value={String(form.isActive)} onChange={e => setForm(f => ({ ...f, isActive: e.target.value === "true" }))}><option value="true">Hoạt động</option><option value="false">Không hoạt động</option></select></div>}
          </div>

          {isAddingStudent && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div><label style={s.label}>FullName</label><input style={s.input} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} /></div>
              <div><label style={s.label}>Email</label><input type="email" style={s.input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></div>
              <div><label style={s.label}>Dob</label><input type="date" style={s.input} value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></div>
              <div><label style={s.label}>Gender</label><select style={{ ...s.select, width: "100%" }} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option>Nam</option><option>Nữ</option></select></div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={s.btn("outline")} onClick={() => setModal(null)}>Hủy</button><button style={s.btn("primary")} onClick={save}>Lưu</button></div>
        </Modal>
      )}
    </Layout>
  );
}

function BarChart({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200 }}>{data.map(d => <div key={d.name} style={{ flex: 1, textAlign: "center" }}><div style={{ fontSize: 11, color: C.textSecondary }}>{d.value}</div><div style={{ height: `${(d.value / max) * 160}px`, background: C.navy, borderRadius: "4px 4px 0 0" }} /><div style={{ fontSize: 11, color: C.textSecondary, marginTop: 6 }}>{d.name}</div></div>)}</div>;
}

export function AdminReports() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ApiStudent[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    api.get<ApiStudent[]>("/gateway/students", user.token).then(setStudents).catch(console.error);
  }, [user?.token]);

  const byClass = Object.entries(students.reduce<Record<string, number>>((acc, st) => {
    const key = st.className || "Chưa phân lớp";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {})).map(([name, value]) => ({ name, value }));

  const byStatus = Object.entries(students.reduce<Record<string, number>>((acc, st) => {
    acc[st.learningStatus] = (acc[st.learningStatus] || 0) + 1;
    return acc;
  }, {}));

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Báo cáo thống kê</h2><p style={s.pageSub}>Tổng hợp từ dữ liệu API</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={s.card}><h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600 }}>Sinh viên theo lớp</h3><BarChart data={byClass} /></div>
        <div style={s.card}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600 }}>Trạng thái học tập</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{byStatus.map(([name, value]) => <div key={name} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}><span>{name}</span><strong>{value}</strong></div>)}</div>
        </div>
      </div>
    </Layout>
  );
}
