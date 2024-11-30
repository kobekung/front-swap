import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/MainPage.css';
import FollowersSection from '../components/FollowersSection';
import Sidebar from '../components/Sidebar';
import ProductsSection from '../components/ProductsSection';

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
  const [isLoading, setIsLoading] = useState(true);


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
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div> {/* Add a spinner */}
      </div>
    );
  }

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
      <Sidebar 
          user={user} 
          isAdmin={isAdmin} 
          handleProfileClick={handleProfileClick} 
          handleAdminClick={handleAdminClick} 
        />
      <ProductsSection 
          user={user}
          filteredProducts={filteredProducts}
          showProductForm={showProductForm}
          toggleProductForm={toggleProductForm}
          handleReportProduct={handleReportProduct}
          handleDeleteProduct={handleDeleteProduct}
          handleExchangeClick={handleExchangeClick}
          selectedProduct={selectedProduct}
          showOfferForm={showOfferForm}
          handleCloseOfferForm={handleCloseOfferForm}
          showOffersDetail={showOffersDetail}
          handleCloseOffersDetail={handleCloseOffersDetail}
          dropdownProductId={dropdownProductId}
          setDropdownProductId={setDropdownProductId}
          searchProduct={searchProduct}
          handleProductClick={handleProductClick}
          handleProfileClick={handleProfileClick}
        />
          <FollowersSection followers={followers} handleProfileClick={handleProfileClick} />
      </div>
    </div>
  );
};

export default MainPage;
