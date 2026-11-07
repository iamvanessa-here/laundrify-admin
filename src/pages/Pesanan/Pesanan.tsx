import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Badge, { BadgeVariant } from '../../components/ui/Badge';
import OrderModal from '../../pages/Pesanan/OrderModal';
import EditStatusModal from '../../pages/Pesanan/EditStatusModal';
import DeleteConfirmModal from '../../pages/Pesanan/DeleteConfirmModal';
import './Pesanan.css';

const API_URL = 'http://localhost:3001/api/orders';

interface PesananOrder {
  id: string;
  customerId?: string;
  customer: string;
  service: string;
  weight: string;
  date: string;
  status: string;
  amount: string;
  amountRaw?: number;
}

interface ApiOrder {
  id: string;
  customerId?: string;
  customer: string;
  service: string;
  weight?: number | string;
  date: string;
  status: string;
  amount: number | string;
}

const getStatusVariant = (status: string): BadgeVariant => {
  const variants: Record<string, BadgeVariant> = {
    Selesai: 'success',
    'Dalam Proses': 'info',
    Menunggu: 'warning',
    Dibatalkan: 'danger',
  };

  return variants[status] || 'default';
};

const getAmountNumber = (amount: number | string): number => {
  if (typeof amount === 'number') return amount;
  return Number(String(amount).replace(/[^\d]/g, '')) || 0;
};

const formatApiOrder = (order: ApiOrder): PesananOrder => {
  const parsedDate = new Date(`${order.date}T00:00:00`);
  const displayDate = Number.isNaN(parsedDate.getTime())
    ? order.date
    : parsedDate.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const weight =
    order.weight !== undefined && order.weight !== null && order.weight !== ''
      ? `${order.weight} kg`
      : '—';

  const amountRaw = getAmountNumber(order.amount);

  return {
    ...order,
    weight,
    date: displayDate,
    amount: `Rp ${amountRaw.toLocaleString('id-ID')}`,
    amountRaw,
  };
};

const Pesanan: React.FC = () => {
  const [orders, setOrders] = useState<PesananOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PesananOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderToDelete, setOrderToDelete] = useState<PesananOrder | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Gagal mengambil pesanan');
        }

        setOrders((result.data || []).map((order: ApiOrder) => formatApiOrder(order)));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Terjadi kesalahan';
        setOrdersError(message);
      } finally {
        setOrdersLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleAddOrder = async (newOrder: PesananOrder) => {
    try {
      const amount =
        newOrder.amountRaw ??
        getAmountNumber(newOrder.amount);

      const weight = Number.parseFloat(
        String(newOrder.weight || '').replace(/[^\d.,]/g, '').replace(',', '.')
      );

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: newOrder.customerId,
          customer: newOrder.customer,
          service: newOrder.service,
          date: newOrder.date,
          status: newOrder.status,
          amount,
          weight: Number.isNaN(weight) ? null : weight,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan pesanan');
      }

      const savedOrder = result.data as ApiOrder;
      setOrders((current) => [formatApiOrder(savedOrder), ...current]);
      setIsAddModalOpen(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      window.alert(`Gagal menyimpan pesanan: ${message}`);
    }
  };

  const handleDeleteClick = (order: PesananOrder) => {
    setOrderToDelete(order);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      const response = await fetch(`${API_URL}/${orderToDelete.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menghapus pesanan');
      }

      setOrders((current) =>
        current.filter((order) => order.id !== orderToDelete.id)
      );
      setOrderToDelete(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      window.alert(`Gagal menghapus pesanan: ${message}`);
    }
  };

  const handleSaveStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal memperbarui status');
      }

      const updatedOrder = formatApiOrder(result.data as ApiOrder);

      setOrders((current) =>
        current.map((order) => (order.id === id ? updatedOrder : order))
      );
      setEditingOrder(null);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Terjadi kesalahan';
      window.alert(`Gagal memperbarui status: ${message}`);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'Semua' || order.status === statusFilter;
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const filterOptions = ['Semua', 'Menunggu', 'Dalam Proses', 'Selesai'];

  return (
    <div className="pesanan">
      <div className="pesanan__actions">
        <div className="pesanan__search">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle
              cx="8"
              cy="8"
              r="5.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 12L16 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari ID pesanan atau nama pelanggan..."
            value={searchTerm}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Tambah Pesanan
        </button>
      </div>

      <div className="filter-tabs">
        {filterOptions.map((filter) => (
          <button
            type="button"
            key={filter}
            className={`filter-tab ${
              statusFilter === filter ? 'filter-tab--active' : ''
            }`}
            onClick={() => setStatusFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {ordersError && (
        <p role="alert">Gagal memuat pesanan: {ordersError}</p>
      )}

      <Card className="pesanan__table-card" padding="md">
        <div className="table-header">
          <span className="table-count">
            {ordersLoading
              ? 'Memuat pesanan...'
              : `Menampilkan ${filteredOrders.length} pesanan`}
          </span>
        </div>

        {!ordersLoading && filteredOrders.length > 0 ? (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Pelanggan</th>
                  <th>Layanan</th>
                  <th>Berat</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <span className="order-id">{order.id}</span>
                    </td>
                    <td className="font-medium">{order.customer}</td>
                    <td>{order.service}</td>
                    <td>{order.weight}</td>
                    <td className="text-muted">{order.date}</td>
                    <td>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="font-medium">{order.amount}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Status"
                          onClick={() => setEditingOrder(order)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-icon btn-icon--danger"
                          title="Hapus Pesanan"
                          onClick={() => handleDeleteClick(order)}
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          !ordersLoading && (
            <div className="empty-state">
              <p className="empty-state__text">
                Tidak ada pesanan yang cocok dengan pencarian "{searchTerm}" dan
                status "{statusFilter}".
              </p>
            </div>
          )
        )}
      </Card>

      {isAddModalOpen && (
        <OrderModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddOrder}
        />
      )}

      {editingOrder && (
        <EditStatusModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleSaveStatus}
        />
      )}

      <DeleteConfirmModal
        isOpen={!!orderToDelete}
        orderId={orderToDelete?.id || ''}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Pesanan;
