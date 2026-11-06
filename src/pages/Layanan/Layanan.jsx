import React, { useState, useMemo } from 'react';
import Card from '../../components/ui/Card';
import './Layanan.css';

const initialServices = [
  { id: 1, name: 'Cuci Setrika', description: 'Pakaian dicuci bersih, dikeringkan, lalu disetrika rapi. Pilihan praktis untuk pakaian harian.', price: 8000, unit: 'kg', category: 'Laundry kiloan', processingTime: '2 hari', minOrder: 3, status: 'Aktif', isPopular: true },
  { id: 2, name: 'Cuci Lipat', description: 'Layanan cuci dan lipat standar untuk kebutuhan sehari-hari.', price: 6000, unit: 'kg', category: 'Laundry kiloan', processingTime: '2 hari', minOrder: 3, status: 'Aktif', isPopular: false },
  { id: 3, name: 'Setrika Saja', description: 'Hanya layanan setrika untuk pakaian yang sudah dicuci bersih.', price: 5000, unit: 'kg', category: 'Laundry kiloan', processingTime: '1 hari', minOrder: 3, status: 'Aktif', isPopular: false },
  { id: 4, name: 'Seprai', description: 'Cuci bersih seprai berbagai ukuran, wangi dan rapi.', price: 15000, unit: 'lembar', category: 'Laundry satuan', processingTime: '2 hari', minOrder: 1, status: 'Aktif', isPopular: false },
  { id: 5, name: 'Cuci Kilat', description: 'Layanan express selesai dalam 24 jam. Prioritas pengerjaan.', price: 14000, unit: 'kg', category: 'Laundry express', processingTime: '24 jam', minOrder: 3, status: 'Aktif', isPopular: false },
];

const formatRupiah = (amount) => `Rp ${amount.toLocaleString('id-ID')}`;

const parseTimeToDays = (timeStr) => {
  if (timeStr.includes('24 jam')) return 1;
  return parseInt(timeStr.match(/\d+/)[0], 10);
};

