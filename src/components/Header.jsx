import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/MainPage.css';

const Header = ({ searchProduct, handleSearchChange, handleCategoryChange, categories, handleOfferClick, handleLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <img
        className="logo"
        src="https://images.scalebranding.com/stylish-cool-wolf-logo-b993bf0f-1bea-4f1f-8687-aa1a2f24c204.jpg"
        alt="Switch Swap"
      />
      <input
        className="search-bar"
        type="text"
        placeholder="ค้นหา"
        value={searchProduct}
        onChange={handleSearchChange}
      />
      <select className="category-select" onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="menu-icons">
        <button className="icon-btn bell-icon" onClick={handleOfferClick} type="button">
          <img
            className="logout-icon"
            src="https://cdn-icons-png.flaticon.com/128/2645/2645890.png"
            alt="Notification Icon"
          />
        </button>
        <button className="icon-btn menu-icon" onClick={handleLogout} type="button">
          <img
            className="logout-icon"
            src="https://cdn-icons-png.freepik.com/256/10024/10024508.png?ga=GA1.1.1002826414.1720595920&semt=ais_hybrid"
            alt="Menu Icon"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
