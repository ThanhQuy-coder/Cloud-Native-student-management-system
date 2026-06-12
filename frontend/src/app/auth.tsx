import React, { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL, apiPath, normalizeRole, Role } from "./api";

export type { Role };

export interface AuthUser {
  role: Role;
  name: string;
  username: string;
  userId?: number;
  studentId?: number | null;
  token?: string;
}

export interface AuthCtx {
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  loading: true
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("student_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("student_user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${apiPath("/gateway/auth/login")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        return { success: false, message: await response.text() || "Tên đăng nhập hoặc mật khẩu không chính xác." };
      }

      const data = await response.json();
      if (!data.token || !data.roleName) {
        return { success: false, message: "API đăng nhập không trả về token hoặc role hợp lệ." };
      }

      const loggedInUser: AuthUser = {
        role: normalizeRole(data.roleName),
        name: data.username,
        username: data.username,
        userId: data.userId,
        studentId: data.studentId,
        token: data.token
      };

      setUser(loggedInUser);
      localStorage.setItem("student_user", JSON.stringify(loggedInUser));

      return { success: true };
    } catch {
      return { success: false, message: "Không thể kết nối tới máy chủ API." };
    }
  };

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
