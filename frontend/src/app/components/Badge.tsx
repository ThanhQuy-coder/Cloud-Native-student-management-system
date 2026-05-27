import React from "react";
import { C } from "../theme";

export function Badge({ label, color = C.info, bg }: { label: string; color?: string; bg?: string }) {
    const bgColor = bg || color + "18";
    return (
        <span style={{ background: bgColor, color, borderRadius: 99, padding: "3px 10px", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
            {label}
        </span>
    );
}

export function roleBadge(role: string) {
    const map: Record<string, [string, string]> = {
        admin: [C.navy, C.navy],
        giaovu: [C.info, C.info],
        lecturer: [C.teal, C.teal],
        student: [C.textSecondary, C.textSecondary],
    };
    const labels: Record<string, string> = { admin: "Admin", giaovu: "Giáo vụ", lecturer: "Giảng viên", student: "Sinh viên" };
    const [color] = map[role] || [C.textSecondary, C.textSecondary];
    return <Badge label={labels[role] || role} color={color} />;
}

export function statusBadge(status: string) {
    if (status === "Đang học") return <Badge label={status} color={C.success} />;
    if (status === "Bảo lưu") return <Badge label={status} color={C.warning} />;
    if (status === "Hoạt động") return <Badge label={status} color={C.success} />;
    if (status === "Không hoạt động") return <Badge label={status} color={C.danger} />;
    return <Badge label={status} color={C.textSecondary} />;
}

export default Badge;
