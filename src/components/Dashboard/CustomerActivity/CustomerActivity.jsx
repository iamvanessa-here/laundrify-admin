import React from 'react';
import Card from '../../ui/Card';
import { customerActivity } from '../../../data/mockData';
import './CustomerActivity.css';

const CustomerActivity = () => {
  return (
    <Card className="customer-activity" padding="md">
      <div className="customer-activity__header">
        <div>
          <h3 className="customer-activity__title">Aktivitas Pelanggan</h3>
          <p className="customer-activity__subtitle">Pelanggan paling aktif</p>
        </div>
        <button className="customer-activity__btn">
          Lihat Semua
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="customer-activity__list">
        {customerActivity.map((customer) => (
          <div key={customer.id} className="customer-activity__item">
            <div className="customer-activity__avatar">
              {customer.avatar}
            </div>
            <div className="customer-activity__info">
              <div className="customer-activity__info-top">
                <span className="customer-activity__name">{customer.name}</span>
                <span className="customer-activity__spent">{customer.totalSpent}</span>
              </div>
              <div className="customer-activity__info-bottom">
                <span className="customer-activity__orders">{customer.totalOrders} pesanan</span>
                <span className="customer-activity__separator">•</span>
                <span className="customer-activity__last">{customer.lastOrder}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CustomerActivity;