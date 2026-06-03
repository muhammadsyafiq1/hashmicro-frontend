export default function Dashboard() {
  return (
    <div style={{ padding: 32 }}>
      <h1 style={{ color: "#1e293b", marginBottom: 8 }}>Welcome 👋</h1>
      <p style={{ color: "#64748b" }}>HashMicro Technical Test — Syafiq</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginTop: 32 }}>
        {[
          { title: "Products CRUD", desc: "Create, Read, Update, Delete products with category" },
          { title: "Categories CRUD", desc: "Manage product categories" },
          { title: "String Checker", desc: "Sensitive & non-sensitive character matching" },
        ].map((c) => (
          <div key={c.title} style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
          }}>
            <div style={{ fontSize: 32 }}></div>
            <h3 style={{ margin: "8px 0 4px", color: "#1e293b" }}>{c.title}</h3>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}