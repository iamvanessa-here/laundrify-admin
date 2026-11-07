import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ServiceModal from '../../components/Layanan/ServiceModal';
import './Layanan.css';

interface Service {
  id: number;
  name: string;
  price: string;
  unit: string;
  category: string;
  processingTime: string;
  minOrder: number;
  status: 'Aktif' | 'Nonaktif';
}

const initialServices: Service[] = [
  { id: 1, name: 'Cuci Setrika', price: '8000', unit: 'kg', category: 'Laundry Kiloan', processingTime: '2 Hari', minOrder: 3, status: 'Aktif' },
  { id: 2, name: 'Cuci Lipat', price: '6000', unit: 'kg', category: 'Laundry Kiloan', processingTime: '1 Hari', minOrder: 3, status: 'Aktif' },
  { id: 3, name: 'Setrika Saja', price: '5000', unit: 'kg', category: 'Setrika', processingTime: '1 Hari', minOrder: 3, status: 'Aktif' },
  { id: 4, name: 'Seprai', price: '15000', unit: 'lembar', category: 'Laundry Satuan', processingTime: '2 Hari', minOrder: 1, status: 'Aktif' },
  { id: 5, name: 'Cuci Kilat', price: '14000', unit: 'kg', category: 'Laundry Kiloan', processingTime: '4 Jam', minOrder: 3, status: 'Nonaktif' },
];

const Layanan: React.FC = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filterCategory, setFilterCategory] = useState('Semua');

  const handleSaveService = (data: Service) => {
    if (editingService) {
      setServices(services.map(s => s.id === data.id ? data : s));
    } else {
      setServices([...services, data]);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  // --- PERUBAHAN: Filter logic tetap sama ---
  const filteredServices = filterCategory === 'Semua' 
    ? services 
    : services.filter(s => s.category === filterCategory);

  return (
    <div className="layanan">
      {/* --- PERUBAHAN: Action Bar lebih rapi dengan Flexbox --- */}
      <div className="layanan__actions">
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">Kategori:</label>
          <select 
            id="category-filter"
            className="form-select" 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Laundry Kiloan">Laundry Kiloan</option>
            <option value="Laundry Satuan">Laundry Satuan</option>
            <option value="Dry Clean">Dry Clean</option>
            <option value="Setrika">Setrika</option>
          </select>
        </div>
        
        <button className="btn-primary btn-add-service" onClick={() => { setEditingService(null); setIsModalOpen(true); }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Tambah Layanan
        </button>
      </div>

      {/* Table Card */}
      <Card className="layanan__table-card" padding="md">
        <div className="table-header">
          <span className="table-count">Menampilkan {filteredServices.length} layanan</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Layanan</th>
                <th>Harga</th>
                <th>Kategori</th>
                <th>Waktu</th>
                <th>Min. Order</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="font-medium">{service.name}</td>
                  <td>Rp {Number(service.price).toLocaleString('id-ID')} / {service.unit}</td>
                  <td>{service.category}</td>
                  <td>{service.processingTime}</td>
                  <td>{service.minOrder} {service.unit}</td>
                  <td>
                    <Badge variant={service.status === 'Aktif' ? 'success' : 'default'}>
                      {service.status}
                    </Badge>
                  </td>
                  <td>
                    <div className="action-buttons">
                      {/* --- PERUBAHAN: Hanya menyisakan tombol Edit --- */}
                      <button className="btn-icon" title="Edit Layanan" onClick={() => handleEdit(service)}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tambah/Ubah Layanan */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingService(null); }}
        onSave={handleSaveService}
        initialData={editingService}
      />
    </div>
  );
};

export default Layanan;