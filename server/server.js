require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');
const testRoutes = require('./src/routes/test');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const customerRoutes = require('./src/routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Product API is running',
    endpoints: {
      'GET    /api/products': 'Ambil semua produk',
      'GET    /api/products/:id': 'Ambil produk by id',
      'POST   /api/products': 'Buat produk baru',
      'PUT    /api/products/:id': 'Update produk',
      'DELETE /api/products/:id': 'Hapus produk',
      'GET    /api/orders': 'Ambil semua pesanan',
      'POST   /api/orders': 'Buat pesanan baru',
      'GET    /api/customers': 'Ambil semua pelanggan',
      'POST   /api/customers': 'Buat pelanggan baru',
    },
  });
});

/* Routes */
app.use('/api/test', testRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

/* Start */
(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menginisialisasi database:', error);
    process.exit(1);
  }
})();