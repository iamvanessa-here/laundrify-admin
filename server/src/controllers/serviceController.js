const serviceModel = require('../models/serviceModel');

const allowedStatuses = ['Aktif', 'Nonaktif'];

const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

const validateService = (body) => {
  if (typeof body.name !== 'string' || !body.name.trim()) {
    return 'Nama layanan wajib diisi';
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    return 'Harga harus berupa angka >= 0';
  }

  if (typeof body.unit !== 'string' || !body.unit.trim()) {
    return 'Satuan wajib diisi';
  }

  if (typeof body.category !== 'string' || !body.category.trim()) {
    return 'Kategori wajib diisi';
  }

  if (
    typeof body.processingTime !== 'string' ||
    !body.processingTime.trim()
  ) {
    return 'Waktu pengerjaan wajib diisi';
  }

  const minOrder = Number(body.minOrder ?? 0);
  if (!Number.isFinite(minOrder) || minOrder < 0) {
    return 'Minimum pesanan harus berupa angka >= 0';
  }

  if (!allowedStatuses.includes(body.status)) {
    return 'Status harus Aktif atau Nonaktif';
  }

  return null;
};

const getAllServices = async (req, res) => {
  try {
    const services = await serviceModel.findAllServices();
    success(res, 200, 'Berhasil mengambil semua layanan', services);
  } catch (error) {
    console.error('[getAllServices]', error);
    fail(res, 500, 'Server Error');
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await serviceModel.findServiceById(req.params.id);

    if (!service) {
      return fail(res, 404, 'Layanan tidak ditemukan');
    }

    success(res, 200, 'Berhasil mengambil layanan', service);
  } catch (error) {
    console.error('[getServiceById]', error);
    fail(res, 500, 'Server Error');
  }
};

const createService = async (req, res) => {
  try {
    const body = req.body || {};
    const validationError = validateService(body);

    if (validationError) {
      return fail(res, 400, 'Validasi gagal', validationError);
    }

    const service = await serviceModel.createService(body);
    success(res, 201, 'Layanan berhasil dibuat', service);
  } catch (error) {
    console.error('[createService]', error);

    if (error.code === 'SQLITE_CONSTRAINT') {
      return fail(res, 409, 'Nama layanan sudah digunakan');
    }

    fail(res, 500, 'Server Error');
  }
};

const updateService = async (req, res) => {
  try {
    const body = req.body || {};
    const validationError = validateService(body);

    if (validationError) {
      return fail(res, 400, 'Validasi gagal', validationError);
    }

    const service = await serviceModel.updateService(req.params.id, body);

    if (!service) {
      return fail(res, 404, 'Layanan tidak ditemukan');
    }

    success(res, 200, 'Layanan berhasil diperbarui', service);
  } catch (error) {
    console.error('[updateService]', error);

    if (error.code === 'SQLITE_CONSTRAINT') {
      return fail(res, 409, 'Nama layanan sudah digunakan');
    }

    fail(res, 500, 'Server Error');
  }
};

const deleteService = async (req, res) => {
  try {
    const deleted = await serviceModel.deleteService(req.params.id);

    if (!deleted) {
      return fail(res, 404, 'Layanan tidak ditemukan');
    }

    success(res, 200, 'Layanan berhasil dihapus');
  } catch (error) {
    console.error('[deleteService]', error);
    fail(res, 500, 'Server Error');
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};