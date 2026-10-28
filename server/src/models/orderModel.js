const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllOrders = async () => {
  return await dbAll(`
    SELECT id, customer, service, order_date AS date, status, amount
    FROM orders
    ORDER BY created_at DESC
  `);
};

const findOrderById = async (id) => {
  return await dbGet(
    `SELECT id, customer, service, order_date AS date, status, amount
     FROM orders
     WHERE id = ?`,
    [id]
  );
};

const createOrder = async (body) => {
  const id = `LND-${Date.now()}`;

  await dbRun(
    `INSERT INTO orders (id, customer, service, order_date, status, amount)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.customer.trim(),
      body.service.trim(),
      body.date,
      body.status,
      Number(body.amount),
    ]
  );

  return await findOrderById(id);
};

module.exports = {
  findAllOrders,
  findOrderById,
  createOrder,
};