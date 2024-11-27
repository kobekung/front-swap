import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Header.css';

const Header = ({
  searchProduct,
  onSearchChange,
  categories,
  onCategoryChange,
  onOfferClick,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <img
        className="logo"
        src="https://cdn.gencraft.com/prod/user/40a3fc59-033c-422d-8852-277e603ed706/b7156f5d-fcd8-43e1-b972-fd2516e84059/image/image1_0.jpg?Expires=1726712452&Signature=Fk0FmdQh~4F6EEj5vfKe-2vsbtWzY7VodX10-NAzWoid~AhqakMOZl3STkz32q9TZgCcNcAo8ClEKKkumMND~raQQOjD7ecftC0olWIdtwzwouNxwX~ChHo49J6uopL7RUdv19hzoIoY8CHUDdv1fwOqPEGmQjjS1JdKOPZmF5WFNTcDoqqFDUFMQGgBAMq2gAWEvlxRF6yYaQPSBZkdNotbOiYE1DIRwqKAq3bMMEpuEdbgmTophvJeuHlPwzROyiENRIg2cJmpfRFlSQP~CtwHJYfr7J-Wl67pLcocEKT02qVDrAagaXzEl2mtHROKAaQ7sK-rFisXoWmDXd~~sw__&Key-Pair-Id=K3RDDB1TZ8BHT8"
        alt="Switch Swap"
        onClick={() => navigate('/')}
      />
      <input
        className="search-bar"
        type="text"
        placeholder="ค้นหา"
        value={searchProduct}
        onChange={onSearchChange}
      />
      <select className="category-select" onChange={onCategoryChange}>
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <div className="menu-icons">
        <button className="icon-btn bell-icon" onClick={onOfferClick} type="button">
          <img
            className="logout-icon"
            src="https://cdn-icons-png.flaticon.com/128/2645/2645890.png"
            alt="Notification Icon"
          />
        </button>
        <button className="icon-btn chat-icon" type="button">
          <img
            className="logout-icon"
            src="https://cdn-icons-png.freepik.com/256/7699/7699178.png?ga=GA1.1.1002826414.1720595920&semt=ais_hybrid"
            alt="Chat Icon"
          />
        </button>
        <button className="icon-btn menu-icon" onClick={onLogout} type="button">
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
