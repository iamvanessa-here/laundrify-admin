const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/sqlite3_helpers');

const mapService = (service) => {
  if (!service) return null;

  return {
    ...service,
    isPopular: Boolean(service.isPopular),
  };
};

const findAllServices = async () => {
  const services = await dbAll(`
    SELECT
      id,
      name,
      description,
      price,
      unit,
      category,
      processing_time AS processingTime,
      min_order AS minOrder,
      status,
      is_popular AS isPopular
    FROM services
    ORDER BY id ASC
  `);

  return services.map(mapService);
};

const findServiceById = async (id) => {
  const service = await dbGet(
    `SELECT
       id,
       name,
       description,
       price,
       unit,
       category,
       processing_time AS processingTime,
       min_order AS minOrder,
       status,
       is_popular AS isPopular
     FROM services
     WHERE id = ?`,
    [id]
  );

  return mapService(service);
};

const createService = async (body) => {
  const result = await dbRun(
    `INSERT INTO services
      (name, description, price, unit, category, processing_time, min_order, status, is_popular)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      body.name.trim(),
      body.description?.trim() || '',
      Number(body.price),
      body.unit,
      body.category,
      body.processingTime,
      Number(body.minOrder) || 0,
      body.status,
      body.isPopular ? 1 : 0,
    ]
  );

  return findServiceById(result.lastID);
};

const updateService = async (id, body) => {
  const existing = await findServiceById(id);
  if (!existing) return null;

  await dbRun(
    `UPDATE services
     SET name = ?,
         description = ?,
         price = ?,
         unit = ?,
         category = ?,
         processing_time = ?,
         min_order = ?,
         status = ?,
         is_popular = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      body.name?.trim() ?? existing.name,
      body.description?.trim() ?? existing.description,
      body.price !== undefined ? Number(body.price) : existing.price,
      body.unit ?? existing.unit,
      body.category ?? existing.category,
      body.processingTime ?? existing.processingTime,
      body.minOrder !== undefined
        ? Number(body.minOrder)
        : existing.minOrder,
      body.status ?? existing.status,
      body.isPopular !== undefined
        ? (body.isPopular ? 1 : 0)
        : (existing.isPopular ? 1 : 0),
      id,
    ]
  );

  return findServiceById(id);
};

const deleteService = async (id) => {
  const result = await dbRun('DELETE FROM services WHERE id = ?', [id]);
  return result.changes > 0;
};

module.exports = {
  findAllServices,
  findServiceById,
  createService,
  updateService,
  deleteService,
};