import React, { useState } from 'react';
import './OrderModal.css';

interface ServicePrice {
  price: number;
  unit: 'kg' | 'lembar';
  minOrder: number;
}

interface ServicePrices {
  [key: string]: ServicePrice;
}

const SERVICE_PRICES: ServicePrices = {
  'Cuci Setrika': { price: 8000, unit: 'kg', minOrder: 3 },
  'Cuci Lipat': { price: 6000, unit: 'kg', minOrder: 3 },
  'Setrika Saja': { price: 5000, unit: 'kg', minOrder: 3 },
  'Seprai': { price: 15000, unit: 'lembar', minOrder: 1 },
  'Cuci Kilat': { price: 14000, unit: 'kg', minOrder: 3 },
};

const formatRupiah = (amount: number): string => `Rp ${amount.toLocaleString('id-ID')}`;

interface FormData {
  customer: string;
  service: string;
  quantity: string;
  status: string;
}

interface Errors {
  customer?: string;
  quantity?: string;
}

interface NewOrder {
  id: string;
  customer: string;
  service: string;
  weight: string;
  date: string;
  status: string;
  amount: string;
}

interface OrderModalProps {
  onClose: () => void;
  onAdd: (order: NewOrder) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState<FormData>({
    customer: '',
    service: 'Cuci Setrika',
    quantity: '',
    status: 'Menunggu', 
  });
  const [errors, setErrors] = useState<Errors>({});

  const serviceInfo = SERVICE_PRICES[formData.service];
  const unit = serviceInfo ? serviceInfo.unit : 'kg';
  const pricePerUnit = serviceInfo ? serviceInfo.price : 0;
  const minOrder = serviceInfo ? serviceInfo.minOrder : 1;

  const quantityNum = parseFloat(formData.quantity);
  const isValidNumber = !isNaN(quantityNum) && quantityNum > 0;
  const totalPrice = isValidNumber ? quantityNum * pricePerUnit : 0;

  const isQuantityValid = isValidNumber && quantityNum >= minOrder;
  
  const isCustomerValid = formData.customer.trim().length > 0;
  const isFormValid = isCustomerValid && isQuantityValid;

  const minOrderMessage = unit === 'kg' 
    ? `Minimal ${minOrder} kg` 
    : `Minimal ${minOrder} lembar`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'customer' || name === 'quantity') {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Errors = {};
    
    // Validasi nama pelanggan
    if (!formData.customer || formData.customer.trim() === '') {
      newErrors.customer = 'Nama pelanggan wajib diisi';
    }
    
    // Validasi quantity
    if (!formData.quantity || !isValidNumber) {
      newErrors.quantity = 'Jumlah pesanan wajib diisi';
    } else if (!isQuantityValid) {
      newErrors.quantity = minOrderMessage;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

    onAdd({
      id: `LND-${Math.floor(Math.random() * 9000) + 1000}`,
      customer: formData.customer.trim(),
      service: formData.service,
      weight: `${quantityNum} ${unit}`,
      date: today,
      status: formData.status,
      amount: formatRupiah(totalPrice),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tambah Pesanan Baru</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Nama Pelanggan */}
          <div className="form-group">
            <label className="form-label">Nama Pelanggan</label>
            <input
              type="text"
              name="customer"
              className={`form-input ${errors.customer ? 'input-error' : ''}`}
              placeholder="Masukkan nama pelanggan"
              value={formData.customer}
              onChange={handleChange}
            />
            {errors.customer && <span className="error-text">{errors.customer}</span>}
          </div>

          {/* Jenis Layanan */}
          <div className="form-group">
            <label className="form-label">Jenis Layanan</label>
            <select
              name="service"
              className="form-input"
              value={formData.service}
              onChange={handleChange}
            >
              {Object.keys(SERVICE_PRICES).map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
            <div className="service-info">
              Tarif: <strong>{formatRupiah(pricePerUnit)}</strong> per {unit}
              <span className="service-info__min"> • Min. {minOrder} {unit}</span>
            </div>
          </div>

          {/* Berat / Jumlah */}
          <div className="form-group">
            <label className="form-label">
              {unit === 'kg' ? 'Berat (kg)' : 'Jumlah Lembar'}
            </label>
            <input
              type="number"
              name="quantity"
              className={`form-input ${errors.quantity ? 'input-error' : ''}`}
              placeholder={`Masukkan ${unit === 'kg' ? 'berat dalam kg' : 'jumlah lembar'}`}
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
            {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            {!errors.quantity && formData.quantity && !isQuantityValid && (
              <span className="error-text">{minOrderMessage}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-input"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Menunggu">Menunggu</option>
              <option value="Dalam Proses">Dalam Proses</option>
            </select>
          </div>

          <div className="price-summary">
            <div className="price-summary__row">
              <span className="price-summary__label">Perhitungan</span>
              <span className="price-summary__value">
                {formatRupiah(pricePerUnit)} × {isValidNumber ? quantityNum : 0} {unit}
              </span>
            </div>
            <div className="price-summary__row price-summary__total">
              <span className="price-summary__label">Total Harga</span>
              <span className="price-summary__value">{formatRupiah(totalPrice)}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!isFormValid}
              style={{ 
                opacity: isFormValid ? 1 : 0.5, 
                cursor: isFormValid ? 'pointer' : 'not-allowed' 
              }}
            >
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;