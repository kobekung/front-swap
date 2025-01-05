// src/components/ProductsSection.js
import React from 'react';
import ProductForm from './ProductForm';
import OfferForm from './OfferForm';
import OffersDetail from './OfferDetails';

const ProductsSection = ({ 
  user, 
  filteredProducts, 
  showProductForm, 
  toggleProductForm, 
  handleReportProduct, 
  handleDeleteProduct, 
  handleExchangeClick, 
  selectedProduct, 
  showOfferForm, 
  handleCloseOfferForm, 
  showOffersDetail, 
  handleCloseOffersDetail, 
  dropdownProductId, 
  setDropdownProductId,
  searchProduct,
  handleProductClick,
  handleProfileClick
}) => {
  return (
    <div className="products-section">
      {showProductForm && <ProductForm userId={user.id} onClose={toggleProductForm} />}

      <div className="post-area">
        <div className="post-input">
          <img 
            src={user.profilePicture || '/default-profile.png'} 
            alt="Profile" 
            className="profile-image" 
          />
          <input 
            onClick={toggleProductForm}
            style={{ cursor: 'pointer' }}
            type="text" 
            placeholder={`ต้องการโพสต์สินค้าไหม, ${user.firstName}?`} 
            readOnly 
          />
        </div>
      </div>

      {filteredProducts
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // เรียงลำดับจากใหม่ไปเก่า
        .map((product) => (
          <div className="product-card" key={product.id}>
            <div className="dropdown-menu">
              <button 
                className="dropdown-btn" 
                onClick={() => setDropdownProductId(dropdownProductId === product.id ? null : product.id)}
              >
                ⋮
              </button>
              {dropdownProductId === product.id && (
                <div className="dropdown-content">
                  <button onClick={() => handleReportProduct(product.id)}>Report</button>
                  {user.id === product.user.id && (
                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                  )}
                </div>
              )}
            </div>
            <div className="product-name">{product.name}</div>
            <div className="product-owner">
              {new Date(product.createdAt).toLocaleString()}
              {product.user ? (
                <div className="owner-info">
                  <img 
                    src={product.user.profilePicture || '/default-profile.png'} 
                    alt={product.user.firstName}
                    className="owner-image"
                    onClick={() => handleProfileClick(product.user.id)}
                  />
                  <span className="owner-name">{product.user.firstName}</span>
                  <span className={`product-status ${product.status.toLowerCase()}`}>{product.status}</span>
                  <span className="product-name">{product.name}</span>
                </div>
              ) : 'Unknown'}
            </div>
            <img 
              src={product.image || '/default-product.png'}
              alt={product.name} 
              className="product-image"
              onClick={() => handleProductClick(product.id)} // Handle product click
            />
            <div className="product-actions">
              <button className="comment-btn" onClick={() => handleProductClick(product.id)}>Comment</button>
              <span>ราคาประเมิน {product.price} บาท</span>
              {user.id !== product.user.id && (
                <button className="exchange-btn" onClick={() => handleExchangeClick(product)}>Exchange</button>
              )}
              {user.id === product.user.id && (
                <button className="exchange-btn" onClick={(e) => {
                  e.preventDefault();
                  alert('ไม่สามารถแลกกับสินค้าตัวเองได้!');
                }}>Exchange</button>
              )}
            </div>
          </div>
        ))}


      {showOfferForm && selectedProduct && (
        <OfferForm 
          productId={selectedProduct.id} 
          fromUserId={user.id} 
          toUserId={selectedProduct.user.id} 
          onClose={handleCloseOfferForm} 
        />
      )}

      {showOffersDetail &&  (
        <OffersDetail 
          userId={user.id} 
          productId={user.productId}
          onClose={handleCloseOffersDetail} 
        />
      )}
    </div>
  );
};

export default ProductsSection;
