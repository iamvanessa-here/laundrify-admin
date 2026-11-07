import React, { useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import Header from './Header/Header';
import './Layout.css';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => setSidebarOpen(!sidebarOpen);
  const closeSidebar = (): void => setSidebarOpen(false);

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <div className="layout__main">
        <Header onMenuClick={toggleSidebar} />
        <main className="layout__content">
          {children}
        </main>
      </div>
      
      {/* Close sidebar when clicked outside the bar*/}
      {sidebarOpen && <div className="layout__overlay" onClick={closeSidebar} />}
    </div>
  );
};

export default Layout;