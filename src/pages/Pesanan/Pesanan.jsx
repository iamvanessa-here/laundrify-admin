import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import OrderModal from '../../pages/Pesanan/OrderModal';
import EditStatusModal from '../../pages/Pesanan/EditStatusModal';
import DeleteConfirmModal from '../../pages/Pesanan/DeleteConfirmModal';
import './Pesanan.css';

// Data Mock Awal
const initialOrders = [
  { id: 'LND-0847', customer: 'Ahmad Fauzi', service: 'Cuci Reguler', weight: '4 kg', date: '25 Okt 2026', status: 'Selesai', amount: 'Rp 45.000' },
  { id: 'LND-0846', customer: 'Siti Nurhaliza', service: 'Cuci Express', weight: '2 kg', date: '25 Okt 2026', status: 'Dalam Proses', amount: 'Rp 75.000' },
  { id: 'LND-0845', customer: 'Budi Santoso', service: 'Dry Clean', weight: '1 kg', date: '24 Okt 2026', status: 'Selesai', amount: 'Rp 120.000' },
  { id: 'LND-0844', customer: 'Dewi Lestari', service: 'Cuci Setrika', weight: '5 kg', date: '24 Okt 2026', status: 'Menunggu', amount: 'Rp 55.000' },
  { id: 'LND-0843', customer: 'Rizky Pratama', service: 'Cuci Selimut', weight: '3 kg', date: '24 Okt 2026', status: 'Selesai', amount: 'Rp 85.000' },
];

const getStatusVariant = (status) => {
  const variants = { 'Selesai': 'success', 'Dalam Proses': 'info', 'Menunggu': 'warning', 'Dibatalkan': 'danger' };
  return variants[status] || 'default';
};

const Pesanan = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderToDelete, setOrderToDelete] = useState(null); // State untuk custom delete modal

  // 1. Fungsi Tambah Pesanan
  const handleAddOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setIsAddModalOpen(false);
  };

  // 2. Fungsi Buka Modal Hapus
  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
  };

  // 3. Fungsi Eksekusi Hapus (dipanggil dari DeleteConfirmModal)
  const handleConfirmDelete = () => {
    if (orderToDelete) {
      setOrders(orders.filter(order => order.id !== orderToDelete.id));
      setOrderToDelete(null); // Tutup modal setelah dihapus
    }
  };

  // 4. Fungsi Simpan Perubahan Status
  const handleSaveStatus = (id, newStatus) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
    setEditingOrder(null); // Tutup modal setelah berhasil
  };

  // 5. Logika Filter & Pencarian Gabungan
  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'Semua' || order.status === statusFilter;
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const filterOptions = ['Semua', 'Menunggu', 'Dalam Proses', 'Selesai'];

  return (
    <div className="pesanan">
      {/* Action Bar dengan Search Bar */}
      <div className="pesanan__actions">
        <div className="pesanan__search">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input 
            type="text" 
            placeholder="Cari ID pesanan atau nama pelanggan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Tambah Pesanan
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="filter-tabs">
        {filterOptions.map((filter) => (
          <button
            key={filter}
            className={`filter-tab ${statusFilter === filter ? 'filter-tab--active' : ''}`}
            onClick={() => setStatusFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Order Table Card */}
      <Card className="pesanan__table-card" padding="md">
        <div className="table-header">
          <span className="table-count">
            Menampilkan {filteredOrders.length} pesanan
          </span>
        </div>

        {filteredOrders.length > 0 ? (
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
                    <td><span className="order-id">{order.id}</span></td>
                    <td className="font-medium">{order.customer}</td>
                    <td>{order.service}</td>
                    <td>{order.weight}</td>
                    <td className="text-muted">{order.date}</td>
                    <td><Badge variant={getStatusVariant(order.status)}>{order.status}</Badge></td>
                    <td className="font-medium">{order.amount}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-icon" 
                          title="Edit Status"
                          onClick={() => setEditingOrder(order)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button 
                          className="btn-icon btn-icon--danger" 
                          title="Hapus Pesanan"
                          onClick={() => handleDeleteClick(order)}
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M3 4L4 14C4 14.5523 4.44772 15 5 15H11C11.5523 15 12 14.5523 12 14L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
          /* Empty State */
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="12" width="32" height="28" rx="4" stroke="#94A3B8" strokeWidth="2" />
              <path d="M8 18H40" stroke="#94A3B8" strokeWidth="2" />
              <path d="M18 26H30" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 32H26" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="empty-state__text">
              Tidak ada pesanan yang cocok dengan pencarian "{searchTerm}" dan status "{statusFilter}".
            </p>
          </div>
        )}
      </Card>

      {/* Modal Tambah Pesanan */}
      {isAddModalOpen && (
        <OrderModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddOrder} />
      )}

      {/* Modal Edit Status */}
      {editingOrder && (
        <EditStatusModal 
          order={editingOrder} 
          onClose={() => setEditingOrder(null)} 
          onSave={handleSaveStatus} 
        />
      )}

      {/* Modal Konfirmasi Hapus (Custom) */}
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