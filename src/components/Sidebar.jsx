// src/components/Sidebar.js
import React from 'react';

const Sidebar = ({ user, isAdmin, handleProfileClick, handleAdminClick }) => {
  return (
    <div className="sidebar">
      <div className="profile-container">
        <button className="profile-btn1" onClick={() => handleProfileClick(user.id)}>
          <img 
            src={user.profilePicture || '/default-profile.png'} 
            alt="Profile" 
            className="profile-image1" 
          />
        </button>
        <div className="user-name" onClick={() => handleProfileClick(user.id)}>
          {user.firstName + ' ' + user.lastName}
        </div>
      </div>
      {/* If the user is an admin, display a link to admin management page */}
      {isAdmin && (
        <div className="admin-link" onClick={handleAdminClick}>
          <img 
            className="admin-icon" 
            src="https://cdn-icons-png.flaticon.com/512/78/78948.png" 
            alt="Admin Icon" 
          />
          <p className="admin-link">Admin Management</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
