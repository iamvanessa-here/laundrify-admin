const orderModel = require('../models/orderModel');

const allowedStatuses = [
  'Menunggu',
  'Dalam Proses',
  'Selesai',
  'Dibatalkan',
];

const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAllOrders();
    success(res, 200, 'Berhasil mengambil semua pesanan', orders);
  } catch (error) {
    console.error('[getAllOrders]', error);
    fail(res, 500, 'Server Error');
  }
};

const createOrder = async (req, res) => {
  try {
    const { customerId, customer, service, date, status, amount, weight } = req.body || {};
    const parsedAmount = Number(amount);
    const parsedWeight = Number.parseFloat(String(weight ?? 0));

    if (typeof customerId !== 'string' || !customerId.trim()) {
      return fail(res, 400, 'Validasi gagal', 'Pilih pelanggan yang terdaftar');
    }

    const registeredCustomer = await orderModel.findCustomerById(customerId.trim());

    if (!registeredCustomer) {
      return fail(
        res,
        400,
        'Validasi gagal',
        'Pelanggan harus terdaftar sebelum membuat pesanan'
      );
    }

    if (typeof customer !== 'string' || customer.trim() !== registeredCustomer.name) {
      return fail(res, 400, 'Validasi gagal', 'Data pelanggan tidak cocok');
    }

    if (typeof service !== 'string' || !service.trim()) {
      return fail(res, 400, 'Validasi gagal', 'Layanan wajib diisi');
    }

    if (!date) {
      return fail(res, 400, 'Validasi gagal', 'Tanggal wajib diisi');
    }

    if (!allowedStatuses.includes(status)) {
      return fail(res, 400, 'Validasi gagal', 'Status pesanan tidak valid');
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
      return fail(res, 400, 'Validasi gagal', 'Jumlah harus angka >= 0');
    }

    if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
      return fail(res, 400, 'Validasi gagal', 'Berat harus angka >= 0');
    }

    const order = await orderModel.createOrder({
      customerId: registeredCustomer.id,
      customer: registeredCustomer.name,
      service,
      date,
      status,
      amount: parsedAmount,
      weight: parsedWeight,
    });

    success(res, 201, 'Pesanan berhasil dibuat', order);
  } catch (error) {
    console.error('[createOrder]', error);
    fail(res, 500, 'Server Error');
  }
};

const deleteOrder = async (req, res) => {
  try {
    const deleted = await orderModel.deleteOrder(req.params.id);

    if (!deleted) {
      return fail(res, 404, 'Pesanan tidak ditemukan');
    }

    success(res, 200, 'Pesanan berhasil dihapus');
  } catch (error) {
    console.error('[deleteOrder]', error);
    fail(res, 500, 'Server Error');
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body || {};

    if (!allowedStatuses.includes(status)) {
      return fail(res, 400, 'Validasi gagal', 'Status pesanan tidak valid');
    }

    const order = await orderModel.updateOrderStatus(req.params.id, status);

    if (!order) {
      return fail(res, 404, 'Pesanan tidak ditemukan');
    }

    success(res, 200, 'Status pesanan berhasil diperbarui', order);
  } catch (error) {
    console.error('[updateOrderStatus]', error);
    fail(res, 500, 'Server Error');
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
