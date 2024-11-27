import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../components/ProductForm';
import OfferForm from '../components/OfferForm';
import OffersDetail from '../components/OfferDetails';
import Header from '../components/Header';
import '../css/MainPage.css';
import FollowersSection from '../components/FollowersSection';

const MainPage = () => {
  const { id } = useParams();
  const { name } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    profilePicture: '',
    role: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedProduct,  setSelectedProduct] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [showOffersDetail, setShowOffersDetail] = useState(false);
  const [dropdownProductId, setDropdownProductId] = useState(null); // New state for dropdown menu
  const [searchProduct, setSearchProduct] = useState(''); // Renamed state for consistency
  const [filteredProducts, setFilteredProducts] = useState([]); // New state for filtered products
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, productsResponse, followersResponse, SearchProductResponse,categoriesResponse] = await Promise.all([
          axios.get(`http://localhost:3001/users/${id}`),
          axios.get('http://localhost:3001/products'),
          axios.get(`http://localhost:3001/follow/${id}/followers`),
          axios.get(`http://localhost:3001/products/name/${name}`),
          axios.get('http://localhost:3001/categories')
        ]);
        setUser(userResponse.data);
        setIsAdmin(userResponse.data.role === 'admin');
        setProducts(productsResponse.data);
        setFilteredProducts(productsResponse.data); // Initialize filtered products
        setFollowers(followersResponse.data);
        setSearchProduct(SearchProductResponse.data);
        setCategories(categoriesResponse.data);
        console.log('Profile User:', userResponse.data); // Log profile user details
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        console.log('Data fetched successfully');
      }
    };

    if (id) fetchData();
  }, [id]);
  useEffect(() => {
    let filtered = products;
    if (selectedCategory) {
      filtered = products.filter(product =>
        product.category && product.category.id === selectedCategory.id
      );
    }
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchProduct, products, selectedCategory]);
  

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchProduct, products]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const handleProfileClick = (profileId) => {
    console.log('Profile Clicked ID:', profileId);
    navigate(`/profile/${profileId}`);
  };

  const toggleProductForm = () => {
    setShowProductForm(prev => !prev);
  };

  const handleCloseProductForm = () => {
    setShowProductForm(false);
  };

  const handleExchangeClick = (product) => {
    setSelectedProduct(product);
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setSelectedProduct(null);
  };

  const handleOfferClick = () => {
    setShowOffersDetail(true);
  };

  const handleCloseOffersDetail = () => {
    setShowOffersDetail(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}?userId=${id}`);
  };
  const handleAdminClick = () => {  
    navigate(`/admin/${id}`);
  };

  const handleReportProduct = async (productId) => {
    try {
      await axios.post(`http://localhost:3001/products/${productId}/report`);
      alert('Product reported successfully');
    } catch (error) {
      console.error('Error reporting product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3001/products/${productId}`);
      setProducts(products.filter(product => product.id !== productId));
      setFilteredProducts(filteredProducts.filter(product => product.id !== productId)); // Update filtered products
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value, 10);
    const selected = categories.find(cat => cat.id === categoryId);
    setSelectedCategory(selected || null);
  };
  

  const handleSearchChange = (event) => {
    setSearchProduct(event.target.value);
  };


  return (
    <div className="main-page">
     <Header
        searchProduct={searchProduct}
        handleSearchChange={handleSearchChange}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
        handleOfferClick={handleOfferClick}
        handleLogout={handleLogout}
      />

      <div className="content">
        <div className="sidebar">
          <div className="profile-container">
            <button className="profile-btn1" onClick={() => handleProfileClick(id)}>
              <img 
                src={user.profilePicture || '/default-profile.png'} 
                alt="Profile" 
                className="profile-image1" 
              />
            </button>
            <div className="user-name" onClick={() => handleProfileClick(id)}>{user.firstName + ' ' + user.lastName}</div>
          </div>
          {/* If the user is an admin, display a link to admin management page */}
          {isAdmin && (
              <div className="admin-link" onClick={handleAdminClick}>
                <img className="admin-icon" src="https://cdn-icons-png.flaticon.com/512/78/78948.png" alt="Admin Icon" />
                <p className="admin-link" >Admin Management</p>
              </div>
            )}
        </div>

        <div className="products-section">
          {showProductForm && <ProductForm userId={id} onClose={handleCloseProductForm} />}

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

          {filteredProducts.map((product) => (
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
                )
                }
                {user.id === product.user.id && (
                  <button className="exchange-btn" onClick={(e) => {
                    e.preventDefault();
                    alert('ไม่สามารถแลกกับสินค้าตัวเองได้!');
                  }}>Exchange</button>
                )
                }
              </div>
            </div>
          ))}

          {showOfferForm && selectedProduct && (
            <OfferForm 
              productId={selectedProduct.id} 
              fromUserId={id} 
              toUserId={selectedProduct.user.id} 
              onClose={handleCloseOfferForm} 
            />
          )}

          {showOffersDetail && (
            <OffersDetail 
              userId={id} 
              onClose={handleCloseOffersDetail} 
            />
          )}
        </div>
          <FollowersSection followers={followers} handleProfileClick={handleProfileClick} />
      </div>
    </div>
  );
};

export default MainPage;
