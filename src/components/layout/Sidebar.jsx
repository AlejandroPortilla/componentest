import React from 'react';
import { FaHeart, FaTachometerAlt, FaHistory, FaChartBar, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';
import { Link } from 'react-router-dom';
import '../../styles/Sidebar.css';

const Sidebar = () => {
  const { isCollapsed } = useSidebar();
  const topMenuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Historial', icon: <FaHistory />, path: '/historial' },
    { name: 'Reportes', icon: <FaChartBar />, path: '/reportes' }
  ];

  const bottomMenuItems = [
    { name: 'Ayuda', icon: <FaQuestionCircle />, path: '/ayuda' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <FaHeart className="logo-icon" />
        <span className="logo-text">RespUSI Pabon</span>
      </div>

      {/* Top Menu Section */}
      <div className="sidebar-menu top-menu">
        {topMenuItems.map((item, index) => (
          <Link key={index} to={item.path} className="menu-item">
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Bottom Menu Section */}
      <div className="sidebar-menu bottom-menu">
        {bottomMenuItems.map((item, index) => (
          <Link key={index} to={item.path} className="menu-item">
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-text">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
