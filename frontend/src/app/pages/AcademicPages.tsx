import React, { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  api,
  ApiClass,
  ApiEnrollment,
  ApiStudent,
  ApiSubject,
  enrichEnrollmentsWithSubjects,
  isOpenSubject
} from "../api";
import { useAuth } from "../auth";
import Badge, { statusBadge } from "../components/Badge";
import Layout from "../components/Layout";
import Modal from "../components/Modal";
import { C, s } from "../theme";

const emptyStudent = { username: "", password: "", studentCode: "", fullName: "", email: "", dob: "", gender: "Nam", phone: "", classId: "", learningStatus: "Đang học" };
const emptyClass = { classCode: "", className: "", major: "CNTT", academicYear: "2024-2028", academicAdvisor: "" };
const emptySubject = { subjectCode: "", subjectName: "", credits: 3, description: "", teacherId: "", status: "Mở" };

export function StudentManagementPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<null | "add" | number>(null);
  const [form, setForm] = useState(emptyStudent);

  const load = () => {
    if (!user?.token) return;
    Promise.all([api.get<ApiStudent[]>("/gateway/students", user.token), api.get<ApiClass[]>("/gateway/classes", user.token)])
      .then(([studentData, classData]) => { setStudents(studentData); setClasses(classData); })
      .catch(err => alert(err.message));
  };
  useEffect(() => { load(); }, [user?.token]);

  const filtered = students.filter(st => `${st.studentCode} ${st.fullName} ${st.email}`.toLowerCase().includes(search.toLowerCase()));

  function openEdit(st: ApiStudent) {
    setForm({ username: "", password: "", studentCode: st.studentCode, fullName: st.fullName, email: st.email, dob: st.dob, gender: st.gender, phone: st.phone || "", classId: String(st.classId || ""), learningStatus: st.learningStatus });
    setModal(st.id);
  }

  async function save() {
    if (!user?.token || !form.fullName.trim() || !form.email.trim() || !form.dob || !form.gender) return;
    if (modal === "add" && (!form.username.trim() || !form.password.trim())) return;

    try {
      if (modal === "add") {
        await api.post("/gateway/auth/register-student", {
          username: form.username.trim(),
          password: form.password,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          dob: form.dob,
          gender: form.gender
        }, user.token);
      } else if (typeof modal === "number") {
        await api.put(`/gateway/students/${modal}`, {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          dob: form.dob,
          gender: form.gender,
          phone: form.phone,
          classId: form.classId ? Number(form.classId) : null,
          learningStatus: form.learningStatus
        }, user.token);
      }

      setModal(null);
      setForm(emptyStudent);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function remove(id: number) {
    if (!user?.token || !window.confirm("Xóa sinh viên này?")) return;
    await api.delete(`/gateway/students/${id}`, user.token);
    setStudents(prev => prev.filter(x => x.id !== id));
  }

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý sinh viên</h2><p style={s.pageSub}>Danh sách toàn bộ sinh viên</p></div>
      <div style={s.card}>
        <Toolbar search={search} setSearch={setSearch} placeholder="Tìm sinh viên..." onAdd={() => { setForm(emptyStudent); setModal("add"); }} addLabel="Thêm sinh viên" />
        <table style={s.table}>
          <thead><tr><th style={s.th}>MSSV</th><th style={s.th}>Họ tên</th><th style={s.th}>Lớp</th><th style={s.th}>Email</th><th style={s.th}>Trạng thái</th><th style={s.th}>Thao tác</th></tr></thead>
          <tbody>{filtered.map(st => <tr key={st.id}><td style={{ ...s.td, fontWeight: 600, color: C.navy }}>{st.studentCode}</td><td style={s.td}>{st.fullName}</td><td style={s.td}>{st.className || "-"}</td><td style={s.td}>{st.email}</td><td style={s.td}>{statusBadge(st.learningStatus)}</td><td style={s.td}><RowActions onEdit={() => openEdit(st)} onDelete={() => remove(st.id)} /></td></tr>)}</tbody>
        </table>
      </div>

      {modal !== null && <Modal title={modal === "add" ? "Thêm sinh viên" : "Cập nhật sinh viên"} onClose={() => setModal(null)}>
        <Grid>
          {modal === "add" && <Field label="Username"><input style={s.input} value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} /></Field>}
          {modal === "add" && <Field label="Password"><input type="password" style={s.input} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} /></Field>}
          {modal !== "add" && <Field label="MSSV"><input style={s.input} value={form.studentCode} disabled onChange={e => setForm(f => ({ ...f, studentCode: e.target.value }))} /></Field>}
          <Field label="Họ tên"><input style={s.input} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} /></Field>
          <Field label="Email"><input style={s.input} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} /></Field>
          <Field label="Ngày sinh"><input type="date" style={s.input} value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></Field>
          <Field label="Giới tính"><select style={s.select} value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}><option>Nam</option><option>Nữ</option></select></Field>
          {modal !== "add" && <Field label="Lớp"><select style={s.select} value={form.classId} onChange={e => setForm(f => ({ ...f, classId: e.target.value }))}><option value="">Chưa phân lớp</option>{classes.map(c => <option key={c.id} value={c.id}>{c.classCode} - {c.className}</option>)}</select></Field>}
          {modal !== "add" && <Field label="SĐT"><input style={s.input} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></Field>}
          {modal !== "add" && <Field label="Trạng thái"><select style={s.select} value={form.learningStatus} onChange={e => setForm(f => ({ ...f, learningStatus: e.target.value }))}><option>Đang học</option><option>Bảo lưu</option><option>Tốt nghiệp</option><option>Thôi học</option></select></Field>}
        </Grid>
        <Actions onCancel={() => setModal(null)} onSave={save} />
      </Modal>}
    </Layout>
  );
}