const Layanan = () => {
  const [services, setServices] = useState(initialServices);
  const [selectedId, setSelectedId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('Semua kategori');
  const [filterStatus, setFilterStatus] = useState('Semua status');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', unit: 'kg', category: 'Laundry kiloan',
    processingTime: '2 hari', minOrder: '', status: 'Aktif'
  });
  const [toast, setToast] = useState(null);
  const [lastModified, setLastModified] = useState('Belum ada perubahan');

  
  
  // --- Perhitungan Dinamis untuk Banner ---
  const stats = useMemo(() => {
    const activeServices = services.filter(s => s.status === 'Aktif');
    const activeCount = activeServices.length;
    const popularService = services.find(s => s.isPopular)?.name || 'Cuci Setrika';
    
    const totalDays = activeServices.reduce((sum, s) => sum + parseTimeToDays(s.processingTime), 0);
    const avgTime = activeCount > 0 ? (totalDays / activeCount).toFixed(1) : 0;
    const avgTimeDisplay = avgTime == 1 ? '1 hari' : `${avgTime} hari`;

    return { activeCount, popularService, avgTimeDisplay };
  }, [services]);

  // --- Filter Data ---
  const filteredServices = services.filter(service => {
    const matchCategory = filterCategory === 'Semua kategori' || service.category === filterCategory;
    const matchStatus = filterStatus === 'Semua status' || service.status === filterStatus;
    return matchCategory && matchStatus;
  });

  // --- Handlers ---
  const handleSelect = (service) => {
    setSelectedId(service.id);
    setIsEditing(true);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      unit: service.unit,
      category: service.category,
      processingTime: service.processingTime,
      minOrder: service.minOrder,
      status: service.status
    });
  };

  const handleAddNew = () => {
    setSelectedId(null);
    setIsEditing(false);
    setFormData({
      name: '', description: '', price: '', unit: 'kg', category: 'Laundry kiloan',
      processingTime: '2 hari', minOrder: '', status: 'Aktif'
    });
  };

  const handleCancel = () => {
    setSelectedId(null);
    setIsEditing(false);
    setFormData({
      name: '', description: '', price: '', unit: 'kg', category: 'Laundry kiloan',
      processingTime: '2 hari', minOrder: '', status: 'Aktif'
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setToast({ type: 'error', message: 'Nama layanan dan Harga wajib diisi!' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const now = new Date();
    const timeString = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (isEditing && selectedId) {
      setServices(services.map(s => s.id === selectedId ? { ...s, ...formData, price: Number(formData.price), minOrder: Number(formData.minOrder) } : s));
      setToast({ type: 'success', message: 'Layanan berhasil diperbarui!' });
    } else {
      const newId = Math.max(...services.map(s => s.id), 0) + 1;
      setServices([...services, { id: newId, ...formData, price: Number(formData.price), minOrder: Number(formData.minOrder), isPopular: false }]);
      setToast({ type: 'success', message: 'Layanan baru berhasil ditambahkan!' });
    }
    
    setLastModified(`Admin · ${timeString}`);
    setTimeout(() => setToast(null), 3000);
    handleCancel(); // Reset form after save
  };

  const categories = ['Semua kategori', 'Laundry kiloan', 'Laundry satuan', 'Laundry express'];
  const statuses = ['Semua status', 'Aktif', 'Nonaktif'];

  return (
    <div className="layanan-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.message}
        </div>
      )}

      {/* 1. Summary Banner */}
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

      {/* 2. Filter & Table Container */}
      <Card className="table-container" padding="md">
        <div className="table-header-actions">
          <div className="filters">
            <select className="filter-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select className="filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              {statuses.map(stat => <option key={stat} value={stat}>{stat}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={handleAddNew}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
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
              {filteredServices.map(service => (
                <tr 
                  key={service.id} 
                  className={selectedId === service.id ? 'row-selected' : ''}
                  onClick={() => handleSelect(service)}
                >
                  <td>
                    <div className="service-name">{service.name}</div>
                    <div className="service-desc">{service.description}</div>
                  </td>
                  <td>
                    <div className="price-text">{formatRupiah(service.price)} / {service.unit}</div>
                    <div className="min-order-text">Min. {service.minOrder} {service.unit}</div>
                  </td>
                  <td>
                    <div className="processing-time">{service.processingTime}</div>
                    <div className={`status-badge ${service.status === 'Aktif' ? 'status-active' : 'status-inactive'}`}>
                      <span className="status-dot"></span>
                      {service.status}
                    </div>
                  </td>
                  <td>
                    <button className="btn-text-action" onClick={(e) => { e.stopPropagation(); handleSelect(service); }}>
                      Ubah layanan →
                    </button>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr><td colSpan="4" className="empty-row">Tidak ada layanan yang sesuai dengan filter.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3. Form Panel */}
      <Card className="form-container" padding="lg">
        <div className="form-header">
          <h3 className="form-title">{isEditing ? `Ubah layanan · ${formData.name || 'Baru'}` : 'Tambah layanan'}</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label className="form-label">Nama layanan <span className="required">*</span></label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Contoh: Cuci Setrika"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Harga (Rp) <span className="required">*</span></label>
              <input 
                type="number" 
                className="form-input" 
                placeholder="8000"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Satuan</label>
              <select className="form-input" value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})}>
                <option value="kg">kg</option>
                <option value="lembar">lembar</option>
                <option value="pasang">pasang</option>
                <option value="item">item</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select className="form-input" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                <option value="Laundry kiloan">Laundry kiloan</option>
                <option value="Laundry satuan">Laundry satuan</option>
                <option value="Laundry express">Laundry express</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Waktu pengerjaan</label>
              <select className="form-input" value={formData.processingTime} onChange={(e) => setFormData({...formData, processingTime: e.target.value})}>
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
                onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status layanan</label>
              <label className="toggle-container">
                <input 
                  type="checkbox" 
                  checked={formData.status === 'Aktif'}
                  onChange={(e) => setFormData({...formData, status: e.target.checked ? 'Aktif' : 'Nonaktif'})}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">{formData.status === 'Aktif' ? 'Aktif · Tampilkan di situs pelanggan' : 'Nonaktif · Sembunyikan dari situs'}</span>
              </label>
            </div>
          </div>

          <div className="form-footer">
            <div className="last-modified">
              Terakhir diubah: {lastModified}
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={handleCancel}>Batalkan</button>
              <button type="submit" className="btn-primary">Simpan layanan</button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Layanan;