import React, { createContext, useContext, useState, useEffect } from "react";

// Địa chỉ Base API của Backend .NET chạy local
const API_BASE_URL = "http://localhost:5111";

export type Role = "admin" | "giaovu" | "lecturer" | "student";

export interface AuthUser {
    role: Role;
    name: string;
    username: string;
    token?: string; // Lưu thêm token để gọi các API khác
}

export interface AuthCtx {
    user: AuthUser | null;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    loading: boolean; // Trạng thái kiểm tra token khi vừa load trang
}

const AuthContext = createContext<AuthCtx>({
    user: null,
    login: async () => ({ success: false }),
    logout: () => { },
    loading: true
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Tự động kiểm tra xem user đã đăng nhập trước đó chưa khi tải lại trang (F5)
    useEffect(() => {
        const storedUser = localStorage.getItem("student_user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem("student_user");
            }
        }
        setLoading(false);
    }, []);

    // Hàm login kết nối trực tiếp với Backend API
    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            // 1. Kiểm tra nếu Server phản hồi lỗi xác thực (400, 401, 404, v.v.)
            if (!response.ok) {
                let errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác.";
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.message) errorMessage = errorData.message;
                } catch (e) {
                    // Không parse được JSON lỗi
                }
                return { success: false, message: errorMessage };
            }

            // 2. Nếu thành công (status 200 OK)
            const data = await response.json();
            console.log("Dữ liệu thực tế từ Backend trả về:", data);

            // Đọc chính xác trường dữ liệu thực tế từ API .NET
            const rawRole = data.roleName; // Khớp chính xác với 'roleName' từ log console
            const rawUsername = data.username;
            const token = data.token;

            if (token && rawRole) {
                // Chuyển đổi giá trị 'Admin' -> 'admin' để khớp với định nghĩa Type Role ở Frontend
                const mappedRole = rawRole.toLowerCase() as Role;

                const loggedInUser: AuthUser = {
                    role: mappedRole,
                    name: rawUsername, // Vì API hiện tại chưa trả về trường Name riêng biệt, ta lấy tạm username hiển thị
                    username: rawUsername,
                    token: token
                };

                setUser(loggedInUser);
                localStorage.setItem("student_user", JSON.stringify(loggedInUser));
                return { success: true };
            }

            return { success: false, message: "Tài khoản không trả về quyền (roleName) hợp lệ từ Server." };

        } catch (error) {
            console.error("Lỗi kết nối thực tế:", error);
            return { success: false, message: "Không thể kết nối tới máy chủ API (Kiểm tra CORS hoặc Port)." };
        }
    };

    // Hàm logout xóa sạch trạng thái
    const logout = () => {
        setUser(null);
        localStorage.removeItem("student_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export default AuthContext;