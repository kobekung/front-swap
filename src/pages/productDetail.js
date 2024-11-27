import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/ProductDetail.css'; // Add your product detail styles
import OfferForm from '../components/OfferForm';

const ProductDetail = () => {
  const { id } = useParams(); // productId
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentText, setCommentText] = useState(''); // To manage the comment text

  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('userId'); // To get the userId from URL params

  // Fetch product details, user information, and comments
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);
        if (response.data.user) {
          setUser(response.data.user);
        } else if (response.data.userId) {
          // Fetch user details separately if not included
          const userResponse = await axios.get(`http://localhost:3001/users/${response.data.userId}`);
          setUser(userResponse.data);
        }

        // Fetch comments
        const commentsResponse = await axios.get(`http://localhost:3001/comments/product?product_id=${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (id) fetchProductDetail();
  }, [id]);

  const handleClose = () => {
    navigate(-1); // Navigate back to the main page with the stored userId
  };

  const handleExchangeClick = (product) => {
    setSelectedProduct(product);
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setSelectedProduct(null);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post('http://localhost:3001/comments/create', {
        user_id: userId, // Replace with the actual logged-in user's ID
        product_id: id,
        content: commentText,
      });

      setComments([response.data, ...comments]); // Add new comment to the list
      setCommentText(''); // Clear the input field
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="product-detail-modal">
      <div className="modal-content">
        <span className="close-button" onClick={handleClose}>&times;</span>
        <h2>{product?.name}</h2>
        <img src={product?.image || '/default-product.png'} alt={product?.name} className="product-detail-image" />
        <p>description: {product?.description}</p>
        <p>Price: {product?.price}</p>
        <p>Status: {product?.status}</p>
        <p>Posted by: {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p>

        <div className="product-actions">
          <button className="exchange-btn" onClick={() => handleExchangeClick(product)}>Exchange</button>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
  <h3>Comments</h3>
  
  {/* Textarea for adding new comment */}
  <textarea
    value={commentText}
    onChange={(e) => setCommentText(e.target.value)}
    placeholder="Write a comment..."
  />
  <button onClick={handleAddComment}>Add Comment</button>

  {/* Display comments */}
  {comments.length === 0 ? (
    <p>No comments yet.</p>
  ) : (
    comments.map((comment) => (
      <div key={comment.id} className="comment-card">
        {/* User profile picture */}
        <img 
          src={comment.user?.profilePicture || '/default-user.png'} 
          alt={comment.user?.firstName} 
          className="profile-pic" 
        />
        
        {/* Comment content */}
        <div className="comment-content">
          <p className="comment-author">
            {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown'}
          </p>
          <p className="comment-timestamp">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <p className="comment-text">
            {comment.content}
          </p>
          
          {/* Optional Like and Reply buttons */}
          <div className="comment-actions">
            <button>Like</button>
            <button>Reply</button>
          </div>
        </div>
      </div>
    ))
  )}
</div>


        {/* Offer form modal */}
        {showOfferForm && selectedProduct && (
          <OfferForm 
            productId={selectedProduct.id} 
            fromUserId={userId} 
            toUserId={selectedProduct.user.id} 
            onClose={handleCloseOfferForm} 
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
