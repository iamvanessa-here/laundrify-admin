const orderModel = require('../models/orderModel');

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
    fail(res, 500, 'Server Error', error.message);
  }
};

const createOrder = async (req, res) => {
  try {
    const { customer, service, date, status, amount } = req.body;

    if (typeof customer !== 'string' || customer.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'customer wajib diisi');
    }

    if (typeof service !== 'string' || service.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'service wajib diisi');
    }

    if (typeof date !== 'string' || date.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'date wajib diisi');
    }

    const validStatuses = ['Menunggu', 'Dalam Proses', 'Selesai'];
    if (!validStatuses.includes(status)) {
      return fail(
        res,
        400,
        'Validasi gagal',
        'status harus Menunggu, Dalam Proses, atau Selesai'
      );
    }

    if (
      amount === undefined ||
      amount === null ||
      amount === '' ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) < 0
    ) {
      return fail(res, 400, 'Validasi gagal', 'amount harus angka minimal 0');
    }

    const order = await orderModel.createOrder(req.body);
    success(res, 201, 'Pesanan berhasil dibuat', order);
  } catch (error) {
    console.error('[createOrder]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllOrders,
  createOrder,
};