export function ClassSubjectManagementPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"classes" | "subjects">("classes");
  const [classes, setClasses] = useState<ApiClass[]>([]);
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [modal, setModal] = useState<null | "class-add" | "subject-add" | number>(null);
  const [classForm, setClassForm] = useState(emptyClass);
  const [subjectForm, setSubjectForm] = useState(emptySubject);

  const load = () => {
    if (!user?.token) return;
    Promise.all([api.get<ApiClass[]>("/gateway/classes", user.token), api.get<ApiSubject[]>("/gateway/subjects", user.token)])
      .then(([classData, subjectData]) => { setClasses(classData); setSubjects(subjectData); })
      .catch(err => alert(err.message));
  };
  useEffect(() => { load(); }, [user?.token]);

  async function saveClass() {
    if (!user?.token) return;
    const body = { ...classForm, academicAdvisor: classForm.academicAdvisor || null };
    if (modal === "class-add") await api.post("/gateway/classes", body, user.token);
    else if (typeof modal === "number") await api.put(`/gateway/classes/${modal}`, body, user.token);
    setModal(null); setClassForm(emptyClass); load();
  }

  async function saveSubject() {
    if (!user?.token) return;
    const body = { ...subjectForm, credits: Number(subjectForm.credits), teacherId: subjectForm.teacherId ? Number(subjectForm.teacherId) : null };
    if (modal === "subject-add") await api.post("/gateway/subjects", body, user.token);
    else if (typeof modal === "number") await api.put(`/gateway/subjects/${modal}`, body, user.token);
    setModal(null); setSubjectForm(emptySubject); load();
  }

  async function remove(path: string) {
    if (!user?.token || !window.confirm("Xóa dữ liệu này?")) return;
    await api.delete(path, user.token);
    load();
  }

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Quản lý lớp & môn học</h2><p style={s.pageSub}>Quản lý danh mục đào tạo</p></div>
      <div style={s.card}>
        <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
          <Tab active={tab === "classes"} onClick={() => setTab("classes")}>Lớp học</Tab>
          <Tab active={tab === "subjects"} onClick={() => setTab("subjects")}>Môn học</Tab>
        </div>
        {tab === "classes" ? <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button style={s.btn("primary")} onClick={() => { setClassForm(emptyClass); setModal("class-add"); }}><Plus size={15} /> Thêm lớp</button></div>
          <table style={s.table}><thead><tr><th style={s.th}>Mã lớp</th><th style={s.th}>Tên lớp</th><th style={s.th}>Ngành</th><th style={s.th}>Niên khóa</th><th style={s.th}>Thao tác</th></tr></thead><tbody>{classes.map(c => <tr key={c.id}><td style={s.td}>{c.classCode}</td><td style={s.td}>{c.className}</td><td style={s.td}><Badge label={c.major} color={C.teal} /></td><td style={s.td}>{c.academicYear}</td><td style={s.td}><RowActions onEdit={() => { setClassForm(c); setModal(c.id); }} onDelete={() => remove(`/gateway/classes/${c.id}`)} /></td></tr>)}</tbody></table>
        </> : <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}><button style={s.btn("primary")} onClick={() => { setSubjectForm(emptySubject); setModal("subject-add"); }}><Plus size={15} /> Thêm môn</button></div>
          <table style={s.table}><thead><tr><th style={s.th}>Mã môn</th><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Trạng thái</th><th style={s.th}>Thao tác</th></tr></thead><tbody>{subjects.map(sub => <tr key={sub.id}><td style={s.td}>{sub.subjectCode}</td><td style={s.td}>{sub.subjectName}</td><td style={s.td}>{sub.credits}</td><td style={s.td}>{statusBadge(sub.status || "Mở")}</td><td style={s.td}><RowActions onEdit={() => { setSubjectForm({ subjectCode: sub.subjectCode, subjectName: sub.subjectName, credits: sub.credits, description: sub.description || "", teacherId: sub.teacherId ? String(sub.teacherId) : "", status: sub.status || "Mở" }); setModal(sub.id); }} onDelete={() => remove(`/gateway/subjects/${sub.id}`)} /></td></tr>)}</tbody></table>
        </>}
      </div>

      {(modal === "class-add" || (typeof modal === "number" && tab === "classes")) && <Modal title="Lớp học" onClose={() => setModal(null)}>
        <Grid><Field label="Mã lớp"><input style={s.input} value={classForm.classCode} onChange={e => setClassForm(f => ({ ...f, classCode: e.target.value }))} /></Field><Field label="Tên lớp"><input style={s.input} value={classForm.className} onChange={e => setClassForm(f => ({ ...f, className: e.target.value }))} /></Field><Field label="Ngành"><input style={s.input} value={classForm.major} onChange={e => setClassForm(f => ({ ...f, major: e.target.value }))} /></Field><Field label="Niên khóa"><input style={s.input} value={classForm.academicYear} onChange={e => setClassForm(f => ({ ...f, academicYear: e.target.value }))} /></Field><Field label="Cố vấn"><input style={s.input} value={classForm.academicAdvisor} onChange={e => setClassForm(f => ({ ...f, academicAdvisor: e.target.value }))} /></Field></Grid><Actions onCancel={() => setModal(null)} onSave={saveClass} />
      </Modal>}
      {(modal === "subject-add" || (typeof modal === "number" && tab === "subjects")) && <Modal title="Môn học" onClose={() => setModal(null)}>
        <Grid><Field label="Mã môn"><input style={s.input} value={subjectForm.subjectCode} onChange={e => setSubjectForm(f => ({ ...f, subjectCode: e.target.value }))} /></Field><Field label="Tên môn"><input style={s.input} value={subjectForm.subjectName} onChange={e => setSubjectForm(f => ({ ...f, subjectName: e.target.value }))} /></Field><Field label="Tín chỉ"><input type="number" style={s.input} value={subjectForm.credits} onChange={e => setSubjectForm(f => ({ ...f, credits: +e.target.value }))} /></Field><Field label="TeacherId"><input style={s.input} value={subjectForm.teacherId} onChange={e => setSubjectForm(f => ({ ...f, teacherId: e.target.value }))} /></Field><Field label="Trạng thái"><select style={s.select} value={subjectForm.status} onChange={e => setSubjectForm(f => ({ ...f, status: e.target.value }))}><option>Mở</option><option>Đóng</option></select></Field><Field label="Mô tả"><input style={s.input} value={subjectForm.description} onChange={e => setSubjectForm(f => ({ ...f, description: e.target.value }))} /></Field></Grid><Actions onCancel={() => setModal(null)} onSave={saveSubject} />
      </Modal>}
    </Layout>
  );
}

