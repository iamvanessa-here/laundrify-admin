import React from 'react';
import SummaryCards from '../../components/Dashboard/SummaryCards/SummaryCards';
import RevenueChart from '../../components/Dashboard/RevenueChart/RevenueChart';
import OrderStatus from '../../components/Dashboard/OrderStatus/OrderStatus';
import RecentOrders from '../../components/Dashboard/RecentOrders/RecentOrders';
import PopularServices from '../../components/Dashboard/PopularServices/PopularServices';
import CustomerActivity from '../../components/Dashboard/CustomerActivity/CustomerActivity';
import './Ringkasan.css';

const Ringkasan = () => {
  return (
    <div className="ringkasan">
      {/* Summary Cards */}
      <SummaryCards />

      {/* Charts Row */}
      <div className="ringkasan__charts-row">
        <RevenueChart />
        <OrderStatus />
      </div>

      {/* Recent Orders Table */}
      <RecentOrders />

      {/* Bottom Row */}
      <div className="ringkasan__bottom-row">
        <PopularServices />
        <CustomerActivity />
      </div>
    </div>
  );
};

export default Ringkasan;