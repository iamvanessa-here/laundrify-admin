import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ onMenuClick }) => {
  const location = useLocation();
  
  const getPageName = () => {
    if (location.pathname === '/pesanan') return 'Pesanan';
    return 'Ringkasan';
  };

  const pageName = getPageName();
  const dynamicGreeting = `Selamat datang kembali, Admin`; // --- PERUBAHAN: Format sapaan dinamis ---

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu-btn" onClick={onMenuClick}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        <div className="header__title-group">
          {/* --- PERUBAHAN: Gunakan variabel dinamis --- */}
          <h1 className="header__title">{pageName}</h1>
          <p className="header__subtitle">{dynamicGreeting}</p>
        </div>
      </div>

      <div className="header__right">
        {/* Search bar global TIDAK dimunculkan kembali di sini */}
        
        <button className="header__notification">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C7.239 2 5 4.239 5 7V11L3 14H17L15 11V7C15 4.239 12.761 2 10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M8 16C8 17.105 8.895 18 10 18C11.105 18 12 17.105 12 16" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span className="header__notification-badge">3</span>
        </button>

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