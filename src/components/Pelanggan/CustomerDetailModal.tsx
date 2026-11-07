import React, { useState, useEffect, ChangeEvent } from 'react';
import { Customer, Order } from '../../types'; 
import './CustomerDetailModal.css';

interface CustomerDetailModalProps {
  customer: Customer;
  orders: Order[];
  onClose: () => void;
  onUpdate: (customerId: string, updatedData: Partial<Customer>) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({ 
  customer, 
  orders, 
  onClose, 
  onUpdate 
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<Customer>({ 
    id: customer.id,
    name: customer.name,
    email: customer.email,
    whatsapp: customer.whatsapp,
    address: customer.address || '', 
    regDate: customer.regDate 
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [displayCustomer, setDisplayCustomer] = useState<Customer>({ ...customer });

  useEffect(() => {
    setDisplayCustomer({ ...customer });
    setFormData({ ...customer, address: customer.address || '' });
  }, [customer]);

  const hasActiveOrder = orders.some(o => o.status === 'Dalam Proses');
  const completedOrders = orders.filter(o => o.status === 'Selesai');
  const totalSpent = completedOrders.reduce((sum, o) => sum + o.amount, 0);
  
  const latestOrder: Order | null = orders.length > 0 
    ? orders.reduce((prev, current) => (new Date(prev.date) > new Date(current.date)) ? prev : current) 
    : null;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'whatsapp' ? value.replace(/\D/g, '') : value;
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
    
    const errorKey = name as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name || formData.name.trim() === '') newErrors.name = 'Nama wajib diisi';
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.whatsapp || formData.whatsapp.trim() === '') newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    if (!formData.address || formData.address.trim() === '') newErrors.address = 'Alamat wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (): void => {
    if (validateForm()) {
      setIsSaving(true);
      setTimeout(() => {
        onUpdate(customer.id, formData);
        setDisplayCustomer({ ...formData });
        setIsSaving(false);
        setIsEditing(false);
      }, 600);
    }
  };

  const handleCancel = (): void => {
    setFormData({ ...displayCustomer, address: displayCustomer.address || '' });
    setErrors({});
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleCancel()}>
        <div className="modal-content modal-content--md">
          <div className="modal-header">
            <h2 className="modal-title">Edit Data Pelanggan</h2>
            <button className="modal-close" onClick={handleCancel} aria-label="Tutup">✕</button>
          </div>
          
          <div className="edit-form">
            <div className="form-group">
              <label className="form-label">Nama Pelanggan <span className="required">*</span></label>
              <input type="text" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`} value={formData.name} onChange={handleInputChange} />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email <span className="required">*</span></label>
              <input type="email" name="email" className={`form-input ${errors.email ? 'input-error' : ''}`} value={formData.email} onChange={handleInputChange} />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Nomor WhatsApp <span className="required">*</span></label>
              <input type="text" inputMode="numeric" name="whatsapp" className={`form-input ${errors.whatsapp ? 'input-error' : ''}`} value={formData.whatsapp} onChange={handleInputChange} placeholder="Contoh: 08123456789" />
              {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Alamat Utama <span className="required">*</span></label>
              <textarea name="address" className={`form-input form-textarea ${errors.address ? 'input-error' : ''}`} rows={3} value={formData.address || ''} onChange={handleInputChange} />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-secondary" onClick={handleCancel} disabled={isSaving}>Batal</button>
              <button type="button" className="btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- MODE VIEW (DEFAULT) ---
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content modal-content--lg">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{displayCustomer.name}</h2>
            <span className={`status-badge ${hasActiveOrder ? 'status-active' : 'status-inactive'}`}>
              {hasActiveOrder ? 'Aktif' : 'Tidak Aktif'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
            <button className="modal-close" onClick={onClose} aria-label="Tutup">✕</button>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Informasi Pelanggan</h3>
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Email</span><span className="detail-value">{displayCustomer.email}</span></div>
            <div className="detail-item"><span className="detail-label">WhatsApp</span><span className="detail-value">{displayCustomer.whatsapp}</span></div>
            <div className="detail-item full-width"><span className="detail-label">Alamat</span><span className="detail-value">{displayCustomer.address || '-'}</span></div>
            <div className="detail-item"><span className="detail-label">Tanggal Registrasi</span><span className="detail-value">{displayCustomer.regDate}</span></div>
          </div>
        </div>

        <div className="detail-section">
          <h3 className="section-title">Statistik Transaksi</h3>
          <div className="stats-row">
            <div className="mini-stat"><span className="mini-stat-value">{orders.length}</span><span className="mini-stat-label">Total Pesanan</span></div>
            <div className="mini-stat"><span className="mini-stat-value">Rp {totalSpent.toLocaleString('id-ID')}</span><span className="mini-stat-label">Total Transaksi</span></div>
            <div className="mini-stat"><span className="mini-stat-value">{completedOrders.length}</span><span className="mini-stat-label">Transaksi Selesai</span></div>
            <div className="mini-stat"><span className="mini-stat-value">{latestOrder ? latestOrder.date : '-'}</span><span className="mini-stat-label">Transaksi Terakhir</span></div>
          </div>
        </div>

        {latestOrder && (
          <div className="detail-section">
            <h3 className="section-title">Pesanan Terbaru</h3>
            <div className="latest-order-card">
              <div className="latest-order-info">
                <span className="order-id">{latestOrder.id}</span>
                <span className="order-date">{latestOrder.date}</span>
                <span className="order-service">{latestOrder.service || 'Layanan'}</span>
                <span className={`badge badge--${latestOrder.status === 'Selesai' ? 'success' : 'info'}`}>{latestOrder.status}</span>
                <span className="order-amount">Rp {latestOrder.amount.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}
        {!latestOrder && <div className="empty-state">Pelanggan ini belum memiliki riwayat pesanan.</div>}
      </div>
    </div>
  );
};

export default CustomerDetailModal;