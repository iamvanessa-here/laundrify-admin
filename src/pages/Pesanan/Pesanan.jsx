import React, { useEffect, useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import OrderModal from '../../pages/Pesanan/OrderModal';
import EditStatusModal from '../../pages/Pesanan/EditStatusModal';
import DeleteConfirmModal from '../../pages/Pesanan/DeleteConfirmModal';
import './Pesanan.css';

const API_URL = 'http://localhost:3001/api/orders';

const getStatusVariant = (status) => {
  const variants = {
    Selesai: 'success',
    'Dalam Proses': 'info',
    Menunggu: 'warning',
    Dibatalkan: 'danger',
  };

  return variants[status] || 'default';
};

const formatApiOrder = (order, weightValue = order.weight) => {
  const date = new Date(`${order.date}T00:00:00`);
  const weight =
    weightValue !== undefined && weightValue !== null && weightValue !== ''
      ? `${weightValue} kg`
      : '—';

  return {
    ...order,
    weight,
    date: Number.isNaN(date.getTime())
      ? order.date
      : date.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    amount: `Rp ${Number(order.amount).toLocaleString('id-ID')}`,
  };
};

const Pesanan = () => {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil pesanan');
        }
        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message || 'Gagal mengambil pesanan');
        }
        setOrders(result.data.map((order) => formatApiOrder(order)));
      })
      .catch((error) => setOrdersError(error.message))
      .finally(() => setOrdersLoading(false));
  }, []);

  const handleAddOrder = async (newOrder) => {
    try {
      const amount = Number(String(newOrder.amount).replace(/[^\d]/g, ''));

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: newOrder.customer,
          service: newOrder.service,
          date: newOrder.date,
          status: newOrder.status,
          amount,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || 'Gagal menyimpan pesanan');
      }

      setOrders((currentOrders) => [
        formatApiOrder(result.data, parseFloat(newOrder.weight)),
        ...currentOrders,
      ]);
      setIsAddModalOpen(false);
    } catch (error) {
      window.alert(`Gagal menyimpan pesanan: ${error.message}`);
    }
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      setOrders((currentOrders) =>
        currentOrders.filter((order) => order.id !== orderToDelete.id)
      );
      setOrderToDelete(null);
    }
  };

  const handleSaveStatus = (id, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );
    setEditingOrder(null);
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
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 3V15M3 9H15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Tambah Pesanan
        </button>
      </div>

      <div className="filter-tabs">
        {filterOptions.map((filter) => (
          <button
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
                          className="btn-icon"
                          title="Edit Status"
                          onClick={() => setEditingOrder(order)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          className="btn-icon btn-icon--danger"
                          title="Hapus Pesanan"
                          onClick={() => handleDeleteClick(order)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M3 4L4 14C4 14.5523 4.44772 15 5 15H11C11.5523 15 12 14.5523 12 14L13 4"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
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
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect
                  x="8"
                  y="12"
                  width="32"
                  height="28"
                  rx="4"
                  stroke="#94A3B8"
                  strokeWidth="2"
                />
                <path d="M8 18H40" stroke="#94A3B8" strokeWidth="2" />
                <path
                  d="M18 26H30"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M18 32H26"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
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
        orderId={orderToDelete?.id}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Pesanan;