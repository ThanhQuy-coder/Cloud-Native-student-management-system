export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

export function apiPath(path: string): string {
  if (path.startsWith("/gateway/")) return path;
  if (path.startsWith("/api/")) return `/gateway/${path.slice("/api/".length)}`;
  return path.startsWith("/") ? path : `/${path}`;
}

export type Role = "admin" | "giaovu" | "lecturer" | "student";

export type ApiUser = {
  id: number;
  username: string;
  roleName: string;
  isActive: boolean;
};

export type ApiStudent = {
  id: number;
  studentCode: string;
  fullName: string;
  email: string;
  dob: string;
  gender: string;
  phone?: string | null;
  classId?: number | null;
  className?: string | null;
  learningStatus: string;
};

export type ApiClass = {
  id: number;
  classCode: string;
  className: string;
  major: string;
  academicYear: string;
  academicAdvisor?: string | null;
};

export type ApiSubject = {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  description?: string | null;
  teacherId?: number | null;
  status?: string | null;
};

export type ApiEnrollment = {
  id: number;
  studentId: number;
  studentCode?: string;
  studentName?: string;
  subjectId: number;
  subjectCode?: string;
  subjectName?: string;
  credits: number;
  semester: string;
  status: string;
};

export type ApiGrade = {
  enrollmentId: number;
  studentId: number;
  studentCode?: string;
  studentName?: string;
  subjectId: number;
  subjectCode?: string;
  subjectName?: string;
  semester: string;
  processScore?: number | null;
  midtermScore?: number | null;
  finalScore?: number | null;
  totalScore?: number | null;
  gradeStatus?: string | null;
};

export function normalizeRole(roleName: string): Role {
  const role = normalizeText(roleName);
  if (role === "staff" || role === "giaovu" || role === "giao vu") return "giaovu";
  if (role === "teacher" || role === "lecturer" || role === "giang vien") return "lecturer";
  if (role === "student" || role === "sinh vien") return "student";
  return "admin";
}

export function backendRole(role: Role): string {
  return role === "giaovu" ? "Staff" : role === "lecturer" ? "Teacher" : role === "student" ? "Student" : "Admin";
}

function normalizeText(value?: string | null): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\u0111/g, "d")
    .trim();
}

export function isOpenSubject(subject: ApiSubject): boolean {
  const status = normalizeText(subject.status || "mo");
  return !["dong", "closed", "inactive"].includes(status);
}

export function enrichEnrollmentsWithSubjects(enrollments: ApiEnrollment[], subjects: ApiSubject[]): ApiEnrollment[] {
  const subjectsById = new Map(subjects.map(subject => [subject.id, subject]));
  return enrollments.map(enrollment => {
    const subject = subjectsById.get(enrollment.subjectId);
    return {
      ...enrollment,
      subjectCode: enrollment.subjectCode || subject?.subjectCode || `#${enrollment.subjectId}`,
      subjectName: enrollment.subjectName || subject?.subjectName || "Chua co ten mon",
      credits: enrollment.credits || subject?.credits || 0
    };
  });
}

export function enrichGradesWithSubjects(grades: ApiGrade[], subjects: ApiSubject[]): ApiGrade[] {
  const subjectsById = new Map(subjects.map(subject => [subject.id, subject]));
  return grades.map(grade => {
    const subject = subjectsById.get(grade.subjectId);
    return {
      ...grade,
      subjectCode: grade.subjectCode || subject?.subjectCode || `#${grade.subjectId}`,
      subjectName: grade.subjectName || subject?.subjectName || "Chua co ten mon"
    };
  });
}

export function authHeaders(token?: string, json = false): HeadersInit {
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${apiPath(path)}`, options);
  if (!res.ok) throw new Error(await res.text() || `API error ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T,>(path: string, token?: string) => request<T>(path, { headers: authHeaders(token) }),
  post: <T,>(path: string, body: unknown, token?: string) => request<T>(path, { method: "POST", headers: authHeaders(token, true), body: JSON.stringify(body) }),
  put: <T,>(path: string, body: unknown, token?: string) => request<T>(path, { method: "PUT", headers: authHeaders(token, true), body: JSON.stringify(body) }),
  delete: <T,>(path: string, token?: string) => request<T>(path, { method: "DELETE", headers: authHeaders(token) }),
};
