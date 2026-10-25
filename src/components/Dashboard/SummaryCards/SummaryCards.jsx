import React from 'react';
import Card from '../../ui/Card';
import { summaryData } from '../../../data/mockData';
import SummaryIcon from '../../icons/SummaryIcon';
import './SummaryCards.css';

const SummaryCards = () => {
  return (
    <div className="summary-cards">
      {summaryData.map((item) => (
        <Card key={item.id} className="summary-card" padding="md">
          <div className="summary-card__header">
            <div
              className="summary-card__icon"
              style={{ background: item.bgColor, color: item.color }}
            >
              <SummaryIcon name={item.icon} />
            </div>
            <span className={`summary-card__trend summary-card__trend--${item.trend}`}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                {item.trend === 'up' ? (
                  <path d="M6 2L10 7H2L6 2Z" fill="currentColor" />
                ) : (
                  <path d="M6 10L2 5H10L6 10Z" fill="currentColor" />
                )}
              </svg>
              {item.change}
            </span>
          </div>
          <div className="summary-card__body">
            <h3 className="summary-card__value">{item.value}</h3>
            <p className="summary-card__title">{item.title}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;