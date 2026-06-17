import { useEffect, useState } from "react";
import {
  api,
  ApiEnrollment,
  ApiGrade,
  ApiStudent,
  ApiSubject,
  enrichEnrollmentsWithSubjects,
  enrichGradesWithSubjects,
  isOpenSubject
} from "../api";
import { useAuth } from "../auth";
import Badge, { statusBadge } from "../components/Badge";
import Layout from "../components/Layout";
import { xepLoai } from "../utils";
import { C, s } from "../theme";

async function loadSubjects(token: string): Promise<ApiSubject[]> {
  return api.get<ApiSubject[]>("/gateway/subjects", token);
}

function calcTotalFromGrade(g: ApiGrade) {
  if (g.totalScore !== null && g.totalScore !== undefined) return Number(g.totalScore);
  if (g.processScore === null || g.processScore === undefined || g.midtermScore === null || g.midtermScore === undefined || g.finalScore === null || g.finalScore === undefined) return null;
  return Math.round((Number(g.processScore) * 0.2 + Number(g.midtermScore) * 0.3 + Number(g.finalScore) * 0.5) * 100) / 100;
}

function calcGpa(grades: ApiGrade[]) {
  const totals = grades.map(calcTotalFromGrade).filter((score): score is number => score !== null);
  if (!totals.length) return "0.00";
  return (totals.reduce((sum, score) => sum + score, 0) / totals.length / 2.5).toFixed(2);
}

function availableSubjects(subjects: ApiSubject[], regs: ApiEnrollment[]) {
  const registeredIds = new Set(regs.map(reg => reg.subjectId));
  return subjects.filter(subject => isOpenSubject(subject) && !registeredIds.has(subject.id));
}

function StudentEnrollmentTable({ regs, emptyText }: { regs: ApiEnrollment[]; emptyText: string }) {
  return (
    <table style={s.table}>
      <thead><tr><th style={s.th}>Ma mon</th><th style={s.th}>Ten mon</th><th style={s.th}>Tin chi</th><th style={s.th}>Hoc ky</th><th style={s.th}>Trang thai</th></tr></thead>
      <tbody>
        {regs.map(r => <tr key={r.id}><td style={s.td}>{r.subjectCode}</td><td style={s.td}>{r.subjectName}</td><td style={s.td}>{r.credits}</td><td style={s.td}>{r.semester}</td><td style={s.td}>{statusBadge(r.status)}</td></tr>)}
        {regs.length === 0 && <tr><td colSpan={5} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>{emptyText}</td></tr>}
      </tbody>
    </table>
  );
}