export function StaffCourseRegistrationPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [allSubjects, setAllSubjects] = useState<ApiSubject[]>([]);
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [semester, setSemester] = useState("HK1 2026");
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([api.get<ApiStudent[]>("/gateway/students", user.token), api.get<ApiSubject[]>("/gateway/subjects", user.token)]).then(([studentData, subjectData]) => {
      const openSubjects = subjectData.filter(isOpenSubject);
      setStudents(studentData);
      setAllSubjects(subjectData);
      setSubjects(openSubjects);
      setSelectedStudent(studentData[0]?.id || 0);
      setSelectedSubject(openSubjects[0]?.id || 0);
    });
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token || !selectedStudent) return;
    api.get<ApiEnrollment[]>(`/gateway/students/${selectedStudent}/subjects`, user.token)
      .then(data => setRegs(enrichEnrollmentsWithSubjects(data, allSubjects)))
      .catch(() => setRegs([]));
  }, [user?.token, selectedStudent, allSubjects]);

  async function register() {
    if (!user?.token || !selectedStudent || !selectedSubject) return;
    await api.post("/gateway/enrollments", { studentId: selectedStudent, subjectId: selectedSubject, semester }, user.token);
    const data = await api.get<ApiEnrollment[]>(`/gateway/students/${selectedStudent}/subjects`, user.token);
    setRegs(enrichEnrollmentsWithSubjects(data, allSubjects));
  }

  async function cancel(id: number) {
    if (!user?.token) return;
    await api.delete(`/gateway/enrollments/${id}`, user.token);
    setRegs(prev => prev.filter(x => x.id !== id));
  }

  return <RegistrationView title="Đăng ký môn cho sinh viên" students={students} subjects={subjects} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} semester={semester} setSemester={setSemester} regs={regs} register={register} cancel={cancel} />;
}

