import React, { useState } from 'react';
import './EditStatusModal.css';

const EditStatusModal = ({ order, onClose, onSave }) => {
  const [status, setStatus] = useState(order.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(order.id, status);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content--sm" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Ubah Status Pesanan</h2>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">ID Pesanan: <span className="order-id-highlight">{order.id}</span></label>
            <label className="form-label">Pelanggan: <span className="font-medium">{order.customer}</span></label>
          </div>
          
          <div className="form-group">
            <label className="form-label">Status Baru</label>
            <select 
              className="form-input" 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStatusModal;