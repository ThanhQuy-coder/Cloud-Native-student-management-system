import React, { useEffect, useState } from "react";
import { api, ApiEnrollment, ApiGrade, ApiStudent, ApiSubject } from "../api";
import { useAuth } from "../auth";
import Badge, { statusBadge } from "../components/Badge";
import Layout from "../components/Layout";
import { RegistrationView } from "./AcademicPages";
import { calcTK, xepLoai } from "../utils";
import { C, s } from "../theme";

export function StudentCourseRegistrationPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [semester, setSemester] = useState("HK1 2026");
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);

  const loadRegs = () => user?.token && api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token).then(setRegs).catch(() => setRegs([]));

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([api.get<ApiSubject[]>("/gateway/subjects", user.token), api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token)])
      .then(([subjectData, regData]) => {
        const openSubjects = subjectData.filter(x => (x.status || "Mở") !== "Đóng");
        setSubjects(openSubjects);
        setSelectedSubject(openSubjects[0]?.id || 0);
        setRegs(regData);
      })
      .catch(console.error);
  }, [user?.token]);

  async function register() {
    if (!user?.token || !selectedSubject) return;
    await api.post("/gateway/students/me/subjects", { subjectId: selectedSubject, semester }, user.token);
    loadRegs();
  }

  return <RegistrationView title="Đăng ký môn học" subjects={subjects} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} semester={semester} setSemester={setSemester} regs={regs} register={register} />;
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const [student, setStudent] = useState<ApiStudent | null>(null);
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);
  const [grades, setGrades] = useState<ApiGrade[]>([]);

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([
      api.get<ApiStudent>("/gateway/students/me", user.token),
      api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token),
      api.get<ApiGrade[]>("/gateway/students/me/grades", user.token)
    ]).then(([studentData, regData, gradeData]) => {
      setStudent(studentData); setRegs(regData); setGrades(gradeData);
    }).catch(console.error);
  }, [user?.token]);

  if (!student) return <Layout><div style={s.card}>Đang tải thông tin sinh viên...</div></Layout>;

  const initials = student.fullName.split(" ").slice(-2).map(w => w[0]).join("");
  const totalCredits = regs.reduce((sum, r) => sum + r.credits, 0);
  const gpa = grades.length ? (grades.reduce((sum, g) => sum + Number(g.totalScore || 0), 0) / grades.length / 2.5).toFixed(2) : "0.00";

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Thông tin cá nhân</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>{initials}</div>
            <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{student.fullName}</h2><div style={{ color: C.textSecondary, fontSize: 13, marginTop: 4 }}>{student.studentCode}</div><div style={{ marginTop: 8 }}>{statusBadge(student.learningStatus)}</div></div>
            <div style={{ marginLeft: "auto", background: C.navy + "12", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>{gpa}</div><div style={{ fontSize: 12, color: C.textSecondary }}>GPA / 4.0</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Lớp", student.className || "-"], ["Email", student.email], ["SĐT", student.phone || "-"], ["Ngày sinh", student.dob], ["Giới tính", student.gender], ["Trạng thái", student.learningStatus]].map(([label, val]) => <div key={label} style={{ padding: "12px 16px", background: C.pageBg, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 4, textTransform: "uppercase" }}>{label}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div></div>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{[{ label: "Môn đã đăng ký", value: regs.length }, { label: "Tổng tín chỉ", value: totalCredits }, { label: "Bảng điểm", value: grades.length }].map(item => <div key={item.label} style={{ ...s.card, minWidth: 160, textAlign: "center", padding: "20px 24px" }}><div style={{ fontSize: 30, fontWeight: 800, color: C.navy }}>{item.value}</div><div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{item.label}</div></div>)}</div>
      </div>
    </Layout>
  );
}

export function RegisteredCoursesPage() {
  const { user } = useAuth();
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);
  useEffect(() => { if (user?.token) api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token).then(setRegs).catch(() => setRegs([])); }, [user?.token]);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Môn học đã đăng ký</h2></div>
      <div style={s.card}>
        <table style={s.table}><thead><tr><th style={s.th}>Mã môn</th><th style={s.th}>Tên môn</th><th style={s.th}>Tín chỉ</th><th style={s.th}>Học kỳ</th><th style={s.th}>Trạng thái</th></tr></thead><tbody>{regs.map(r => <tr key={r.id}><td style={s.td}>{r.subjectCode}</td><td style={s.td}>{r.subjectName}</td><td style={s.td}>{r.credits}</td><td style={s.td}>{r.semester}</td><td style={s.td}>{statusBadge(r.status)}</td></tr>)}</tbody></table>
      </div>
    </Layout>
  );
}

export function StudentGradesPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  useEffect(() => { if (user?.token) api.get<ApiGrade[]>("/gateway/students/me/grades", user.token).then(setGrades).catch(() => setGrades([])); }, [user?.token]);
  const gpa = grades.length ? (grades.reduce((sum, g) => sum + Number(g.totalScore || 0), 0) / grades.length / 2.5).toFixed(2) : "0.00";

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Xem điểm</h2></div>
      <div style={s.card}>
        <table style={s.table}>
          <thead><tr><th style={s.th}>Tên môn</th><th style={s.th}>Học kỳ</th><th style={s.th}>QT</th><th style={s.th}>GK</th><th style={s.th}>CK</th><th style={s.th}>TK</th><th style={s.th}>Kết quả</th></tr></thead>
          <tbody>
            {grades.map(g => {
              const total = Number(g.totalScore ?? calcTK(Number(g.midtermScore || 0), Number(g.finalScore || 0)));
              return <tr key={g.enrollmentId}><td style={s.td}>{g.subjectName}</td><td style={s.td}>{g.semester}</td><td style={s.td}>{g.processScore ?? "-"}</td><td style={s.td}>{g.midtermScore ?? "-"}</td><td style={s.td}>{g.finalScore ?? "-"}</td><td style={{ ...s.td, fontWeight: 700 }}>{g.totalScore ?? "-"}</td><td style={s.td}><Badge label={g.gradeStatus || xepLoai(total)} color={total >= 4 ? C.success : C.danger} /></td></tr>;
            })}
            {grades.length > 0 && <tr style={{ background: C.pageBg }}><td colSpan={5} style={{ ...s.td, textAlign: "right", fontWeight: 700 }}>GPA:</td><td colSpan={2} style={{ ...s.td, fontWeight: 800, color: C.navy }}>{gpa} / 4.0</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
