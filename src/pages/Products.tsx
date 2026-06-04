import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

interface Category { id: number; name: string }
interface Product {
  id: number; name: string; description: string;
  price: number; stock: number;
  category_id: number; category_name?: string;
}

const emptyForm = { category_id: 0, name: "", description: "", price: 0, stock: 0 };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const LIMIT = 100;

  const notify = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const fetchProducts = useCallback(async () => {
    const { data } = await api.get("/products", { params: { limit: LIMIT, offset: page * LIMIT, search } });
    setProducts(data.products); setTotal(data.total); setSummary(data.summary);
  }, [page, search]);

  const fetchCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data.data);
  };

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async () => {
    try {
      if (editId !== null) {
        await api.put(`/products/${editId}`, form);
        notify("Product updated");
      } else {
        await api.post("/products", form);
        notify("Product created");
      }
      setForm(emptyForm); setEditId(null); setShowForm(false); fetchProducts();
    } catch (e: any) { notify(e.message); }
  };

  const handleEdit = (p: Product) => {
    setForm({ category_id: p.category_id, name: p.name, description: p.description, price: p.price, stock: p.stock });
    setEditId(p.id); setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete?")) return;
    try { await api.delete(`/products/${id}`); notify("Deleted"); fetchProducts(); }
    catch (e: any) { notify(e.message); }
  };

  const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ color: "#1e293b", margin: 0 }}>Products</h2>
        <button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setEditId(null); }}
          style={{ padding: "9px 18px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          {showForm ? "✕ Close" : "+ Add Product"}
        </button>
      </div>

      {msg && <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "10px 16px", marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      {/* Inventory Summary */}
      {Object.keys(summary).length > 0 && (
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {Object.entries(summary).map(([cat, val]) => (
            <div key={cat} style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "8px 16px" }}>
              <div style={{ fontSize: 12, color: "#3b82f6", fontWeight: 600 }}>{cat}</div>
              <div style={{ fontSize: 13, color: "#1e293b" }}>Stock value: {fmt(val)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h4 style={{ margin: "0 0 16px", color: "#1e293b" }}>{editId ? "Edit Product" : "New Product"}</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "Name", key: "name", type: "text" },
              { label: "Price (IDR)", key: "price", type: "number" },
              { label: "Stock", key: "stock", type: "number" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, boxSizing: "border-box" }}
                />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Category</label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: Number(e.target.value) })}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14 }}>
                <option value={0}>Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 12, color: "#64748b", display: "block", marginBottom: 4 }}>Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, resize: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <button onClick={handleSubmit}
            style={{ marginTop: 16, padding: "9px 24px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
            {editId ? "Update" : "Create"}
          </button>
        </div>
      )}

      {/* Search */}
      <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} placeholder="🔍 Search products..."
        style={{ padding: "9px 14px", borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 14, width: 280, marginBottom: 16 }} />

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {["ID", "Name", "Category", "Price", "Stock", "Actions"].map(h => (
              <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 13, color: "#64748b", borderBottom: "2px solid #e2e8f0" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
              <td style={{ padding: "10px 14px", color: "#94a3b8", fontSize: 13 }}>{p.id}</td>
              <td style={{ padding: "10px 14px", fontWeight: 500, color: "#1e293b", fontSize: 14 }}>{p.name}</td>
              <td style={{ padding: "10px 14px" }}>
                <span style={{ background: "#eff6ff", color: "#3b82f6", borderRadius: 20, padding: "2px 10px", fontSize: 12 }}>{p.category_name}</span>
              </td>
              <td style={{ padding: "10px 14px", fontSize: 13, color: "#1e293b" }}>{fmt(p.price)}</td>
              <td style={{ padding: "10px 14px", fontSize: 13 }}>
                <span style={{ color: p.stock > 10 ? "#22c55e" : p.stock > 0 ? "#f59e0b" : "#ef4444", fontWeight: 600 }}>{p.stock}</span>
              </td>
              <td style={{ padding: "10px 14px", display: "flex", gap: 6 }}>
                <button onClick={() => handleEdit(p)}
                  style={{ padding: "5px 12px", background: "#f59e0b", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Edit</button>
                <button onClick={() => handleDelete(p.id)}
                  style={{ padding: "5px 12px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
        <span style={{ fontSize: 13, color: "#94a3b8" }}>Total: {total} products</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0", background: page === 0 ? "#f8fafc" : "#fff", cursor: page === 0 ? "default" : "pointer" }}>← Prev</button>
          <span style={{ padding: "6px 14px", fontSize: 13 }}>Page {page + 1} / {Math.max(1, Math.ceil(total / LIMIT))}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * LIMIT >= total}
            style={{ padding: "6px 14px", borderRadius: 6, border: "1px solid #e2e8f0", cursor: (page + 1) * LIMIT >= total ? "default" : "pointer" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}