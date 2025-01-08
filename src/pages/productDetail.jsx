import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, List, Avatar } from 'antd'; // Import Ant Design components
import OfferForm from '../components/OfferForm';
import '../css/ProductDetail.css';

const { TextArea } = Input;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [commentText, setCommentText] = useState('');

  const queryParams = new URLSearchParams(window.location.search);
  const userId = queryParams.get('userId');

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/${id}`);
        setProduct(response.data);

        if (response.data.user) {
          setUser(response.data.user);
        } else if (response.data.userId) {
          const userResponse = await axios.get(`http://localhost:3001/users/${response.data.userId}`);
          setUser(userResponse.data);
        }

        const commentsResponse = await axios.get(`http://localhost:3001/comments/product?product_id=${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    if (id) fetchProductDetail();
  }, [id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await axios.post('http://localhost:3001/comments/create', {
        user_id: userId,
        product_id: id,
        content: commentText,
      });

      setComments([response.data, ...comments]);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleClose = () => navigate(-1);

  const handleExchangeClick = (product) => {
    setSelectedProduct(product);
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setSelectedProduct(null);
  };

  return (
    <div className="product-detail-modal">
      <div className="modal-content">
        <Button type="text" onClick={handleClose} style={{ marginBottom: 16 }}>
          Back
        </Button>
        <h2>{product?.name}</h2>
        <img
          src={product?.image || '/default-product.png'}
          alt={product?.name}
          className="product-detail-image"
        />
        <div className="product-detail-info">
          <p><span>Description:</span> {product?.description}</p>
          <p><span>Price:</span> {product?.price}</p>
          <p><span>Status:</span> {product?.status}</p>
          <p><span>Posted by:</span> {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p>
        </div>

        <div className="product-detail-actions">
          <Button type="primary" onClick={() => handleExchangeClick(product)}>
            Exchange
          </Button>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>Comments</h3>
          <TextArea
            className="comment-textarea"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
          />
          <Button type="primary" onClick={handleAddComment}>
            Add Comment
          </Button>

          <List
            itemLayout="horizontal"
            dataSource={comments}
            renderItem={(comment) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={comment.user?.profilePicture || '/default-user.png'} />}
                  title={
                    <span>
                      {comment.user
                        ? `${comment.user.firstName} ${comment.user.lastName}`
                        : 'Unknown'}
                      <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </span>
                  }
                  description={comment.content}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>

  );
};

export default ProductDetail;
