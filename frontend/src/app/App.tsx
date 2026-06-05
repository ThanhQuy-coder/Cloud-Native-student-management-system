import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./auth";
import Guard from "./components/Guard";
import LoginPage from "./pages/LoginPage";
import { AccountManagement, AdminDashboard, AdminReports } from "./pages/AdminPages";
import { ClassSubjectManagementPage, StaffCourseRegistrationPage, StudentManagementPage } from "./pages/AcademicPages";
import { EnterGradesPage, LecturerClassesPage } from "./pages/LecturerPages";
import { RegisteredCoursesPage, StudentCourseRegistrationPage, StudentGradesPage, StudentProfilePage } from "./pages/StudentPages";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/admin/dashboard" element={<Guard roles={["admin"]}><AdminDashboard /></Guard>} />
            <Route path="/admin/accounts" element={<Guard roles={["admin"]}><AccountManagement /></Guard>} />
            <Route path="/admin/students" element={<Guard roles={["admin"]}><StudentManagementPage /></Guard>} />
            <Route path="/admin/classes" element={<Guard roles={["admin"]}><ClassSubjectManagementPage /></Guard>} />
            <Route path="/admin/reports" element={<Guard roles={["admin"]}><AdminReports /></Guard>} />

            <Route path="/giaovu/students" element={<Guard roles={["giaovu"]}><StudentManagementPage /></Guard>} />
            <Route path="/giaovu/classes" element={<Guard roles={["giaovu"]}><ClassSubjectManagementPage /></Guard>} />
            <Route path="/giaovu/registration" element={<Guard roles={["giaovu"]}><StaffCourseRegistrationPage /></Guard>} />

            <Route path="/lecturer/classes" element={<Guard roles={["lecturer"]}><LecturerClassesPage /></Guard>} />
            <Route path="/lecturer/grades" element={<Guard roles={["lecturer"]}><EnterGradesPage /></Guard>} />

            <Route path="/student/registration" element={<Guard roles={["student"]}><StudentCourseRegistrationPage /></Guard>} />
            <Route path="/student/profile" element={<Guard roles={["student"]}><StudentProfilePage /></Guard>} />
            <Route path="/student/courses" element={<Guard roles={["student"]}><RegisteredCoursesPage /></Guard>} />
            <Route path="/student/grades" element={<Guard roles={["student"]}><StudentGradesPage /></Guard>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
