import React from 'react';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { useSidebar } from '../../context/SidebarContext';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();

  // const user = localStorage.getItem('user');

  return (
    <div className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="navbar-content">
        {/* Toggle Button */}
        <div className="navbar-left">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isCollapsed ? <FaBars /> : <FaTimes />}
          </button>
        </div>
        
       
        
      </div>
    </div>
  );
};

export default Navbar;
