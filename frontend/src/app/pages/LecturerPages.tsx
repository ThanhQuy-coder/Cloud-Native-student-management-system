import React, { useEffect, useState } from "react";
import { BookOpen, Users } from "lucide-react";
import { useNavigate } from "react-router";
import { api, ApiGrade, ApiStudent, ApiSubject } from "../api";
import { useAuth } from "../auth";
import Badge from "../components/Badge";
import Layout from "../components/Layout";
import { calcTK, xepLoai } from "../utils";
import { C, s } from "../theme";

export function LecturerClassesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    api.get<ApiSubject[]>("/gateway/subjects/my-teaching", user.token)
      .then(setSubjects)
      .catch(() => setSubjects([]));
  }, [user?.token]);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Lớp phụ trách</h2><p style={s.pageSub}>Danh sách môn học được phân công giảng dạy</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {subjects.map(subject => (
          <div key={subject.id} style={s.card}>
            <div style={{ color: C.navy, fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{subject.subjectName}</div>
            <div style={{ fontSize: 12, color: C.textSecondary, marginBottom: 12 }}>{subject.subjectCode}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSecondary, marginBottom: 4 }}><BookOpen size={14} /> Tín chỉ: {subject.credits}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.textSecondary, marginBottom: 16 }}><Users size={14} /> Trạng thái: {subject.status || "Mở"}</div>
            <button onClick={() => navigate("/lecturer/grades")} style={{ ...s.btn("primary"), width: "100%", justifyContent: "center" }}>Nhập điểm</button>
          </div>
        ))}
        {subjects.length === 0 && <div style={s.card}>Chưa có môn học được phân công.</div>}
      </div>
    </Layout>
  );
}

export function EnterGradesPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [selectedStudent, setSelectedStudent] = useState(0);
  const [grades, setGrades] = useState<(ApiGrade & { inputProcess: number; inputMidterm: number; inputFinal: number })[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    api.get<ApiStudent[]>("/gateway/students", user.token)
      .then(data => { setStudents(data); setSelectedStudent(data[0]?.id || 0); })
      .catch(err => alert(err.message));
  }, [user?.token]);

  useEffect(() => {
    if (!user?.token || !selectedStudent) return;
    api.get<ApiGrade[]>(`/gateway/students/${selectedStudent}/grades`, user.token)
      .then(data => setGrades(data.map(g => ({
        ...g,
        inputProcess: Number(g.processScore ?? 0),
        inputMidterm: Number(g.midtermScore ?? 0),
        inputFinal: Number(g.finalScore ?? 0)
      }))))
      .catch(() => setGrades([]));
  }, [user?.token, selectedStudent]);

  function update(id: number, field: "inputProcess" | "inputMidterm" | "inputFinal", value: string) {
    const num = Math.min(10, Math.max(0, Number(value) || 0));
    setGrades(prev => prev.map(g => g.enrollmentId === id ? { ...g, [field]: num } : g));
  }

  async function save() {
    if (!user?.token) return;
    for (const grade of grades) {
      await api.put(`/gateway/grades/${grade.enrollmentId}`, {
        processScore: grade.inputProcess,
        midtermScore: grade.inputMidterm,
        finalScore: grade.inputFinal
      }, user.token);
    }
    alert("Đã lưu điểm.");
  }

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Nhập điểm</h2><p style={s.pageSub}>Nhập điểm theo sinh viên và môn đã đăng ký</p></div>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 20 }}>
          <div><label style={s.label}>Sinh viên</label><select style={s.select} value={selectedStudent} onChange={e => setSelectedStudent(+e.target.value)}>{students.map(st => <option key={st.id} value={st.id}>{st.studentCode} - {st.fullName}</option>)}</select></div>
          <div style={{ flex: 1 }} />
          <button style={s.btn("primary")} onClick={save}>Lưu điểm</button>
        </div>
        <table style={s.table}>
          <thead><tr><th style={s.th}>Môn học</th><th style={s.th}>Học kỳ</th><th style={s.th}>QT</th><th style={s.th}>GK</th><th style={s.th}>CK</th><th style={s.th}>TK</th><th style={s.th}>Xếp loại</th></tr></thead>
          <tbody>
            {grades.map(g => {
              const total = calcTK(g.inputMidterm, g.inputFinal);
              return <tr key={g.enrollmentId}><td style={s.td}>{g.subjectName}</td><td style={s.td}>{g.semester}</td><td style={s.td}><Score value={g.inputProcess} onChange={v => update(g.enrollmentId, "inputProcess", v)} /></td><td style={s.td}><Score value={g.inputMidterm} onChange={v => update(g.enrollmentId, "inputMidterm", v)} /></td><td style={s.td}><Score value={g.inputFinal} onChange={v => update(g.enrollmentId, "inputFinal", v)} /></td><td style={{ ...s.td, fontWeight: 700 }}>{total}</td><td style={s.td}><Badge label={xepLoai(total)} color={total >= 4 ? C.success : C.danger} /></td></tr>;
            })}
            {grades.length === 0 && <tr><td colSpan={7} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Sinh viên chưa có môn đăng ký.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

function Score({ value, onChange }: { value: number; onChange: (value: string) => void }) {
  return <input type="number" min={0} max={10} step={0.5} value={value} onChange={e => onChange(e.target.value)} style={{ ...s.input, width: 70, textAlign: "center" }} />;
}
