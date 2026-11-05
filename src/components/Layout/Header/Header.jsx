import React from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const location = useLocation();

  const getPageName = () => {
    if (location.pathname === '/pesanan') return 'Pesanan';
    if (location.pathname === '/layanan') return 'Layanan';
    if (location.pathname === '/pelanggan') return 'Pelanggan';
    return 'Ringkasan';
  };

  const pageName = getPageName();
  const dynamicGreeting = `${pageName} · Selamat datang kembali, Admin`;

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="header__title-group">
          <h1 className="header__title">{pageName}</h1>
          <p className="header__subtitle">{dynamicGreeting}</p>
        </div>
      </div>

      <div className="header__right">
        {/* --- PERUBAHAN: Icon notification dan panel dropdown sudah dihapus --- */}

        <div className="header__profile">
          <div className="header__profile-avatar">AD</div>
          <div className="header__profile-info">
            <span className="header__profile-name">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;