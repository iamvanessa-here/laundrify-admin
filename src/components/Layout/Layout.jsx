import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import './Layout.css';

/* --- PERUBAHAN: Hapus props title dan subtitle --- */
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="layout__main">
        <Header onMenuClick={toggleSidebar} />
        <main className="layout__content">
          {children}
        </main>
      </div>
      {sidebarOpen && <div className="layout__overlay" onClick={closeSidebar} />}
    </div>
  );
};

export default Layout;