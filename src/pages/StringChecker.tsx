import { useState } from "react";
import api from "../api/axios";

interface Result {
  input1: string; input2: string; type: string;
  totalChars: number; matchedCount: number;
  percentage: number; matchedChars: string[];
  notMatchedChars: string[]; summary: string;
}

export default function StringChecker() {
  const [input1, setInput1] = useState("ABBCD");
  const [input2, setInput2] = useState("Gallant Duck");
  const [type, setType] = useState<"sensitive" | "non-sensitive">("sensitive");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!input1 || !input2) return;
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/string-checker", { input1, input2, type });
      setResult(data.data);
    } catch (e: any) { setError(e.message); }
    setLoading(false);
  };

  const pct = result?.percentage ?? 0;
  const barColor = pct >= 60 ? "#22c55e" : pct >= 30 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: 32, maxWidth: 680, margin: "0 auto" }}>
      <h2 style={{ color: "#1e293b" }}>🔍 String Character Checker</h2>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Cek berapa persen karakter dari <strong>Input 1</strong> yang muncul di <strong>Input 2</strong>.
      </p>

      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 6 }}>Input 1</label>
          <input value={input1} onChange={e => setInput1(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 15, fontFamily: "monospace", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 6 }}>Input 2</label>
          <input value={input2} onChange={e => setInput2(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 15, fontFamily: "monospace", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 8 }}>Type</label>
          <div style={{ display: "flex", gap: 12 }}>
            {(["sensitive", "non-sensitive"] as const).map(t => (
              <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14 }}>
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />
                <span style={{ color: type === t ? "#3b82f6" : "#475569", fontWeight: type === t ? 600 : 400 }}>
                  {t === "sensitive" ? "Case Sensitive" : "Case Insensitive"}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={handleCheck} disabled={loading}
          style={{ width: "100%", padding: "12px", background: loading ? "#94a3b8" : "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 15 }}>
          {loading ? "Checking..." : "Check →"}
        </button>
      </div>

      {error && <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 8, padding: 14, marginTop: 16, color: "#ef4444", fontSize: 14 }}>{error}</div>}

      {result && (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, marginTop: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <h3 style={{ margin: "0 0 16px", color: "#1e293b" }}>Result</h3>

          {/* Big percentage */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: barColor }}>{result.percentage}%</div>
            <div style={{ fontSize: 14, color: "#64748b" }}>{result.summary}</div>
          </div>

          {/* Progress bar */}
          <div style={{ background: "#f1f5f9", borderRadius: 99, height: 10, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ background: barColor, width: `${result.percentage}%`, height: "100%", transition: "width 0.4s ease", borderRadius: 99 }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#f0fdf4", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 6 }}> Matched Characters</div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: "#15803d", letterSpacing: 3 }}>
                {result.matchedChars.length > 0 ? result.matchedChars.join(" ") : "—"}
              </div>
            </div>
            <div style={{ background: "#fef2f2", borderRadius: 8, padding: 14 }}>
              <div style={{ fontSize: 12, color: "#dc2626", fontWeight: 600, marginBottom: 6 }}> Not Matched</div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: "#b91c1c", letterSpacing: 3 }}>
                {result.notMatchedChars.length > 0 ? result.notMatchedChars.join(" ") : "—"}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, background: "#f8fafc", borderRadius: 8, padding: 14, fontSize: 13, color: "#64748b" }}>
            <strong>Mode:</strong> {result.type} &nbsp;|&nbsp;
            <strong>Total chars in Input 1:</strong> {result.totalChars} &nbsp;|&nbsp;
            <strong>Matched:</strong> {result.matchedCount}
          </div>
        </div>
      )}
    </div>
  );
}