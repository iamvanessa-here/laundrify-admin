require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/database');

const { requireAuth } = require('./src/middlewares_helpers/authMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const testRoutes = require('./src/routes/test');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Laundrify API is running',
    endpoints: {
      'POST   /api/auth/login': 'Login dengan username dan password',
      'POST   /api/auth/logout': 'Logout dengan Bearer token',

      'GET    /api/products': 'Ambil semua produk',
      'GET    /api/products/:id': 'Ambil produk berdasarkan ID',
      'POST   /api/products': 'Buat produk baru',
      'POST   /api/products/bulk': 'Buat beberapa produk',
      'PUT    /api/products/:id': 'Update produk',
      'DELETE /api/products/:id': 'Hapus produk',

      'GET    /api/orders': 'Ambil semua pesanan',
      'POST   /api/orders': 'Buat pesanan baru',
      'PUT    /api/orders/:id': 'Update status pesanan',
      'DELETE /api/orders/:id': 'Hapus pesanan',

      'GET    /api/customers': 'Ambil semua pelanggan',
      'POST   /api/customers': 'Buat pelanggan baru',
      'PUT    /api/customers/:id': 'Update data pelanggan',

      'GET    /api/services': 'Ambil semua layanan',
      'GET    /api/services/:id': 'Ambil layanan berdasarkan ID',
      'POST   /api/services': 'Buat layanan baru',
      'PUT    /api/services/:id': 'Update layanan',
      'DELETE /api/services/:id': 'Hapus layanan',
    },
  });
});

/* Routes publik */
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);

/* Routes yang memerlukan token login */
app.use('/api/products', requireAuth, productRoutes);
app.use('/api/orders', requireAuth, orderRoutes);
app.use('/api/customers', requireAuth, customerRoutes);
app.use('/api/services', requireAuth, serviceRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
});

/* Start server */
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