import React from 'react';
import { navigationItems } from '../../../data/mockData';
import SidebarIcon from '../../icons/SidebarIcon';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const activeItem = 'ringkasan';

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#2563EB" />
            <path
              d="M8 14C8 10.686 10.686 8 14 8C17.314 8 20 10.686 20 14C20 17.314 17.314 20 14 20C10.686 20 8 17.314 8 14Z"
              stroke="white"
              strokeWidth="1.5"
            />
            <path
              d="M11 14C11 12.343 12.343 11 14 11C15.657 11 17 12.343 17 14C17 15.657 15.657 17 14 17C12.343 17 11 15.657 11 14Z"
              stroke="white"
              strokeWidth="1.5"
            />
            <circle cx="14" cy="14" r="1" fill="white" />
          </svg>
        </div>
        <span className="sidebar__logo-text">Laundrify</span>
        <button className="sidebar__close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <ul className="sidebar__nav-list">
          {navigationItems.map((item) => (
            <li key={item.id} className="sidebar__nav-item">
              <a
                href={item.path}
                className={`sidebar__nav-link ${activeItem === item.id ? 'sidebar__nav-link--active' : ''}`}
              >
                <SidebarIcon name={item.icon} />
                <span className="sidebar__nav-label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="sidebar__footer">
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">AD</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">Admin Laundrify</span>
            <span className="sidebar__user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;