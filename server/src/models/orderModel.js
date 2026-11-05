const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllOrders = async () => {
  return await dbAll(`
    SELECT id, customer, service, order_date AS date, status, amount, weight
    FROM orders
    ORDER BY created_at DESC
  `);
};

const findOrderById = async (id) => {
  return await dbGet(
    `SELECT id, customer, service, order_date AS date, status, amount, weight
     FROM orders
     WHERE id = ?`,
    [id]
  );
};

const createOrder = async (body) => {
  const id = `LND-${Date.now()}`;

  await dbRun(
    `INSERT INTO orders
      (id, customer, service, order_date, status, amount, weight)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.customer.trim(),
      body.service.trim(),
      body.date,
      body.status,
      Number(body.amount),
      Number(body.weight) || 0,
    ]
  );

  return await findOrderById(id);
};

const updateOrderStatus = async (id, status) => {
  const existing = await findOrderById(id);
  if (!existing) return null;

  await dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  return await findOrderById(id);
};

module.exports = {
  findAllOrders,
  findOrderById,
  createOrder,
  updateOrderStatus,
};