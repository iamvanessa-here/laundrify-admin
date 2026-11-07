const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllCustomers = async () => {
  return await dbAll(`
    SELECT id, name, email, whatsapp, address, reg_date AS regDate
    FROM customers
    ORDER BY reg_date DESC, id DESC
  `);
};

const findCustomerById = async (id) => {
  return await dbGet(
    `SELECT id, name, email, whatsapp, address, reg_date AS regDate
     FROM customers
     WHERE id = ?`,
    [id]
  );
};

const findCustomerByName = async (name) => {
  return await dbGet(
    `SELECT id, name, email, whatsapp, address, reg_date AS regDate
     FROM customers
     WHERE name = ? COLLATE NOCASE
     LIMIT 1`,
    [name.trim()]
  );
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

  return findCustomerById(id);
};

const updateCustomer = async (id, body) => {
  const existing = await findCustomerById(id);
  if (!existing) return null;

  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  const whatsapp = body.whatsapp.trim();
  const address = body.address?.trim() || null;

  await dbRun('BEGIN TRANSACTION');

  try {
    await dbRun(
      `UPDATE customers
       SET name = ?, email = ?, whatsapp = ?, address = ?
       WHERE id = ?`,
      [name, email, whatsapp, address, id]
    );

    if (existing.name !== name) {
      await dbRun(
        `UPDATE orders
         SET customer = ?
         WHERE customer_id = ?`,
        [name, id]
      );
    }

    await dbRun('COMMIT');
  } catch (error) {
    await dbRun('ROLLBACK');
    throw error;
  }

  return findCustomerById(id);
};

module.exports = {
  findAllCustomers,
  findCustomerById,
  findCustomerByName,
  createCustomer,
  updateCustomer,
};
