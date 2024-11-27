import React from 'react';
import '../css/Sidebar.css';
import { FaBookmark, FaCog, FaSearch } from 'react-icons/fa';

const Sidebar = ({ user, isAdmin, handleProfileClick, handleAdminClick }) => {
  return (
    <div className="sidebar">
      <div className="profile-container">
        <button className="profile-btn" onClick={() => handleProfileClick(user.id)}>
          <img 
            src={user.profilePicture || '/default-profile.png'} 
            alt="Profile" 
            className="profile-image" 
          />
        </button>
        <div className="user-info" onClick={() => handleProfileClick(user.id)}>
          <div className="user-name">{user.firstName} {user.lastName}</div>
          <div className="user-role">{user.role}</div>
        </div>
      </div>
      {/* If the user is an admin, display a link to admin management page */}
      {isAdmin && (
        <div className="admin-link" onClick={handleAdminClick}>
          <FaCog className="admin-icon" />
          <span className="admin-link-text">Admin Management</span>
        </div>
      )}
      <div className="sidebar-nav">
        <div className="nav-item">
          <FaSearch className="nav-icon" />
          <span className="nav-text">Search</span>
        </div>
        <div className="nav-item">
          <FaBookmark className="nav-icon" />
          <span className="nav-text">Bookmarks</span>
        </div>
        <div className="nav-item">
          <FaCog className="nav-icon" />
          <span className="nav-text">Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
