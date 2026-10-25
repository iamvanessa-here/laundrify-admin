import React, { useState } from 'react';
import './OrderModal.css';

const OrderModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    customer: '',
    service: 'Cuci Reguler',
    weight: '',
    status: 'Menunggu',
    amount: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `LND-0${Math.floor(Math.random() * 900) + 100}`;
    const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedAmount = formData.amount ? `Rp ${parseInt(formData.amount).toLocaleString('id-ID')}` : 'Rp 0';

    onAdd({
      id: newId,
      customer: formData.customer,
      service: formData.service,
      weight: `${formData.weight} kg`,
      date: today,
      status: formData.status,
      amount: formattedAmount
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tambah Pesanan Baru</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Pelanggan</label>
            <input type="text" name="customer" className="form-input" placeholder="Masukkan nama pelanggan" value={formData.customer} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Jenis Layanan</label>
              <select name="service" className="form-input" value={formData.service} onChange={handleChange}>
                <option>Cuci Reguler</option>
                <option>Cuci Express</option>
                <option>Dry Clean</option>
                <option>Cuci Setrika</option>
                <option>Cuci Selimut</option>
              </select>
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Berat (kg)</label>
              <input type="number" name="weight" className="form-input" placeholder="0" value={formData.weight} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                <option>Menunggu</option>
                <option>Dalam Proses</option>
                <option>Selesai</option>
              </select>
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Total Harga (Rp)</label>
              <input type="number" name="amount" className="form-input" placeholder="45000" value={formData.amount} onChange={handleChange} required />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Pesanan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;