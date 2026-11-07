import React, { useState, useEffect } from 'react';
import './ServiceModal.css';

interface ServiceData {
  id?: number;
  name: string;
  price: string;
  unit: string;
  category: string;
  processingTime: string;
  minOrder: number;
  status: 'Aktif' | 'Nonaktif';
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceData) => void;
  initialData?: ServiceData | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<ServiceData>({
    name: '',
    price: '',
    unit: 'kg',
    category: 'Laundry Kiloan',
    processingTime: '1-2 Hari',
    minOrder: 3,
    status: 'Aktif',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        price: '',
        unit: 'kg',
        category: 'Laundry Kiloan',
        processingTime: '1-2 Hari',
        minOrder: 3,
        status: 'Aktif',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nama layanan wajib diisi';
    if (!formData.price.trim()) newErrors.price = 'Harga wajib diisi';
    if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) newErrors.price = 'Harga harus berupa angka positif';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      ...formData,
      id: initialData?.id || Date.now(),
      price: formData.price,
      minOrder: Number(formData.minOrder),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content modal-content--md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{initialData ? 'Ubah Layanan' : 'Tambah Layanan Baru'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Layanan <span className="required">*</span></label>
            <input type="text" name="name" className={`form-input ${errors.name ? 'input-error' : ''}`} value={formData.name} onChange={handleChange} placeholder="Contoh: Cuci Setrika" />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Harga <span className="required">*</span></label>
              <input type="text" name="price" className={`form-input ${errors.price ? 'input-error' : ''}`} value={formData.price} onChange={handleChange} placeholder="Contoh: 8000" />
              {errors.price && <span className="error-text">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Satuan</label>
              <select name="unit" className="form-input" value={formData.unit} onChange={handleChange}>
                <option value="kg">Kilogram (kg)</option>
                <option value="lembar">Lembar</option>
                <option value="pasang">Pasang</option>
                <option value="item">Item</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select name="category" className="form-input" value={formData.category} onChange={handleChange}>
                <option value="Laundry Kiloan">Laundry Kiloan</option>
                <option value="Laundry Satuan">Laundry Satuan</option>
                <option value="Dry Clean">Dry Clean</option>
                <option value="Setrika">Setrika</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Waktu Pengerjaan</label>
              <input type="text" name="processingTime" className="form-input" value={formData.processingTime} onChange={handleChange} placeholder="Contoh: 1-2 Hari" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Min. Pesanan</label>
              <input type="number" name="minOrder" className="form-input" value={formData.minOrder} onChange={handleChange} min="1" />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Layanan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;