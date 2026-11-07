import React, { useEffect, useState, ChangeEvent } from 'react';
import { Customer, Order } from '../../types';
import './CustomerDetailModal.css';

interface CustomerDetailModalProps {
  customer: Customer;
  orders: Order[];
  onClose: () => void;
  onUpdate: (
    customerId: string,
    updatedData: Partial<Customer>
  ) => Promise<Customer | void>;
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

const getAmountNumber = (amount: number | string | undefined): number => {
  if (typeof amount === 'number') return amount;
  return Number(String(amount || '').replace(/[^\d]/g, '')) || 0;
};

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  orders,
  onClose,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Customer>({
    ...customer,
    address: customer.address || '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [displayCustomer, setDisplayCustomer] = useState<Customer>({
    ...customer,
    address: customer.address || '',
  });

  useEffect(() => {
    const normalizedCustomer = {
      ...customer,
      address: customer.address || '',
    };
    setDisplayCustomer(normalizedCustomer);
    setFormData(normalizedCustomer);
  }, [customer]);

  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
  const latestOrderTime = orders.reduce((latest, order) => {
    const orderTime = new Date(order.date).getTime();
    return Number.isNaN(orderTime) ? latest : Math.max(latest, orderTime);
  }, 0);
  const isCustomerActive =
    latestOrderTime > 0 && Date.now() - latestOrderTime <= THIRTY_DAYS_MS;
  const completedOrders = orders.filter(
    (order) => order.status === 'Selesai'
  );

  // Jumlahkan semua pesanan agar total transaksi cocok dengan tabel pelanggan.
  const totalSpent = orders.reduce(
    (sum, order) => sum + getAmountNumber(order.amount),
    0
  );

  const latestOrder =
    orders.length > 0
      ? orders.reduce((previous, current) =>
          new Date(previous.date) > new Date(current.date)
            ? previous
            : current
        )
      : null;

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const newValue =
      name === 'whatsapp' ? value.replace(/\D/g, '') : value;

    setFormData((previous) => ({ ...previous, [name]: newValue }));

    const errorKey = name as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors((previous) => ({ ...previous, [errorKey]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Alamat wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const savedCustomer = await onUpdate(customer.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        whatsapp: formData.whatsapp.trim(),
        address: formData.address.trim(),
      });

      const customerToDisplay = {
        ...formData,
        ...(savedCustomer || {}),
      };

      setDisplayCustomer(customerToDisplay);
      setFormData(customerToDisplay);
      setErrors({});
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      window.alert(`Gagal menyimpan perubahan: ${message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...displayCustomer });
    setErrors({});
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div
        className="modal-overlay"
        onClick={(event) =>
          event.target === event.currentTarget && handleCancel()
        }
      >
        <div className="modal-content modal-content--md">
          <div className="modal-header">
            <h2 className="modal-title">Edit Data Pelanggan</h2>
            <button
              className="modal-close"
              onClick={handleCancel}
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>

          <div className="edit-form">
            <div className="form-group">
              <label className="form-label">
                Nama Pelanggan <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                className={`form-input ${errors.name ? 'input-error' : ''}`}
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && (
                <span className="error-text">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Nomor WhatsApp <span className="required">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                name="whatsapp"
                className={`form-input ${
                  errors.whatsapp ? 'input-error' : ''
                }`}
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="Contoh: 08123456789"
              />
              {errors.whatsapp && (
                <span className="error-text">{errors.whatsapp}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Alamat Utama <span className="required">*</span>
              </label>
              <textarea
                name="address"
                className={`form-input form-textarea ${
                  errors.address ? 'input-error' : ''
                }`}
                rows={3}
                value={formData.address || ''}
                onChange={handleInputChange}
              />
              {errors.address && (
                <span className="error-text">{errors.address}</span>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal-overlay"
      onClick={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <div className="modal-content modal-content--lg">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{displayCustomer.name}</h2>
            <span
              className={`status-badge ${
                isCustomerActive ? 'status-active' : 'status-inactive'
              }`}
            >
              {isCustomerActive ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="modal-close"
              onClick={onClose}
              aria-label="Tutup"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Informasi Pelanggan</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{displayCustomer.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">WhatsApp</span>
              <span className="detail-value">{displayCustomer.whatsapp}</span>
            </div>
            <div className="detail-item full-width">
              <span className="detail-label">Alamat</span>
              <span className="detail-value">
                {displayCustomer.address || '-'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tanggal Registrasi</span>
              <span className="detail-value">{displayCustomer.regDate}</span>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Statistik Transaksi</h3>
          <div className="stats-row">
            <div className="mini-stat">
              <span className="mini-stat-value">{orders.length}</span>
              <span className="mini-stat-label">Total Pesanan</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">
                Rp {totalSpent.toLocaleString('id-ID')}
              </span>
              <span className="mini-stat-label">Total Transaksi</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">
                {completedOrders.length}
              </span>
              <span className="mini-stat-label">Transaksi Selesai</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">
                {latestOrder ? latestOrder.date : '-'}
              </span>
              <span className="mini-stat-label">Transaksi Terakhir</span>
            </div>
          </div>
        </div>

        {latestOrder ? (
          <div className="detail-section">
            <h3 className="section-title">Pesanan Terbaru</h3>
            <div className="latest-order-card">
              <div className="latest-order-info">
                <span className="order-id">{latestOrder.id}</span>
                <span className="order-date">{latestOrder.date}</span>
                <span className="order-service">
                  {latestOrder.service || 'Layanan'}
                </span>
                <span
                  className={`badge badge--${
                    latestOrder.status === 'Selesai' ? 'success' : 'info'
                  }`}
                >
                  {latestOrder.status}
                </span>
                <span className="order-amount">
                  Rp {getAmountNumber(latestOrder.amount).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            Pelanggan ini belum memiliki riwayat pesanan.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetailModal;
