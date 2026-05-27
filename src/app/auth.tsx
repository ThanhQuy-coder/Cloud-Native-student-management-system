import React, { createContext, useContext, useState } from "react";

export type Role = "admin" | "giaovu" | "lecturer" | "student";
export interface AuthUser { role: Role; name: string; username: string }
export interface AuthCtx { user: AuthUser | null; login: (u: AuthUser) => void; logout: () => void }

const AuthContext = createContext<AuthCtx>({ user: null, login: () => { }, logout: () => { } });
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    return (
        <AuthContext.Provider value={{ user, login: setUser, logout: () => setUser(null) }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
