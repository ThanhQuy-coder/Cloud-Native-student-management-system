import React from "react";
import { C } from "../theme";
import { s } from "../theme";

export default function StatCard({ icon, label, value, color = C.navy }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
    return (
        <div style={{ ...s.card, display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: color + "18", borderRadius: 12, padding: 14, color, flexShrink: 0 }}>{icon}</div>
            <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.textPrimary, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 13, color: C.textSecondary, marginTop: 4 }}>{label}</div>
            </div>
        </div>
    );
}
