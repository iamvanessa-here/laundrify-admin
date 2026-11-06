import React, { useEffect, useMemo, useState } from 'react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/Pelanggan/StatCard';
import AddCustomerModal from '../../components/Pelanggan/AddCustomerModal';
import CustomerDetailModal from '../../components/Pelanggan/CustomerDetailModal';
import Pagination from '../../components/Pelanggan/Pagination';
import './Pelanggan.css';

const CUSTOMERS_API_URL = 'http://localhost:3001/api/customers';
const ORDERS_API_URL = 'http://localhost:3001/api/orders';
const ITEMS_PER_PAGE = 10;

const normalizeName = (name = '') => name.trim().toLowerCase();

const getCustomerOrders = (orders, customerName) =>
  orders.filter(
    (order) => normalizeName(order.customer) === normalizeName(customerName)
  );

const getLatestTransactionDate = (orders, customerName) => {
  const completedOrders = getCustomerOrders(orders, customerName).filter(
    (order) => order.status === 'Selesai'
  );

  if (completedOrders.length === 0) return null;

  return new Date(
    Math.max(...completedOrders.map((order) => new Date(order.date)))
  );
};

const Pelanggan = () => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('terbaru');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersResponse, ordersResponse] = await Promise.all([
          fetch(CUSTOMERS_API_URL),
          fetch(ORDERS_API_URL),
        ]);

        const [customersResult, ordersResult] = await Promise.all([
          customersResponse.json(),
          ordersResponse.json(),
        ]);

        if (!customersResponse.ok || !customersResult.success) {
          throw new Error(
            customersResult.message || 'Gagal memuat pelanggan'
          );
        }

        if (!ordersResponse.ok || !ordersResult.success) {
          throw new Error(ordersResult.message || 'Gagal memuat pesanan');
        }

        setCustomers(customersResult.data || []);
        setOrders(ordersResult.data || []);
      } catch (error) {
        setApiError(`Gagal memuat data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredAndSortedCustomers = useMemo(() => {
    const term = searchTerm.toLowerCase();

    const result = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.whatsapp.includes(searchTerm)
    );

    result.sort((a, b) => {
      const dateA = getLatestTransactionDate(orders, a.name);
      const dateB = getLatestTransactionDate(orders, b.name);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return sortOrder === 'terbaru' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [customers, orders, searchTerm, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / ITEMS_PER_PAGE
  );

  const paginatedCustomers = filteredAndSortedCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const stats = useMemo(() => {
    const total = customers.length;

    const newCustomers = customers.filter((customer) =>
      customer.regDate?.startsWith(selectedMonth)
    ).length;

    const returning = customers.filter(
      (customer) => getCustomerOrders(orders, customer.name).length >= 2
    ).length;

    const returningPercent =
      total > 0 ? ((returning / total) * 100).toFixed(1) : 0;

    const activeOrders = orders.filter(
      (order) => order.status === 'Dalam Proses'
    ).length;

    return { total, newCustomers, returning, returningPercent, activeOrders };
  }, [customers, orders, selectedMonth]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  const handleAddCustomer = async (newCustomer) => {
    setApiError('');

    try {
      const response = await fetch(CUSTOMERS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Gagal menyimpan pelanggan');
      }

      setCustomers((currentCustomers) => [
        result.data,
        ...currentCustomers,
      ]);
      setIsAddModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      setApiError(`Gagal menyimpan pelanggan: ${error.message}`);
    }
  };

  const handleUpdateCustomer = (customerId, updatedData) => {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === customerId
          ? { ...customer, ...updatedData }
          : customer
      )
    );

    setSelectedCustomer((currentCustomer) =>
      currentCustomer?.id === customerId
        ? { ...currentCustomer, ...updatedData }
        : currentCustomer
    );

    setToast({
      type: 'success',
      message: 'Data pelanggan berhasil diperbarui!',
    });

    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="pelanggan">
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          ✓ {toast.message}
        </div>
      )}

      <div className="stats-grid">
        <StatCard
          title="Total Pelanggan"
          value={stats.total}
          icon="users"
          color="#2563EB"
          bg="#DBEAFE"
        />

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

        <StatCard
          title="Pesanan Aktif"
          value={stats.activeOrders}
          icon="clock"
          color="#F59E0B"
          bg="#FEF3C7"
        />
      </div>

      <div className="action-bar">
        <div className="search-sort-group">
          <div className="search-box">
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
              placeholder="Cari nama, email, atau WhatsApp..."
              value={searchTerm}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>

          <select
            className="sort-select"
            value={sortOrder}
            onChange={(event) => handleSortChange(event.target.value)}
          >
            <option value="terbaru">Transaksi Terbaru</option>
            <option value="terlama">Transaksi Terlama</option>
          </select>
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
          Tambah Pelanggan
        </button>
      </div>

      {apiError && (
        <p role="alert" className="text-muted">
          {apiError}
        </p>
      )}

      <Card className="table-card" padding="md">
        <div className="table-header">
          <h3 className="table-title">Pelanggan Terdaftar</h3>
          <span className="table-count">
            Menampilkan {paginatedCustomers.length} dari{' '}
            {filteredAndSortedCustomers.length} pelanggan
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
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Memuat pelanggan...
                  </td>
                </tr>
              ) : (
                paginatedCustomers.map((customer) => {
                  const customerOrders = getCustomerOrders(
                    orders,
                    customer.name
                  );

                  const totalSpent = customerOrders
                    .filter((order) => order.status === 'Selesai')
                    .reduce((sum, order) => sum + Number(order.amount || 0), 0);

                  return (
                    <tr
                      key={customer.id}
                      onClick={() => setSelectedCustomer(customer)}
                      className="clickable-row"
                    >
                      <td className="font-medium">{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.whatsapp}</td>
                      <td>{customerOrders.length}</td>
                      <td className="font-medium">
                        Rp {totalSpent.toLocaleString('id-ID')}
                      </td>
                      <td>
                        <button
                          className="btn-icon"
                          title="Lihat & Edit Detail"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedCustomer(customer);
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M8 3C4.5 3 2 8 2 8C2 8 4.5 13 8 13C11.5 13 14 8 14 8C14 8 11.5 3 8 3Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            />
                            <circle
                              cx="8"
                              cy="8"
                              r="2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}

              {!isLoading && paginatedCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center text-muted"
                    style={{ padding: '40px 0' }}
                  >
                    Tidak ada pelanggan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
          orders={getCustomerOrders(orders, selectedCustomer.name)}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={handleUpdateCustomer}
        />
      )}
    </div>
  );
};

export default Pelanggan;