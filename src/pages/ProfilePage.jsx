// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ProfilePage.css'; // Add your profile page styles
import { Button } from 'react-bootstrap';
import ProfileEditForm from '../components/ProfileEditForm'; // Import the ProfileEditForm component

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    profilePicture: '',
  });
  const [products, setProducts] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editForm, setEditForm] = useState({ // State for edit form values
    firstName: '',
    lastName: '',
    nickname: '',
    phoneNumber: '',
    address: '',
    profilePicture: '',
  });

  useEffect(() => {
    // Fetch user profile and products
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${id}`);
        setUser(response.data);
        setEditForm(response.data); // Initialize form with current user data
        console.log('Profile Owner Details:', response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/user/${id}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    };

    fetchUser();
    fetchUserProducts();
  }, [id]);

  useEffect(() => {
    // Fetch current user ID from localStorage
    const fetchCurrentUserId = () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        setCurrentUserId(userId);
        console.log('Logged-In User ID:', userId);
      } else {
        console.warn('No logged-in user ID found in localStorage');
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    // Check following status
    const checkFollowingStatus = async () => {
      if (currentUserId && id) {
        try {
          const response = await axios.get(`http://localhost:3001/follow/${currentUserId}/following/${id}`);
          setIsFollowing(response.data);
        } catch (error) {
          console.error('Error checking follow status:', error);  
        }
      }
    };

    checkFollowingStatus();
  }, [currentUserId, id]);

  const handleFollow = async () => {
    try {
      await axios.post(`http://localhost:3001/follow/${currentUserId}/follow/${id}`);
      setIsFollowing(true);
      alert('Followed successfully');
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(`http://localhost:3001/follow/${currentUserId}/unfollow/${id}`);
      setIsFollowing(false);
      alert('Unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}?userId=${id}`);
  };

  return (
    <div className="profile-page">
      <div className="profile-header bg">
        <div className="profile-header-content">
          <div className="profile-picture-container">
            <img 
              src={user.profilePicture || '/default-profile.png'} 
              alt="Profile" 
              className="profile-image" 
            />
          </div>
          <div className="profile-details">
            <h1>{user.firstName} {user.lastName}</h1>
            <h2>{user.nickname}</h2>
            <div className="profile-actions">
              {currentUserId && currentUserId === id && (
                <Button variant="primary" onClick={handleEditToggle}>Edit Profile</Button>
              )}
              {currentUserId && currentUserId !== id && (
                isFollowing ? (
                  <Button variant="danger" onClick={handleUnfollow}>Unfollow</Button>
                ) : (
                  <Button variant="primary" onClick={handleFollow}>Follow</Button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="profile-info">
        {isEditing ? (
          <ProfileEditForm 
            editForm={editForm}
            handleChange={(e) => {
              const { name, value } = e.target;
              setEditForm(prev => ({ ...prev, [name]: value }));
            }}
            handleSave={async () => {
              try {
                await axios.patch(`http://localhost:3001/users/${id}`, editForm);
                setUser(editForm);
                setIsEditing(false);
              } catch (error) {
                console.error('Error updating profile:', error);
              }
            }}
            handleEditToggle={handleEditToggle}
          />
        ) : (
          <>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phoneNumber}</p>
            <p>Address: {user.address}</p>
            <Button variant="secondary" onClick={handleBack}>Back</Button>
          </>
        )}
      </div>

      <div className="profile-products-section">
        <h2>Products Posted by {user.firstName}</h2>
        {products.length > 0 ? (
          products.map((product) => (
            <div className="profile-product-card" key={product.id} onClick={() => handleProductClick(product.id)}>
              <img 
                src={product.image || '/default-product.png'} 
                alt={product.name} 
                className="profile-product-image" 
              />
              <div className="profile-product-info">
                <h3 className="profile-product-name">{product.name}</h3>
                <span className="profile-product-status" style={{ backgroundColor: getStatusColor(product.status) }}>
                  {product.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No products posted.</p>
        )}
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'available':
      return 'green';
    case 'complete':
      return 'red';
    case 'discontinued':
      return 'blue';
    default:
      return 'gray';
  }
};

export default ProfilePage;