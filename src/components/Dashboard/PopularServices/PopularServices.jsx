import React from 'react';
import Card from '../../ui/Card';
import { popularServices } from '../../../data/mockData';
import './PopularServices.css';

const PopularServices = () => {
  return (
    <Card className="popular-services" padding="md">
      <div className="popular-services__header">
        <div>
          <h3 className="popular-services__title">Layanan Populer</h3>
          <p className="popular-services__subtitle">Layanan paling banyak dipesan</p>
        </div>
      </div>

      <div className="popular-services__list">
        {popularServices.map((service, index) => (
          <div key={service.id} className="popular-services__item">
            <div className="popular-services__item-header">
              <div className="popular-services__item-left">
                <span className="popular-services__rank">#{index + 1}</span>
                <span className="popular-services__name">{service.name}</span>
              </div>
              <div className="popular-services__item-right">
                <span className="popular-services__orders">{service.orders} pesanan</span>
              </div>
            </div>
            <div className="popular-services__progress">
              <div
                className="popular-services__progress-bar"
                style={{ width: `${service.percentage}%` }}
              ></div>
            </div>
            <div className="popular-services__item-footer">
              <span className="popular-services__revenue">{service.revenue}</span>
              <span className="popular-services__percent">{service.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PopularServices;