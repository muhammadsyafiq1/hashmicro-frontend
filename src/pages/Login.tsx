import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("admin@hashmicro.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 40, width: 380,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0"
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏢</div>
          <h2 style={{ color: "#1e293b", margin: 0 }}>HashMicro Test</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Sign in to continue</p>
        </div>

        {error && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fca5a5",
            borderRadius: 8, padding: "10px 14px", marginBottom: 16,
            color: "#ef4444", fontSize: 14
          }}>{error}</div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 6 }}>Email</label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 6 }}>Password</label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box"
            }}
          />
        </div>

        <button
          onClick={handleLogin} disabled={loading}
          style={{
            width: "100%", padding: "12px", background: loading ? "#94a3b8" : "#3b82f6",
            color: "#fff", border: "none", borderRadius: 8,
            cursor: loading ? "default" : "pointer", fontWeight: 700, fontSize: 15
          }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#94a3b8" }}>
          Demo: syafiq@gmail.com / 12345
        </div>
      </div>
    </div>
  );
}