export function StudentCourseRegistrationPage() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<ApiSubject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [semester, setSemester] = useState("HK1 2026");
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    if (!user?.token) return;
    setLoading(true);
    try {
      const [subjectData, regData] = await Promise.all([
        loadSubjects(user.token),
        api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token)
      ]);
      const enrichedRegs = enrichEnrollmentsWithSubjects(regData, subjectData);
      const available = availableSubjects(subjectData, enrichedRegs);

      setRegs(enrichedRegs);
      setSubjects(available);
      setSelectedSubject(prev => available.some(subject => subject.id === prev) ? prev : available[0]?.id || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload().catch(err => {
      console.error(err);
      setSubjects([]);
      setRegs([]);
      setSelectedSubject(0);
      setLoading(false);
    });
  }, [user?.token]);

  async function register() {
    if (!user?.token || !selectedSubject) return;
    try {
      await api.post("/gateway/students/me/subjects", { subjectId: selectedSubject, semester }, user.token);
      await reload();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Dang ky mon hoc</h2><p style={s.pageSub}>Chon mon hoc dang mo va xem cac mon da dang ky</p></div>
      <div style={{ display: "grid", gap: 16 }}>
        <div style={s.card}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr auto", gap: 12, alignItems: "end", marginBottom: 20 }}>
            <div><label style={s.label}>Mon hoc muon dang ky</label><select style={{ ...s.select, width: "100%" }} value={selectedSubject} onChange={e => setSelectedSubject(+e.target.value)} disabled={!subjects.length}>{subjects.map(sub => <option key={sub.id} value={sub.id}>{sub.subjectCode} - {sub.subjectName}</option>)}</select></div>
            <div><label style={s.label}>Hoc ky</label><input style={s.input} value={semester} onChange={e => setSemester(e.target.value)} /></div>
            <button style={{ ...s.btn("primary"), height: 38, opacity: selectedSubject ? 1 : 0.65 }} onClick={register} disabled={!selectedSubject}>Dang ky</button>
          </div>

          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Cac mon hoc co the dang ky</h3>
          <table style={s.table}>
            <thead><tr><th style={s.th}>Ma mon</th><th style={s.th}>Ten mon</th><th style={s.th}>Tin chi</th><th style={s.th}>Trang thai</th></tr></thead>
            <tbody>
              {subjects.map(subject => <tr key={subject.id}><td style={s.td}>{subject.subjectCode}</td><td style={s.td}>{subject.subjectName}</td><td style={s.td}>{subject.credits}</td><td style={s.td}>{statusBadge(subject.status || "Mo")}</td></tr>)}
              {!loading && subjects.length === 0 && <tr><td colSpan={4} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Khong con mon hoc dang mo de dang ky.</td></tr>}
              {loading && <tr><td colSpan={4} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Dang tai mon hoc...</td></tr>}
            </tbody>
          </table>
        </div>

        <div style={s.card}>
          <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700 }}>Mon hoc da dang ky</h3>
          <StudentEnrollmentTable regs={regs} emptyText={loading ? "Dang tai mon da dang ky..." : "Chua co mon hoc da dang ky."} />
        </div>
      </div>
    </Layout>
  );
}

export function StudentProfilePage() {
  const { user } = useAuth();
  const [student, setStudent] = useState<ApiStudent | null>(null);
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    Promise.allSettled([
      api.get<ApiStudent>("/gateway/students/me", user.token),
      loadSubjects(user.token),
      api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token),
      api.get<ApiGrade[]>("/gateway/students/me/grades", user.token)
    ]).then(([studentResult, subjectResult, regResult, gradeResult]) => {
      const subjectData = subjectResult.status === "fulfilled" ? subjectResult.value : [];
      setStudent(studentResult.status === "fulfilled" ? studentResult.value : null);
      setRegs(regResult.status === "fulfilled" ? enrichEnrollmentsWithSubjects(regResult.value, subjectData) : []);
      setGrades(gradeResult.status === "fulfilled" ? enrichGradesWithSubjects(gradeResult.value, subjectData) : []);
    }).finally(() => setLoading(false));
  }, [user?.token]);

  if (loading) return <Layout><div style={s.card}>Dang tai thong tin sinh vien...</div></Layout>;
  if (!student) return <Layout><div style={s.card}>Khong tai duoc thong tin sinh vien. Kiem tra lai API /gateway/students/me va lien ket student_references.</div></Layout>;

  const initials = student.fullName.split(" ").slice(-2).map(w => w[0]).join("");
  const totalCredits = regs.reduce((sum, r) => sum + Number(r.credits || 0), 0);
  const gpa = calcGpa(grades);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Thong tin ca nhan</h2></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
        <div style={s.card}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.navy, color: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>{initials}</div>
            <div><h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{student.fullName}</h2><div style={{ color: C.textSecondary, fontSize: 13, marginTop: 4 }}>{student.studentCode}</div><div style={{ marginTop: 8 }}>{statusBadge(student.learningStatus)}</div></div>
            <div style={{ marginLeft: "auto", background: C.navy + "12", borderRadius: 12, padding: "12px 20px", textAlign: "center" }}><div style={{ fontSize: 28, fontWeight: 800, color: C.navy }}>{gpa}</div><div style={{ fontSize: 12, color: C.textSecondary }}>GPA / 4.0</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Lop", student.className || "-"], ["Email", student.email], ["SDT", student.phone || "-"], ["Ngay sinh", student.dob], ["Gioi tinh", student.gender], ["Trang thai", student.learningStatus]].map(([label, val]) => <div key={label} style={{ padding: "12px 16px", background: C.pageBg, borderRadius: 8 }}><div style={{ fontSize: 11, color: C.textSecondary, marginBottom: 4, textTransform: "uppercase" }}>{label}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{val}</div></div>)}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{[{ label: "Mon da dang ky", value: regs.length }, { label: "Tong tin chi", value: totalCredits }, { label: "Bang diem", value: grades.length }].map(item => <div key={item.label} style={{ ...s.card, minWidth: 160, textAlign: "center", padding: "20px 24px" }}><div style={{ fontSize: 30, fontWeight: 800, color: C.navy }}>{item.value}</div><div style={{ fontSize: 12, color: C.textSecondary, marginTop: 4 }}>{item.label}</div></div>)}</div>
      </div>
    </Layout>
  );
}

