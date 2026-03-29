import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5001/api";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tümü");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", stock: "", supplier: "" });
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    let result = products;
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "Tümü") result = result.filter(p => p.category === category);
    setFiltered(result);
    setPage(1);
  }, [search, category, products]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
      setFiltered(res.data);
      const cats = ["Tümü", ...new Set(res.data.map(p => p.category))];
      setCategories(cats);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditProduct(null);
    setForm({ name: "", category: "", price: "", stock: "", supplier: "" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditProduct(p);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock, supplier: p.supplier });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editProduct) {
        await axios.put(`${API}/products/${editProduct._id}`, form);
      } else {
        await axios.post(`${API}/products`, form);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu ürünü silmek istediğine emin misin?")) return;
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Ürünler</h2>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} ürün listeleniyor</p>
        </div>
        <button onClick={openAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all">
          + Yeni Ürün
        </button>
      </div>

      {/* Filtreler */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Ürün ara..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Tablo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr className="text-left text-gray-500">
              <th className="px-6 py-4">Ürün Adı</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Fiyat</th>
              <th className="px-6 py-4">Stok</th>
              <th className="px-6 py-4">Tedarikçi</th>
              <th className="px-6 py-4">Durum</th>
              <th className="px-6 py-4">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{p.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-full">{p.category}</span>
                </td>
                <td className="px-6 py-4 text-gray-700">${p.price}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{p.stock}</td>
                <td className="px-6 py-4 text-gray-500">{p.supplier}</td>
                <td className="px-6 py-4">
                  {p.stock <= p.lowStockThreshold
                    ? <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">⚠️ Kritik</span>
                    : <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full">✓ Normal</span>
                  }
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="text-indigo-500 hover:text-indigo-700 text-xs font-medium">Düzenle</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Sil</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Sayfa {page} / {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Önceki</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Sonraki →</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6">{editProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}</h3>
            <div className="space-y-4">
              {["name", "category", "price", "stock", "supplier"].map(field => (
                <div key={field}>
                  <label className="text-xs text-gray-500 font-medium capitalize">{field === "name" ? "Ürün Adı" : field === "category" ? "Kategori" : field === "price" ? "Fiyat" : field === "stock" ? "Stok" : "Tedarikçi"}</label>
                  <input
                    type={["price", "stock"].includes(field) ? "number" : "text"}
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50">İptal</button>
              <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-sm hover:bg-indigo-700">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}