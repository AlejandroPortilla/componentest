import React from 'react';
import { FaHeart, FaTachometerAlt, FaHistory, FaChartBar, FaQuestionCircle } from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';
import { NavLink } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { isCollapsed } = useSidebar();
  const topMenuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Historial', icon: <FaHistory />, path: '/historial' }
  ];

  const bottomMenuItems = [
    { name: 'Ayuda', icon: <FaQuestionCircle />, path: '/ayuda' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <FaHeart className="logo-icon" />
        <span className="logo-text">RespUSI Pabon</span>
      </div>

      <div className="sidebar-menu top-menu">
        {topMenuItems.map((item, index) => (
          <NavLink key={index} to={item.path} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-menu bottom-menu">
        {bottomMenuItems.map((item, index) => (
          <NavLink key={index} to={item.path} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
