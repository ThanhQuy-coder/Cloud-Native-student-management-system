export function calcTK(gk: number, ck: number) { return Math.round((gk * 0.4 + ck * 0.6) * 10) / 10; }
export function xepLoai(tk: number) {
    if (tk >= 8.5) return "Xuất sắc";
    if (tk >= 7.0) return "Giỏi";
    if (tk >= 5.5) return "Khá";
    if (tk >= 4.0) return "Trung bình";
    return "Yếu";
}
export function calcGPA(gradeList: { gk: number; ck: number; credits: number }[]) {
    const total = gradeList.reduce((s, g) => s + calcTK(g.gk, g.ck) * g.credits, 0);
    const creds = gradeList.reduce((s, g) => s + g.credits, 0);
    return creds ? Math.round((total / creds) * 100) / 100 : 0;
}