function RegistrationView(props: { title: string; students?: ApiStudent[]; subjects: ApiSubject[]; selectedStudent?: number; setSelectedStudent?: (id: number) => void; selectedSubject: number; setSelectedSubject: (id: number) => void; semester: string; setSemester: (s: string) => void; regs: ApiEnrollment[]; register: () => void; cancel?: (id: number) => void }) {
  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>{props.title}</h2><p style={s.pageSub}>Đăng ký theo học kỳ và môn học đang mở</p></div>
      <div style={s.card}>
        <div style={{ display: "grid", gridTemplateColumns: props.students ? "1.2fr 1.2fr 1fr auto" : "1.2fr 1fr auto", gap: 12, alignItems: "end", marginBottom: 24 }}>
          {props.students && <Field label="Sinh viên"><select style={s.select} value={props.selectedStudent} onChange={e => props.setSelectedStudent?.(+e.target.value)}>{props.students.map(st => <option key={st.id} value={st.id}>{st.studentCode} - {st.fullName}</option>)}</select></Field>}
          <Field label="Môn học"><select style={s.select} value={props.selectedSubject} onChange={e => props.setSelectedSubject(+e.target.value)}>{props.subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.subjectCode} - {sub.subjectName}</option>)}</select></Field>
          <Field label="Học kỳ"><input style={s.input} value={props.semester} onChange={e => props.setSemester(e.target.value)} /></Field>
          <button style={{ ...s.btn("primary"), height: 38 }} onClick={props.register}>Đăng ký</button>
        </div>
        <table style={s.table}>
          <thead><tr><th style={s.th}>Mã môn</th><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Học kỳ</th><th style={s.th}>Trạng thái</th><th style={s.th}>Thao tác</th></tr></thead>
          <tbody>
            {props.regs.map(r => <tr key={r.id}><td style={s.td}>{r.subjectCode}</td><td style={s.td}>{r.subjectName}</td><td style={s.td}>{r.credits}</td><td style={s.td}>{r.semester}</td><td style={s.td}>{statusBadge(r.status)}</td><td style={s.td}>{props.cancel ? <button style={{ ...s.btn("ghost"), color: C.danger }} onClick={() => props.cancel?.(r.id)}><Trash2 size={15} /></button> : "-"}</td></tr>)}
            {props.regs.length === 0 && <tr><td colSpan={6} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Chưa có môn học đã đăng ký.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export { RegistrationView };

function Toolbar({ search, setSearch, placeholder, onAdd, addLabel }: { search: string; setSearch: (v: string) => void; placeholder: string; onAdd: () => void; addLabel: string }) {
  return <div style={{ display: "flex", gap: 12, marginBottom: 16 }}><div style={{ position: "relative", flex: 1 }}><Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.textSecondary }} /><input style={{ ...s.input, paddingLeft: 32 }} placeholder={placeholder} value={search} onChange={e => setSearch(e.target.value)} /></div><button style={s.btn("primary")} onClick={onAdd}><Plus size={15} /> {addLabel}</button></div>;
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div style={{ display: "flex", gap: 6 }}><button onClick={onEdit} style={{ ...s.btn("ghost"), color: C.info }}><Pencil size={15} /></button><button onClick={onDelete} style={{ ...s.btn("ghost"), color: C.danger }}><Trash2 size={15} /></button></div>;
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={s.label}>{label}</label>{children}</div>;
}

function Actions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}><button style={s.btn("outline")} onClick={onCancel}>Hủy</button><button style={s.btn("primary")} onClick={onSave}>Lưu</button></div>;
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} style={{ padding: "8px 20px", border: "none", cursor: "pointer", fontWeight: active ? 600 : 400, borderBottom: active ? `2px solid ${C.navy}` : "2px solid transparent", color: active ? C.navy : C.textSecondary, background: "transparent", fontSize: 14 }}>{children}</button>;
}
