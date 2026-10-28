import React, { useEffect, useState } from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import './RecentOrders.css';

const getStatusVariant = (status) => {
  const variants = {
    Selesai: 'success',
    'Dalam Proses': 'info',
    Menunggu: 'warning',
    Dibatalkan: 'danger',
  };

  return variants[status] || 'default';
};

const formatRupiah = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (value) => {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/orders')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Gagal mengambil data pesanan');
        }

        return response.json();
      })
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message || 'Gagal mengambil data pesanan');
        }

        setOrders(result.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="recent-orders" padding="md">
      <div className="recent-orders__header">
        <div>
          <h3 className="recent-orders__title">Pesanan Terbaru</h3>
          <p className="recent-orders__subtitle">Daftar pesanan yang baru masuk</p>
        </div>
        <button className="recent-orders__btn">
          Lihat Semua
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="recent-orders__table-wrapper">
        <table className="recent-orders__table">
          <thead>
            <tr>
              <th>ID Pesanan</th>
              <th>Pelanggan</th>
              <th>Layanan</th>
              <th>Tanggal</th>
              <th>Status</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6}>Memuat pesanan...</td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={6}>Gagal memuat pesanan: {error}</td>
              </tr>
            )}

            {!loading && !error && orders.length === 0 && (
              <tr>
                <td colSpan={6}>Belum ada pesanan.</td>
              </tr>
            )}

            {!loading &&
              !error &&
              orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="recent-orders__id">{order.id}</span>
                  </td>
                  <td>
                    <span className="recent-orders__customer">{order.customer}</span>
                  </td>
                  <td>
                    <span className="recent-orders__service">{order.service}</span>
                  </td>
                  <td>
                    <span className="recent-orders__date">{formatDate(order.date)}</span>
                  </td>
                  <td>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td>
                    <span className="recent-orders__amount">
                      {formatRupiah(order.amount)}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default RecentOrders;