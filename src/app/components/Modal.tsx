import React from "react";
import { C } from "../theme";

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div style={{ background: C.white, borderRadius: 16, padding: 32, width: 480, maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: C.textPrimary }}>{title}</h3>
                    <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: C.textSecondary, lineHeight: 1, padding: "0 4px" }}>✕</button>
                </div>
                {children}
            </div>
        </div>
    );
}
