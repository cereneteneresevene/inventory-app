# 📦 InvenTrack — Stok & Envanter Yönetim Sistemi

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss)

Gerçek dünya verisiyle çalışan fullstack stok yönetim uygulaması. Kaggle'dan alınan **10.000 ürünlük Global Product Inventory Dataset 2025** kullanılarak geliştirilmiştir.

## ✨ Özellikler

- 📊 **Dashboard** — Toplam ürün, stok değeri ve kritik stok uyarıları
- 📈 **Grafikler** — Kategori bazlı bar chart ve pie chart (Recharts)
- 📦 **Ürün Yönetimi** — Ekleme, düzenleme, silme (CRUD)
- 🔍 **Arama & Filtreleme** — Ürün adı ve kategori bazlı filtreleme
- ⚠️ **Düşük Stok Uyarısı** — Kritik seviyedeki ürünler otomatik işaretlenir
- 📄 **Sayfalama** — 10.000 ürün sayfalı olarak listelenir

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React.js, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Veritabanı | MongoDB Atlas, Mongoose |
| Veri | Kaggle — Global Product Inventory Dataset 2025 |
| Araçlar | Git, GitHub, Postman |

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- MongoDB Atlas hesabı

### Backend
```bash
cd server
npm install
```

`.env` dosyası oluştur:
```
PORT=5001
MONGO_URI=your_mongodb_connection_string
```
```bash
node server.js
```

### Frontend
```bash
cd client
npm install
npm start
```

## 📊 Veri Seti

[Global Product Inventory Dataset 2025](https://www.kaggle.com/datasets/keyushnisar/global-product-inventory-dataset-2025) — Kaggle

- 10.000 ürün kaydı
- Kategoriler: Electronics, Home Appliances, Clothing
- Sütunlar: Product Name, Category, Price, Stock Quantity, SKU

## 📁 Proje Yapısı
```
inventory-app/
├── client/          ← React frontend
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   └── Products.jsx
│       └── App.js
└── server/          ← Node.js backend
    ├── models/
    │   └── Product.js
    ├── routes/
    │   └── products.js
    └── server.js
```

## 👩‍💻 Geliştirici

**Ceren Tanrıseven**
[LinkedIn](https://linkedin.com/in/ceren-tanrıseven-231a711b7) · [GitHub](https://github.com/cereneteneresevene)