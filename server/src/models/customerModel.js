const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllCustomers = async () => {
  return await dbAll(`
    SELECT
      id,
      name,
      email,
      whatsapp,
      address,
      reg_date AS regDate
    FROM customers
    ORDER BY reg_date DESC, id DESC
  `);
};

const createCustomer = async (body) => {
  const id = `CUST-${Date.now()}`;

  await dbRun(
    `INSERT INTO customers (id, name, email, whatsapp, address)
     VALUES (?, ?, ?, ?, ?)`,
    [
      id,
      body.name.trim(),
      body.email.trim().toLowerCase(),
      body.whatsapp.trim(),
      body.address?.trim() || null,
    ]
  );

  return await dbGet(
    `SELECT
       id,
       name,
       email,
       whatsapp,
       address,
       reg_date AS regDate
     FROM customers
     WHERE id = ?`,
    [id]
  );
};

module.exports = {
  findAllCustomers,
  createCustomer,
};