import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../auth";
import type { Role } from "../auth";

export default function Guard({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
    return <>{children}</>;
}
