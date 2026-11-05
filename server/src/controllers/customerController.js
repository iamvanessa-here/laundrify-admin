const customerModel = require('../models/customerModel');

const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

const getAllCustomers = async (req, res) => {
  try {
    const customers = await customerModel.findAllCustomers();
    success(res, 200, 'Berhasil mengambil semua pelanggan', customers);
  } catch (error) {
    console.error('[getAllCustomers]', error);
    fail(res, 500, 'Server Error');
  }
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, whatsapp, address } = req.body || {};

    if (typeof name !== 'string' || !name.trim()) {
      return fail(res, 400, 'Validasi gagal', 'Nama wajib diisi');
    }

    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return fail(res, 400, 'Validasi gagal', 'Format email tidak valid');
    }

    if (typeof whatsapp !== 'string' || !whatsapp.trim()) {
      return fail(res, 400, 'Validasi gagal', 'Nomor WhatsApp wajib diisi');
    }

    const customer = await customerModel.createCustomer({
      name,
      email,
      whatsapp,
      address,
    });

    success(res, 201, 'Pelanggan berhasil dibuat', customer);
  } catch (error) {
    console.error('[createCustomer]', error);

    if (error.code === 'SQLITE_CONSTRAINT') {
      return fail(res, 409, 'Email atau WhatsApp sudah terdaftar');
    }

    fail(res, 500, 'Server Error');
  }
};

module.exports = {
  getAllCustomers,
  createCustomer,
};