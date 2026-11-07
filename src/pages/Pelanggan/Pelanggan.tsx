import { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/Pelanggan/StatCard';
import AddCustomerModal from '../../components/Pelanggan/AddCustomerModal';
import CustomerDetailModal from '../../components/Pelanggan/CustomerDetailModal';
import Pagination from '../../components/Pelanggan/Pagination';
import { mockCustomers, mockOrders } from '../../data/mockData';
import type { Customer, Order, ToastState } from '../../types';
import './Pelanggan.css';

const ITEMS_PER_PAGE = 10;

type SortOrder = 'terbaru' | 'terlama';

const Pelanggan = () => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [orders] = useState<Order[]>(mockOrders);

  const [searchTerm, setSearchTerm] = useState(''); 
  const [sortOrder, setSortOrder] = useState<SortOrder>('terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState('2026-10');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [toast, setToast] = useState<ToastState | null>(null);

  const getLatestTransactionDate = (customerId: Customer['id']): number | null => {
    const custOrders = orders.filter(
      (o) => o.customerId === customerId && o.status === 'Selesai'
    );
    if (custOrders.length === 0) return null;
    return Math.max(...custOrders.map((o) => new Date(o.date).getTime()));
  };

  const filteredAndSortedCustomers = useMemo(() => {
    const keyword = searchTerm.toLowerCase();

    const result = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(keyword) ||
        c.email.toLowerCase().includes(keyword) ||
        c.whatsapp.includes(searchTerm)
    );

    result.sort((a, b) => {
      const dateA = getLatestTransactionDate(a.id);
      const dateB = getLatestTransactionDate(b.id);
      if (dateA === null && dateB === null) return 0;
      if (dateA === null) return 1;
      if (dateB === null) return -1;
      return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [customers, orders, searchTerm, sortOrder]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: SortOrder) => {
    setSortOrder(val);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAndSortedCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const total = customers.length;
    const newCustomers = customers.filter((c) => c.regDate.startsWith(selectedMonth)).length;
    const returning = customers.filter(
      (c) => orders.filter((o) => o.customerId === c.id).length >= 2
    ).length;
    const returningPercent = total > 0 ? ((returning / total) * 100).toFixed(1) : '0';
    const activeOrders = orders.filter((o) => o.status === 'Dalam Proses').length;
    return { total, newCustomers, returning, returningPercent, activeOrders };
  }, [customers, orders, selectedMonth]);

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomers((prev) => [newCustomer, ...prev]);
    setIsAddModalOpen(false);
  };

  const handleUpdateCustomer = (customerId: Customer['id'], updatedData: Partial<Customer>) => {
    setTimeout(() => {
      setCustomers((prevCustomers) =>
        prevCustomers.map((cust) =>
          cust.id === customerId ? { ...cust, ...updatedData } : cust
        )
      );
      setToast({ type: 'success', message: 'Data pelanggan berhasil diperbarui!' });
      setTimeout(() => setToast(null), 3000);
    }, 500);
  };

  return (
    <div className="pelanggan">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.message}
        </div>
      )}

      <div className="stats-grid">
        <StatCard title="Total Pelanggan" value={stats.total} icon="users" color="#2563EB" bg="#DBEAFE" />
        <StatCard
          title="Pelanggan Baru"
          value={stats.newCustomers}
          subtitle={`Bulan ${selectedMonth}`}
          icon="user-plus"
          color="#10B981"
          bg="#D1FAE5"
          selectMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
        <StatCard
          title="Pelanggan Kembali"
          value={stats.returning}
          subtitle={`${stats.returningPercent}% dari total`}
          icon="refresh"
          color="#8B5CF6"
          bg="#EDE9FE"
        />
        <StatCard title="Pesanan Aktif" value={stats.activeOrders} icon="clock" color="#F59E0B" bg="#FEF3C7" />
      </div>

      <div className="action-bar">
        <div className="search-sort-group">
          <div className="search-box">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama, email, atau WhatsApp..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <select
            className="sort-select"
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value as SortOrder)}
          >
            <option value="terbaru">Transaksi Terbaru</option>
            <option value="terlama">Transaksi Terlama</option>
          </select>
        </div>
        <button type="button" className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 3V15M3 9H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Tambah Pelanggan
        </button>
      </div>

      <Card className="table-card" padding="md">
        <div className="table-header">
          <h3 className="table-title">Pelanggan Terdaftar</h3>
          <span className="table-count">
            Menampilkan {paginatedCustomers.length} dari {filteredAndSortedCustomers.length} pelanggan
          </span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nama Pelanggan</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Total Pesanan</th>
                <th>Total Transaksi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCustomers.map((cust) => {
                const custOrders = orders.filter((o) => o.customerId === cust.id);
                const totalSpent = custOrders
                  .filter((o) => o.status === 'Selesai')
                  .reduce((sum, o) => sum + o.amount, 0);

                return (
                  <tr key={cust.id} onClick={() => setSelectedCustomer(cust)} className="clickable-row">
                    <td className="font-medium">{cust.name}</td>
                    <td>{cust.email}</td>
                    <td>{cust.whatsapp}</td>
                    <td>{custOrders.length}</td>
                    <td className="font-medium">Rp {totalSpent.toLocaleString('id-ID')}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-icon"
                        title="Lihat & Edit Detail"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M8 3C4.5 3 2 8 2 8C2 8 4.5 13 8 13C11.5 13 14 8 14 8C14 8 11.5 3 8 3Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-muted" style={{ padding: '40px 0' }}>
                    Tidak ada pelanggan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Card>

      {isAddModalOpen && (
        <AddCustomerModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddCustomer}
          existingCustomers={customers}
        />
      )}

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          orders={orders.filter((o) => o.customerId === selectedCustomer.id)}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default Pelanggan;