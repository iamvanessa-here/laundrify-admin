import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import './Layanan.css';

const API_URL = 'http://localhost:3001/api/services';

const formatRupiah = (amount) =>
  `Rp ${Number(amount || 0).toLocaleString('id-ID')}`;

const parseTimeToDays = (timeStr = '') => {
  if (timeStr.includes('24 jam')) return 1;
  return Number.parseInt(timeStr.match(/\d+/)?.[0] || '0', 10);
};

const Layanan = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Semua kategori');
  const [filterStatus, setFilterStatus] = useState('Semua status');

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: 'kg',
    category: 'Laundry kiloan',
    processingTime: '2 hari',
    minOrder: '',
    status: 'Aktif',
  });

  const [toast, setToast] = useState(null);
  const [lastModified, setLastModified] = useState('Belum ada perubahan');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Gagal memuat layanan');
        }

        setServices(result.data || []);
      } catch (error) {
        setToast({ type: 'error', message: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const stats = useMemo(() => {
    const activeServices = services.filter(
      (service) => service.status === 'Aktif'
    );
    const activeCount = activeServices.length;
    const popularService =
      services.find((service) => service.isPopular)?.name || 'Belum ada';

    const totalDays = activeServices.reduce(
      (sum, service) => sum + parseTimeToDays(service.processingTime),
      0
    );
    const avgTime =
      activeCount > 0 ? (totalDays / activeCount).toFixed(1) : 0;
    const avgTimeDisplay =
      Number(avgTime) === 1 ? '1 hari' : `${avgTime} hari`;

    return { activeCount, popularService, avgTimeDisplay };
  }, [services]);

  const filteredServices = services.filter((service) => {
    const matchCategory =
      filterCategory === 'Semua kategori' ||
      service.category === filterCategory;
    const matchStatus =
      filterStatus === 'Semua status' || service.status === filterStatus;

    return matchCategory && matchStatus;
  });

  const handleSelect = (service) => {
    setSelectedId(service.id);
    setIsEditing(true);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      unit: service.unit,
      category: service.category,
      processingTime: service.processingTime,
      minOrder: service.minOrder,
      status: service.status,
    });
  };

  const handleAddNew = () => {
    setSelectedId(null);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      category: 'Laundry kiloan',
      processingTime: '2 hari',
      minOrder: '',
      status: 'Aktif',
    });
  };

  const handleCancel = () => {
    setSelectedId(null);
    setIsEditing(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: 'kg',
      category: 'Laundry kiloan',
      processingTime: '2 hari',
      minOrder: '',
      status: 'Aktif',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const price = Number(formData.price);
    const minOrder = Number(formData.minOrder || 0);

    if (!formData.name.trim() || formData.price === '') {
      setToast({
        type: 'error',
        message: 'Nama layanan dan Harga wajib diisi!',
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setToast({
        type: 'error',
        message: 'Harga harus berupa angka 0 atau lebih.',
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    if (!Number.isFinite(minOrder) || minOrder < 0) {
      setToast({
        type: 'error',
        message: 'Minimum pesanan harus berupa angka 0 atau lebih.',
      });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const selectedService = services.find(
      (service) => service.id === selectedId
    );

    const payload = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      minOrder,
      isPopular: selectedService?.isPopular || false,
    };

    const isUpdating = isEditing && selectedId;
    const url = isUpdating ? `${API_URL}/${selectedId}` : API_URL;

    try {
      const response = await fetch(url, {
        method: isUpdating ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || result.message || 'Gagal menyimpan layanan'
        );
      }

      if (isUpdating) {
        setServices((currentServices) =>
          currentServices.map((service) =>
            service.id === result.data.id ? result.data : service
          )
        );
      } else {
        setServices((currentServices) => [...currentServices, result.data]);
      }

      const now = new Date();
      const timeString = now.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      setLastModified(`Admin · ${timeString}`);
      setToast({
        type: 'success',
        message: isUpdating
          ? 'Layanan berhasil diperbarui!'
          : 'Layanan baru berhasil ditambahkan!',
      });

      setTimeout(() => setToast(null), 3000);
      handleCancel();
    } catch (error) {
      setToast({ type: 'error', message: error.message });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const categories = [
    'Semua kategori',
    'Laundry kiloan',
    'Laundry satuan',
    'Laundry express',
  ];
  const statuses = ['Semua status', 'Aktif', 'Nonaktif'];

  return (
    <div className="layanan-page">
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.message}
        </div>
      )}

      <div className="summary-banner">
        <div className="summary-item">
          <span className="summary-value">{stats.activeCount}</span>
          <span className="summary-label">layanan aktif</span>
        </div>
        <span className="summary-separator">•</span>
        <div className="summary-item">
          <span className="summary-value">{stats.popularService}</span>
          <span className="summary-label">paling populer</span>
        </div>
        <span className="summary-separator">•</span>
        <div className="summary-item">
          <span className="summary-value">{stats.avgTimeDisplay}</span>
          <span className="summary-label">rata-rata pengerjaan</span>
        </div>
      </div>

      <Card className="table-container" padding="md">
        <div className="table-header-actions">
          <div className="filters">
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(event) => setFilterCategory(event.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <button className="btn-primary" onClick={handleAddNew}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 3V13M3 8H13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Tambah layanan
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Layanan</th>
                <th>Harga / Satuan</th>
                <th>Pengerjaan / Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="empty-row">
                    Memuat layanan...
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className={
                      selectedId === service.id ? 'row-selected' : ''
                    }
                    onClick={() => handleSelect(service)}
                  >
                    <td>
                      <div className="service-name">{service.name}</div>
                      <div className="service-desc">
                        {service.description}
                      </div>
                    </td>
                    <td>
                      <div className="price-text">
                        {formatRupiah(service.price)} / {service.unit}
                      </div>
                      <div className="min-order-text">
                        Min. {service.minOrder} {service.unit}
                      </div>
                    </td>
                    <td>
                      <div className="processing-time">
                        {service.processingTime}
                      </div>
                      <div
                        className={`status-badge ${
                          service.status === 'Aktif'
                            ? 'status-active'
                            : 'status-inactive'
                        }`}
                      >
                        <span className="status-dot"></span>
                        {service.status}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-text-action"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSelect(service);
                        }}
                      >
                        Ubah layanan →
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {!isLoading && filteredServices.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-row">
                    Tidak ada layanan yang sesuai dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="form-container" padding="lg">
        <div className="form-header">
          <h3 className="form-title">
            {isEditing
              ? `Ubah layanan · ${formData.name || 'Baru'}`
              : 'Tambah layanan'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">
                Nama layanan <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Cuci Setrika"
                value={formData.name}
                onChange={(event) =>
                  setFormData({ ...formData, name: event.target.value })
                }
                required
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Deskripsi</label>
              <textarea
                className="form-input form-textarea"
                rows="3"
                placeholder="Deskripsikan layanan ini..."
                value={formData.description}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    description: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Harga (Rp) <span className="required">*</span>
              </label>
              <input
                type="number"
                className="form-input"
                placeholder="8000"
                min="0"
                value={formData.price}
                onChange={(event) =>
                  setFormData({ ...formData, price: event.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Satuan</label>
              <select
                className="form-input"
                value={formData.unit}
                onChange={(event) =>
                  setFormData({ ...formData, unit: event.target.value })
                }
              >
                <option value="kg">kg</option>
                <option value="lembar">lembar</option>
                <option value="pasang">pasang</option>
                <option value="item">item</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={(event) =>
                  setFormData({ ...formData, category: event.target.value })
                }
              >
                <option value="Laundry kiloan">Laundry kiloan</option>
                <option value="Laundry satuan">Laundry satuan</option>
                <option value="Laundry express">Laundry express</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Waktu pengerjaan</label>
              <select
                className="form-input"
                value={formData.processingTime}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    processingTime: event.target.value,
                  })
                }
              >
                <option value="24 jam">24 jam</option>
                <option value="1 hari">1 hari</option>
                <option value="2 hari">2 hari</option>
                <option value="3 hari">3 hari</option>
                <option value="4 hari">4 hari</option>
                <option value="5 hari">5 hari</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum pesanan</label>
              <input
                type="number"
                className="form-input"
                placeholder="3"
                min="0"
                value={formData.minOrder}
                onChange={(event) =>
                  setFormData({ ...formData, minOrder: event.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status layanan</label>
              <label className="toggle-container">
                <input
                  type="checkbox"
                  checked={formData.status === 'Aktif'}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      status: event.target.checked ? 'Aktif' : 'Nonaktif',
                    })
                  }
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">
                  {formData.status === 'Aktif'
                    ? 'Aktif · Tampilkan di situs pelanggan'
                    : 'Nonaktif · Sembunyikan dari situs'}
                </span>
              </label>
            </div>
          </div>

          <div className="form-footer">
            <div className="last-modified">
              Terakhir diubah: {lastModified}
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
              >
                Batalkan
              </button>
              <button type="submit" className="btn-primary">
                Simpan layanan
              </button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Layanan;