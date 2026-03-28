const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

const Product = require('./models/Product');

const results = [];

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlandı, veri yükleniyor...');

    fs.createReadStream('/Users/cereneteneresevene/Downloads/products.csv')
      .pipe(csv())
      .on('data', (row) => {
        results.push({
          name: row['Product Name'],
          category: row['Product Category'],
          price: parseFloat(row['Price']) || 0,
          stock: parseInt(row['Stock Quantity']) || 0,
          lowStockThreshold: 10,
          supplier: row['SKU'] || ''
        });
      })
      .on('end', async () => {
        try {
          await Product.deleteMany({});
          await Product.insertMany(results);
          console.log(`${results.length} ürün başarıyla yüklendi!`);
          mongoose.connection.close();
        } catch (err) {
          console.log('Hata:', err);
        }
      });
  })
  .catch((err) => console.log('Bağlantı hatası:', err));