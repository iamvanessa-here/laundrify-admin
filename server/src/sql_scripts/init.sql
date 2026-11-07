CREATE TABLE IF NOT EXISTS test_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO test_logs DEFAULT VALUES;

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  description TEXT,
  is_available INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT REFERENCES customers(id),
  customer TEXT NOT NULL,
  service TEXT NOT NULL,
  order_date TEXT NOT NULL,
  status TEXT NOT NULL,
  amount INTEGER NOT NULL CHECK (amount >= 0),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  whatsapp TEXT NOT NULL UNIQUE,
  address TEXT,
  reg_date TEXT NOT NULL DEFAULT (date('now')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price REAL NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL DEFAULT 'kg',
  category TEXT NOT NULL,
  processing_time TEXT NOT NULL DEFAULT '2 hari',
  min_order REAL NOT NULL DEFAULT 0 CHECK (min_order >= 0),
  status TEXT NOT NULL DEFAULT 'Aktif'
    CHECK (status IN ('Aktif', 'Nonaktif')),
  is_popular INTEGER NOT NULL DEFAULT 0
    CHECK (is_popular IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO services
  (id, name, description, price, unit, category, processing_time, min_order, status, is_popular)
VALUES
  (1, 'Cuci Setrika', 'Pakaian dicuci bersih, dikeringkan, lalu disetrika rapi. Pilihan praktis untuk pakaian harian.', 8000, 'kg', 'Laundry kiloan', '2 hari', 3, 'Aktif', 1),
  (2, 'Cuci Lipat', 'Layanan cuci dan lipat standar untuk kebutuhan sehari-hari.', 6000, 'kg', 'Laundry kiloan', '2 hari', 3, 'Aktif', 0),
  (3, 'Setrika Saja', 'Hanya layanan setrika untuk pakaian yang sudah dicuci bersih.', 5000, 'kg', 'Laundry kiloan', '1 hari', 3, 'Aktif', 0),
  (4, 'Seprai', 'Cuci bersih seprai berbagai ukuran, wangi dan rapi.', 15000, 'lembar', 'Laundry satuan', '2 hari', 1, 'Aktif', 0),
  (5, 'Cuci Kilat', 'Layanan express selesai dalam 24 jam. Prioritas pengerjaan.', 14000, 'kg', 'Laundry express', '24 jam', 3, 'Aktif', 0);
