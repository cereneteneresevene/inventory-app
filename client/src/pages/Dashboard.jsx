import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const API = "http://localhost:5001/api";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, productsRes] = await Promise.all([
        axios.get(`${API}/products/stats/summary`),
        axios.get(`${API}/products`)
      ]);

      setStats(statsRes.data);

      // Kategori bazlı gruplama
      const catMap = {};
      productsRes.data.forEach(p => {
        catMap[p.category] = (catMap[p.category] || 0) + 1;
      });
      const catArr = Object.entries(catMap).map(([name, value]) => ({ name, value }));
      setCategoryData(catArr);

      // Düşük stok ürünleri
      const low = productsRes.data.filter(p => p.stock <= p.lowStockThreshold);
      setLowStockProducts(low.slice(0, 5));

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Stok durumuna genel bakış</p>
      </div>

      {/* Metrik Kartlar */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Toplam Ürün</p>
          <p className="text-3xl font-bold text-gray-800">{stats?.totalProducts?.toLocaleString()}</p>
          <p className="text-xs text-indigo-500 mt-2">📦 Tüm kategoriler</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Toplam Stok Değeri</p>
          <p className="text-3xl font-bold text-gray-800">${stats?.totalValue?.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
          <p className="text-xs text-emerald-500 mt-2">💰 Güncel değer</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Düşük Stok Uyarısı</p>
          <p className="text-3xl font-bold text-red-500">{stats?.lowStock}</p>
          <p className="text-xs text-red-400 mt-2">⚠️ Kritik seviye</p>
        </div>
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Kategoriye Göre Ürün Dağılımı</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Kategori Oranları</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Düşük Stok Tablosu */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">⚠️ Kritik Stok Seviyesindeki Ürünler</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3">Ürün</th>
              <th className="pb-3">Kategori</th>
              <th className="pb-3">Stok</th>
              <th className="pb-3">Fiyat</th>
              <th className="pb-3">Durum</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map(p => (
              <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 font-medium text-gray-800">{p.name}</td>
                <td className="py-3 text-gray-500">{p.category}</td>
                <td className="py-3 font-bold text-red-500">{p.stock}</td>
                <td className="py-3 text-gray-600">${p.price}</td>
                <td className="py-3">
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">Kritik</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}