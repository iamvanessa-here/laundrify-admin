import React from 'react';
import Card from '../../ui/Card';
import { orderStatusData } from '../../../data/mockData';
import './OrderStatus.css';

const OrderStatus = () => {
  const total = orderStatusData.reduce((sum, item) => sum + item.value, 0);

  // Donut chart calculations
  const size = 160;
  const strokeWidth = 20;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercentage = 0;

  return (
    <Card className="order-status" padding="md">
      <div className="order-status__header">
        <h3 className="order-status__title">Status Pesanan</h3>
        <p className="order-status__subtitle">Bulan ini</p>
      </div>

      <div className="order-status__chart">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={strokeWidth}
          />
          {/* Data segments */}
          {orderStatusData.map((item, index) => {
            const percentage = item.value / total;
            const dashLength = circumference * percentage;
            const dashOffset = circumference * cumulativePercentage;
            cumulativePercentage += percentage;

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={-dashOffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}
          {/* Center text */}
          <text
            x={size / 2}
            y={size / 2 - 6}
            textAnchor="middle"
            fill="#1F2937"
            fontSize="20"
            fontWeight="700"
            fontFamily="Inter"
          >
            {total}
          </text>
          <text
            x={size / 2}
            y={size / 2 + 14}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="11"
            fontFamily="Inter"
          >
            Total Pesanan
          </text>
        </svg>
      </div>

      <div className="order-status__list">
        {orderStatusData.map((item) => (
          <div key={item.label} className="order-status__item">
            <div className="order-status__item-left">
              <span
                className="order-status__item-dot"
                style={{ background: item.color }}
              ></span>
              <span className="order-status__item-label">{item.label}</span>
            </div>
            <div className="order-status__item-right">
              <span className="order-status__item-value">{item.value}</span>
              <span className="order-status__item-percent">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OrderStatus;