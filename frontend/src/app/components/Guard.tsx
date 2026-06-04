import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth";

// Sửa roles?: any[] để TypeScript không bắt lỗi đồng bộ chữ hoa/thường, tiếng Việt hay "staff", "teacher"
export default function Guard({ children, roles }: { children: React.ReactNode; roles?: any[] }) {
    const { user } = useAuth();

    // 1. Nếu chưa đăng nhập, đá về trang login
    if (!user) return <Navigate to="/login" replace />;

    if (roles) {
        // 2. Chuyển role hiện tại của user về chữ thường để so khớp an toàn
        let currentRole = (user.role || "").toLowerCase();

        // 3. Chuẩn hóa các từ khóa lệch từ DB về đúng nhóm quyền tương ứng của hệ thống
        if (currentRole === "staff" || currentRole === "giaovu" || currentRole === "giáo vụ") {
            currentRole = "giaovu";
        }
        if (currentRole === "teacher" || currentRole === "lecturer" || currentRole === "giảng viên") {
            currentRole = "lecturer";
        }
        if (currentRole === "student" || currentRole === "sinh viên") {
            currentRole = "student";
        }
        if (currentRole === "admin") {
            currentRole = "admin";
        }

        // 4. Kiểm tra xem role sau khi chuẩn hóa có nằm trong danh sách roles được cho phép không
        if (!roles.includes(currentRole)) {
            return <Navigate to="/login" replace />;
        }
    }

    return <>{children}</>;
}