const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database.sqlite');
const initSQL = fs.readFileSync(
  path.join(__dirname, '../sql_scripts/init.sql'),
  'utf8'
);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Gagal konek SQLite:', err.message);
    process.exit(1);
  }

  console.log('Terhubung ke SQLite:', dbPath);
});

const execSQL = (sql) =>
  new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const runSQL = (sql) =>
  new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const getAll = (sql) =>
  new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const initializeDatabase = async () => {
  await runSQL('PRAGMA foreign_keys = ON');

  // Jalankan semua perintah dalam init.sql.
  await execSQL(initSQL);

  // Tambahkan kolom berat untuk database lama, jika belum tersedia.
  const orderColumns = await getAll('PRAGMA table_info(orders)');
  const hasWeightColumn = orderColumns.some(
    (column) => column.name === 'weight'
  );

  if (!hasWeightColumn) {
    await runSQL(
      'ALTER TABLE orders ADD COLUMN weight REAL NOT NULL DEFAULT 0'
    );
    console.log('Kolom weight berhasil ditambahkan ke tabel orders');
  }

  const hasCustomerIdColumn = orderColumns.some(
    (column) => column.name === 'customer_id'
  );

  if (!hasCustomerIdColumn) {
    await runSQL(
      'ALTER TABLE orders ADD COLUMN customer_id TEXT REFERENCES customers(id)'
    );
    console.log('Kolom customer_id berhasil ditambahkan ke tabel orders');
  }

  // Hubungkan data lama hanya jika nama itu cocok dengan tepat satu pelanggan.
  await runSQL(`
    UPDATE orders
    SET customer_id = (
      SELECT customers.id
      FROM customers
      WHERE customers.name = orders.customer COLLATE NOCASE
      LIMIT 1
    )
    WHERE customer_id IS NULL
      AND (
        SELECT COUNT(*)
        FROM customers
        WHERE customers.name = orders.customer COLLATE NOCASE
      ) = 1
  `);
};

module.exports = { db, initializeDatabase };
