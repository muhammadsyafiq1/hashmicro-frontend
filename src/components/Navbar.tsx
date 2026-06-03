import { Link, useLocation, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/categories", label: "Categories" },
  { to: "/products", label: "Products" },
  { to: "/string-checker", label: "String Checker" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#1e293b", padding: "0 24px",
      display: "flex", alignItems: "center", gap: 8, height: 56,
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
    }}>
      <span style={{ color: "#38bdf8", fontWeight: 700, fontSize: 18, marginRight: 16 }}>
        HashMicro Test
      </span>

      {links.map((l) => (
        <Link key={l.to} to={l.to} style={{
          padding: "6px 14px", borderRadius: 6, textDecoration: "none",
          color: pathname === l.to ? "#0f172a" : "#cbd5e1",
          background: pathname === l.to ? "#38bdf8" : "transparent",
          fontWeight: pathname === l.to ? 600 : 400,
          fontSize: 14, transition: "all 0.15s"
        }}>
          {l.label}
        </Link>
      ))}

      <div style={{ flex: 1 }} />

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>👤 {user.name}</span>
          <button onClick={handleLogout} style={{
            padding: "6px 14px", background: "#ef4444", color: "#fff",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600
          }}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}