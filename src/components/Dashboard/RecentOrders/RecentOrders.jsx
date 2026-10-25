import React from 'react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import { recentOrders } from '../../../data/mockData';
import './RecentOrders.css';

const getStatusVariant = (status) => {
  const variants = {
    'Selesai': 'success',
    'Dalam Proses': 'info',
    'Menunggu': 'warning',
    'Dibatalkan': 'danger',
  };
  return variants[status] || 'default';
};

const RecentOrders = () => {
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
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
            {recentOrders.map((order) => (
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
                  <span className="recent-orders__date">{order.date}</span>
                </td>
                <td>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </td>
                <td>
                  <span className="recent-orders__amount">{order.amount}</span>
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