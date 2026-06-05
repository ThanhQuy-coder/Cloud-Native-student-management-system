import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "../auth";
import { C, s } from "../theme";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    const defaultRoutes = {
      admin: "/admin/dashboard",
      giaovu: "/giaovu/students",
      lecturer: "/lecturer/classes",
      student: "/student/registration"
    };
    return <Navigate to={defaultRoutes[user.role]} replace />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!username.trim() || !password.trim()) {
      setErrorMessage("Vui lòng nhập tên đăng nhập và mật khẩu.");
      return;
    }

    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message || "Đăng nhập thất bại.");
      return;
    }

    navigate("/");
  }

  return (
    <div style={{ ...s.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={handleLogin} style={{ ...s.card, width: 400, padding: 40, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ background: C.navy, borderRadius: 16, padding: 14 }}>
            <GraduationCap size={32} color={C.white} />
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: "0 0 4px" }}>Hệ thống Quản lý Sinh viên</h1>
        <p style={{ fontSize: 13, color: C.textSecondary, margin: "0 0 24px" }}>Trường Đại học Công nghệ</p>

        {errorMessage && (
          <div style={{ background: "#FEF2F2", color: C.danger, border: "1px solid #FEE2E2", borderRadius: 8, padding: "10px 12px", fontSize: 13, marginBottom: 16, textAlign: "left" }}>
            {errorMessage}
          </div>
        )}

        <div style={s.formGroup}>
          <label style={s.label}>Tên đăng nhập</label>
          <input style={s.input} value={username} onChange={e => setUsername(e.target.value)} disabled={isSubmitting} />
        </div>

        <div style={s.formGroup}>
          <label style={s.label}>Mật khẩu</label>
          <div style={{ position: "relative" }}>
            <input type={showPw ? "text" : "password"} style={{ ...s.input, paddingRight: 40 }} value={password} onChange={e => setPassword(e.target.value)} disabled={isSubmitting} />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.textSecondary, padding: 0, display: "flex" }}>
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ ...s.btn("primary"), width: "100%", justifyContent: "center", padding: "12px 16px", fontSize: 14, borderRadius: 10, marginTop: 16, opacity: isSubmitting ? 0.7 : 1 }}>
          {isSubmitting ? "Đang xác thực..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
