const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlantısı başarılı!');
    app.listen(process.env.PORT, () => {
      console.log(`Server ${process.env.PORT} portunda çalışıyor`);
    });
  })
  .catch((err) => console.log('Bağlantı hatası:', err));