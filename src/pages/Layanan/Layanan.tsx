import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import ServiceModal from '../../components/Layanan/ServiceModal';
import DeleteConfirmModal from '../Pesanan/DeleteConfirmModal';
import { authHeader } from '../../api/client';
import './Layanan.css';

const API_URL = 'http://localhost:3001/api/services';

interface Service {
  id?: number;
  name: string;
  description?: string;
  price: string;
  unit: string;
  category: string;
  processingTime: string;
  minOrder: number;
  status: 'Aktif' | 'Nonaktif';
  isPopular?: boolean;
}

interface ApiService {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  unit: string;
  category: string;
  processingTime: string;
  minOrder: number;
  status: 'Aktif' | 'Nonaktif';
  isPopular?: boolean;
}

const formatService = (service: ApiService): Service => ({
  ...service,
  price: String(service.price),
});

const Layanan: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filterCategory, setFilterCategory] = useState('Semua');

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(API_URL, { headers: authHeader() });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Gagal memuat layanan');
        }

        setServices((result.data || []).map((service: ApiService) =>
          formatService(service)
        ));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Terjadi kesalahan';
        setApiError(`Gagal memuat layanan: ${message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const handleSaveService = async (data: Service) => {
    setApiError('');

    try {
      const isEditing = editingService?.id !== undefined;
      const url = isEditing ? `${API_URL}/${editingService.id}` : API_URL;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          name: data.name.trim(),
          description: data.description || '',
          price: Number(data.price),
          unit: data.unit,
          category: data.category,
          processingTime: data.processingTime,
          minOrder: Number(data.minOrder),
          status: data.status,
          isPopular: data.isPopular || false,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan layanan');
      }

      const savedService = formatService(result.data as ApiService);

      setServices((current) =>
        isEditing
          ? current.map((service) =>
              service.id === savedService.id ? savedService : service
            )
          : [savedService, ...current]
      );

      setIsModalOpen(false);
      setEditingService(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      setApiError(`Gagal menyimpan layanan: ${message}`);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (serviceToDelete?.id === undefined || isDeleting) return;

    setApiError('');
    setIsDeleting(true);

    try {
      const response = await fetch(`${API_URL}/${serviceToDelete.id}`, {
        method: 'DELETE',
        headers: authHeader(),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menghapus layanan');
      }

      setServices((current) =>
        current.filter((item) => item.id !== serviceToDelete.id)
      );
      setServiceToDelete(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      setApiError(`Gagal menghapus layanan: ${message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredServices =
    filterCategory === 'Semua'
      ? services
      : services.filter((service) => service.category === filterCategory);

  return (
    <div className="layanan">
      <div className="layanan__actions">
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">
            Kategori:
          </label>
          <select
            id="category-filter"
            className="form-select"
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Laundry kiloan">Laundry kiloan</option>
            <option value="Laundry satuan">Laundry satuan</option>
            <option value="Laundry express">Laundry express</option>
          </select>
        </div>

        <button
          type="button"
          className="btn-primary btn-add-service"
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
        >
          Tambah Layanan
        </button>
      </div>

      {apiError && <p role="alert">{apiError}</p>}

      <Card className="layanan__table-card" padding="md">
        <div className="table-header">
          <span className="table-count">
            {isLoading
              ? 'Memuat layanan...'
              : `Menampilkan ${filteredServices.length} layanan`}
          </span>
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
              {!isLoading &&
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td className="font-medium">{service.name}</td>
                    <td>
                      Rp {Number(service.price).toLocaleString('id-ID')} /{' '}
                      {service.unit}
                    </td>
                    <td>{service.category}</td>
                    <td>{service.processingTime}</td>
                    <td>
                      {service.minOrder} {service.unit}
                    </td>
                    <td>
                      <Badge
                        variant={
                          service.status === 'Aktif' ? 'success' : 'default'
                        }
                      >
                        {service.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Layanan"
                          onClick={() => handleEdit(service)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon--danger"
                          title="Hapus Layanan"
                          onClick={() => setServiceToDelete(service)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!isLoading && filteredServices.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted">
                    Tidak ada layanan yang cocok dengan kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        initialData={editingService}
      />

      <DeleteConfirmModal
        isOpen={!!serviceToDelete}
        itemName={serviceToDelete?.name || ''}
        itemLabel="layanan"
        isLoading={isDeleting}
        onClose={() => {
          if (!isDeleting) setServiceToDelete(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Layanan;
