import React from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { LayoutDashboard, UserCog, UserCheck, Layers, BarChart2, ClipboardList, Building2, BookOpen } from "lucide-react";
import { useAuth } from "../auth";
import { C } from "../theme";
import type { Role } from "../auth";

const MENUS: Record<Role, { path: string; label: string; icon: React.ReactNode }[]> = {
    admin: [
        { path: "/admin/dashboard", label: "Tổng quan", icon: <LayoutDashboard size={18} /> },
        { path: "/admin/accounts", label: "Quản lý tài khoản", icon: <UserCog size={18} /> },
        { path: "/admin/students", label: "Quản lý sinh viên", icon: <UserCheck size={18} /> },
        { path: "/admin/classes", label: "Lớp & Môn học", icon: <Layers size={18} /> },
        { path: "/admin/reports", label: "Báo cáo", icon: <BarChart2 size={18} /> },
    ],
    giaovu: [
        { path: "/giaovu/students", label: "Quản lý sinh viên", icon: <UserCheck size={18} /> },
        { path: "/giaovu/classes", label: "Lớp & Môn học", icon: <Layers size={18} /> },
        { path: "/giaovu/registration", label: "Đăng ký môn học", icon: <ClipboardList size={18} /> },
    ],
    lecturer: [
        { path: "/lecturer/classes", label: "Lớp phụ trách", icon: <Building2 size={18} /> },
        { path: "/lecturer/grades", label: "Nhập điểm", icon: <BookOpen size={18} /> },
    ],
    student: [
        { path: "/student/profile", label: "Thông tin cá nhân", icon: <UserCheck size={18} /> },
        { path: "/student/courses", label: "Môn học đã đăng ký", icon: <BookOpen size={18} /> },
        { path: "/student/grades", label: "Xem điểm", icon: <BarChart2 size={18} /> },
    ],
};

const ROLE_LABELS: Record<Role, string> = { admin: "Quản trị viên", giaovu: "Giáo vụ", lecturer: "Giảng viên", student: "Sinh viên" };

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    if (!user) return null;
    const menu = MENUS[user.role];

    return (
        <div style={{ width: 240, minWidth: 240, height: "100vh", background: C.navy, display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 100 }}>
            <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: 8 }}>
                    </div>
                    <div>
                        <div style={{ color: C.white, fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>Hệ thống QLSV</div>
                        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>ĐH Công nghệ</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: "12px 20px 4px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    {ROLE_LABELS[user.role]}
                </div>
            </div>

            <nav style={{ flex: 1, overflowY: "auto", padding: "4px 12px" }}>
                {menu.map((item) => {
                    const active = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                                borderRadius: 8, marginBottom: 2, textDecoration: "none",
                                background: active ? "rgba(255,255,255,0.15)" : "transparent",
                                color: active ? C.white : "rgba(255,255,255,0.65)",
                                fontWeight: active ? 600 : 400, fontSize: 13,
                                transition: "all 0.15s",
                            }}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 13, color: C.white, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>{user.username}</div>
                <button
                    onClick={() => { logout(); navigate("/login"); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: "8px 12px", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 13, width: "100%" }}
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    );
}
