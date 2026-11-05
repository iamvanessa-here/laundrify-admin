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

const runSQL = (query) =>
  new Promise((resolve, reject) => {
    db.run(query, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const getAll = (query) =>
  new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const initializeDatabase = async () => {
  await runSQL(initSQL);

  const columns = await getAll('PRAGMA table_info(orders)');
  const hasWeightColumn = columns.some((column) => column.name === 'weight');

  if (!hasWeightColumn) {
    await runSQL(
      'ALTER TABLE orders ADD COLUMN weight REAL NOT NULL DEFAULT 0'
    );
    console.log('Kolom weight berhasil ditambahkan ke tabel orders');
  }
};

module.exports = { db, initializeDatabase };