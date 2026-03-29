import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">📦 InvenTrack</h1>
          <p className="text-xs text-gray-400 mt-1">Stok Yönetim Paneli</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActivePage("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activePage === "dashboard"
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActivePage("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activePage === "products"
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}
          >
            📦 Ürünler
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <p className="text-xs text-gray-500">Kaggle Dataset 2025</p>
          <p className="text-xs text-gray-500">10,000 ürün</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "products" && <Products />}
      </div>
    </div>
  );
}

export default App;