export function RegisteredCoursesPage() {
  const { user } = useAuth();
  const [regs, setRegs] = useState<ApiEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    Promise.all([loadSubjects(user.token), api.get<ApiEnrollment[]>("/gateway/students/me/subjects", user.token)])
      .then(([subjectData, regData]) => setRegs(enrichEnrollmentsWithSubjects(regData, subjectData)))
      .catch(() => setRegs([]))
      .finally(() => setLoading(false));
  }, [user?.token]);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Mon hoc da dang ky</h2></div>
      <div style={s.card}>
        <StudentEnrollmentTable regs={regs} emptyText={loading ? "Dang tai mon da dang ky..." : "Chua co mon hoc da dang ky."} />
      </div>
    </Layout>
  );
}

export function StudentGradesPage() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    setLoading(true);
    Promise.all([loadSubjects(user.token), api.get<ApiGrade[]>("/gateway/students/me/grades", user.token)])
      .then(([subjectData, gradeData]) => setGrades(enrichGradesWithSubjects(gradeData, subjectData)))
      .catch(() => setGrades([]))
      .finally(() => setLoading(false));
  }, [user?.token]);

  const gpa = calcGpa(grades);

  return (
    <Layout>
      <div style={s.pageHeader}><h2 style={s.pageTitle}>Xem diem</h2></div>
      <div style={s.card}>
        <table style={s.table}>
          <thead><tr><th style={s.th}>Ma mon</th><th style={s.th}>Ten mon</th><th style={s.th}>Hoc ky</th><th style={s.th}>QT</th><th style={s.th}>GK</th><th style={s.th}>CK</th><th style={s.th}>TK</th><th style={s.th}>Ket qua</th></tr></thead>
          <tbody>
            {grades.map(g => {
              const total = calcTotalFromGrade(g);
              return <tr key={g.enrollmentId}><td style={s.td}>{g.subjectCode}</td><td style={s.td}>{g.subjectName}</td><td style={s.td}>{g.semester}</td><td style={s.td}>{g.processScore ?? "-"}</td><td style={s.td}>{g.midtermScore ?? "-"}</td><td style={s.td}>{g.finalScore ?? "-"}</td><td style={{ ...s.td, fontWeight: 700 }}>{total ?? "-"}</td><td style={s.td}>{total === null ? <Badge label="Chua co diem" color={C.textSecondary} /> : <Badge label={g.gradeStatus || xepLoai(total)} color={total >= 4 ? C.success : C.danger} />}</td></tr>;
            })}
            {grades.length > 0 && <tr style={{ background: C.pageBg }}><td colSpan={6} style={{ ...s.td, textAlign: "right", fontWeight: 700 }}>GPA:</td><td colSpan={2} style={{ ...s.td, fontWeight: 800, color: C.navy }}>{gpa} / 4.0</td></tr>}
            {!loading && grades.length === 0 && <tr><td colSpan={8} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Chua co diem de hien thi.</td></tr>}
            {loading && <tr><td colSpan={8} style={{ ...s.td, textAlign: "center", color: C.textSecondary, padding: 24 }}>Dang tai diem...</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
