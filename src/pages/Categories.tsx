import { useState, useEffect } from "react";
import api from "../api/axios";

interface Category { id: number; name: string; slug: string }

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const fetch = async () => {
    const { data } = await api.get("/categories");
    setCategories(data.data);
  };

  useEffect(() => { fetch(); }, []);

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      await api.post("/categories", { name });
      setName(""); fetch(); notify("Category created");
    } catch (e: any) { notify("Error" + e.message); }
    setLoading(false);
  };

  const handleUpdate = async (id: number) => {
    try {
      await api.put(`/categories/${id}`, { name: editName });
      setEditId(null); fetch(); notify("Category updated");
    } catch (e: any) { notify("Error" + e.message); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetch(); notify("Category deleted");
    } catch (e: any) { notify("Error" + e.message); }
  };

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto" }}>
      <h2 style={{ color: "#1e293b" }}>Categories</h2>
      {msg && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="Category name..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}
        />
        <button onClick={handleCreate} disabled={loading}
          style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          {loading ? "..." : "+ Add"}
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["ID", "Name", "Slug", "Actions"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "10px 14px", color: "#94a3b8", fontSize: 13 }}>{cat.id}</td>
              <td style={{ padding: "10px 14px" }}>
                {editId === cat.id
                  ? <input value={editName} onChange={e => setEditName(e.target.value)}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }} />
                  : <span style={{ fontSize: 14, color: "#1e293b" }}>{cat.name}</span>
                }
              </td>
              <td style={{ padding: "10px 14px", color: "#94a3b8", fontSize: 13 }}>{cat.slug}</td>
              <td style={{ padding: "10px 14px", display: "flex", gap: 6 }}>
                {editId === cat.id ? (
                  <>
                    <button onClick={() => handleUpdate(cat.id)}
                      style={{ padding: "5px 12px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Save</button>
                    <button onClick={() => setEditId(null)}
                      style={{ padding: "5px 12px", background: "#e2e8f0", color: "#64748b", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                      style={{ padding: "5px 12px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)}
                      style={{ padding: "5px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}