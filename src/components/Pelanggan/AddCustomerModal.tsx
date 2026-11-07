import React, { useState, ChangeEvent, FormEvent } from 'react';
import './AddCustomerModal.css';

interface CustomerFormData {
  name: string;
  email: string;
  whatsapp: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
}

interface ExistingCustomer {
  email: string;
  whatsapp: string;
}

interface AddCustomerModalProps {
  onClose: () => void;
  onAdd: (customer: CustomerFormData & { id: string; regDate: string }) => void;
  existingCustomers: ExistingCustomer[];
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ 
  onClose, 
  onAdd, 
  existingCustomers 
}) => {
  const [formData, setFormData] = useState<CustomerFormData>({ 
    name: '', 
    email: '', 
    whatsapp: '', 
    address: '' 
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const newValue = name === 'whatsapp' ? value.replace(/\D/g, '') : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    const errorKey = name as keyof FormErrors;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    // Validasi Form
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Nama pelanggan wajib diisi';
    }
    
    if (!formData.email || formData.email.trim() === '') {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.whatsapp || formData.whatsapp.trim() === '') {
      newErrors.whatsapp = 'Nomor WhatsApp wajib diisi';
    }
    
    if (!formData.address || formData.address.trim() === '') {
      newErrors.address = 'Alamat wajib diisi';
    }

    // Cek Duplikat
    const isDuplicate = existingCustomers.some(c => 
      c.email.toLowerCase() === formData.email.toLowerCase() || c.whatsapp === formData.whatsapp
    );
    
    if (isDuplicate) {
      newErrors.email = 'Email atau WhatsApp sudah terdaftar';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Buat objek pelanggan baru
    const newCustomer = {
      id: `CUST-${String(existingCustomers.length + 1).padStart(3, '0')}`,
      ...formData,
      regDate: new Date().toISOString().split('T')[0]
    };
    
    onAdd(newCustomer);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Tambah Pelanggan Baru</h2>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Pelanggan <span className="required">*</span></label>
            <input 
              type="text" 
              className={`form-input ${errors.name ? 'input-error' : ''}`} 
              value={formData.name} 
              onChange={handleChange} 
              name="name" 
              placeholder="Masukkan nama pelanggan..." 
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email <span className="required">*</span></label>
            <input 
              type="email" 
              className={`form-input ${errors.email ? 'input-error' : ''}`} 
              value={formData.email} 
              onChange={handleChange} 
              name="email" 
              placeholder="Masukkan email..." 
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Nomor WhatsApp <span className="required">*</span></label>
            <input 
              type="text" 
              inputMode="numeric"
              className={`form-input ${errors.whatsapp ? 'input-error' : ''}`} 
              value={formData.whatsapp} 
              onChange={handleChange} 
              name="whatsapp" 
              placeholder="Contoh: 08123456789"
            />
            {errors.whatsapp && <span className="error-text">{errors.whatsapp}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Alamat Utama <span className="required">*</span></label>
            <textarea 
              className={`form-input form-textarea ${errors.address ? 'input-error' : ''}`} 
              rows={3} 
              value={formData.address} 
              onChange={handleChange} 
              name="address" 
              placeholder="Masukkan alamat lengkap..." 
            />
            {errors.address && <span className="error-text">{errors.address}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Pelanggan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;