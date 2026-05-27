import React from "react";
import Sidebar from "./Sidebar";
import { s } from "../theme";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: s.page.background }}>
            <Sidebar />
            <main style={{ marginLeft: 240, flex: 1, padding: 28, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
                {children}
            </main>
        </div>
    );
}
