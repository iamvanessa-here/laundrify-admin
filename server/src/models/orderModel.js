const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const findAllOrders = async () => {
  return await dbAll(`
    SELECT orders.id, orders.customer_id AS customerId,
           COALESCE(customers.name, orders.customer) AS customer,
           orders.service, orders.order_date AS date, orders.status,
           orders.amount, orders.weight
    FROM orders
    LEFT JOIN customers ON customers.id = orders.customer_id
    ORDER BY orders.created_at DESC
  `);
};

const findOrderById = async (id) => {
  return await dbGet(
    `SELECT orders.id, orders.customer_id AS customerId,
            COALESCE(customers.name, orders.customer) AS customer,
            orders.service, orders.order_date AS date, orders.status,
            orders.amount, orders.weight
     FROM orders
     LEFT JOIN customers ON customers.id = orders.customer_id
     WHERE orders.id = ?`,
    [id]
  );
};

const findCustomerById = async (id) => {
  return await dbGet(
    `SELECT id, name
     FROM customers
     WHERE id = ?`,
    [id]
  );
};

const createOrder = async (body) => {
  const id = `LND-${Date.now()}`;

  await dbRun(
    `INSERT INTO orders
      (id, customer_id, customer, service, order_date, status, amount, weight)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      body.customerId,
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

const deleteOrder = async (id) => {
  const result = await dbRun('DELETE FROM orders WHERE id = ?', [id]);
  return result.changes > 0;
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
  findCustomerById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
