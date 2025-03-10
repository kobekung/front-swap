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
  const [replyText, setReplyText] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);  
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
  const handleReply = async (parentId) => {
    if (!replyText[parentId]?.trim()) return;
  
    try {
      const response = await axios.post(
        `http://localhost:3001/comments/reply/${parentId}`,
        {
          user_id: userId,
          product_id: id,
          content: replyText[parentId],
        }
      );
  
      setComments(comments.map(comment =>
        comment.id === parentId
          ? { ...comment, replies: [...(comment.replies || []), response.data] }
          : comment
      ));
  
      setReplyText({ ...replyText, [parentId]: '' });
      setReplyingTo(null);
    } catch (error) {
      console.error('Error replying to comment:', error);
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
          ย้อนกลับ
        </Button>
        <h2>{product?.name}</h2>
        <img
          src={product?.image || '/default-product.png'}
          alt={product?.name}
          className="product-detail-image"
        />
        <div className="product-detail-info">
          <p><span>รายละเอียดสินค้า:</span> {product?.description}</p>
          <p><span>ราคาประเมิน:</span> {product?.price}</p>
          <p>
            <span>สถานะสินค้า : </span>
            {product?.status === 'available' ? 'พร้อมแลก' : 'แลกแล้ว'}
          </p>
          <p><span>โพสต์สินค้าโดย:</span> {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p>
        </div>

        <div className="product-detail-actions">
          <Button type="primary" onClick={() => handleExchangeClick(product)}>
            เสนอแลก
          </Button>
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          <h3>คอมเมนต์</h3>
          <TextArea
            className="comment-textarea"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            rows={4}
          />
          <Button type="primary" onClick={handleAddComment}>
            เพิ่มคอมเมนต์
          </Button>

          <List
              itemLayout="vertical"
              dataSource={comments}
              renderItem={(comment) => (
                <List.Item>
                  {/* คอมเมนต์หลักที่ไม่มี parentId */}
                  {!comment.parent && (
                    <>
                      <List.Item.Meta
                        avatar={<Avatar src={comment.user?.profilePicture || '/default-user.png'} />}
                        title={
                          <span>
                            {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown'}
                            <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
                              {new Date(comment.createdAt).toLocaleString()}
                            </span>
                          </span>
                        }
                        description={comment.content}
                      />
                      
                      {/* ปุ่มตอบกลับสำหรับคอมเมนต์หลัก */}
                      <Button type="link" onClick={() => setReplyingTo(comment.id)}>ตอบกลับ</Button>
                    </>
                  )}

                  {/* กล่องพิมพ์ข้อความสำหรับตอบกลับ */}
                  {replyingTo === comment.id && (
                    <div style={{ marginTop: 5, paddingLeft: 40 }}>
                      <TextArea
                        value={replyText[comment.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                        rows={2}
                      />
                      <Button type="primary" onClick={() => handleReply(comment.id)} style={{ marginTop: 5 }}>
                        ตอบกลับ
                      </Button>
                    </div>
                  )}

                  {/* แสดง reply ของคอมเมนต์นี้ */}
                  {comment.replies && comment.replies.length > 0 && (
                    <List
                      itemLayout="horizontal"
                      dataSource={comment.replies}
                      renderItem={(reply) => (
                        <List.Item style={{ paddingLeft: 40 }}>
                          <List.Item.Meta
                            avatar={<Avatar src={reply.user?.profilePicture || '/default-user.png'} />}
                            title={
                              <span>
                                {reply.user ? `${reply.user.firstName} ${reply.user.lastName}` : 'Unknown'}
                                <span style={{ marginLeft: 8, fontSize: 12, color: '#999' }}>
                                  {new Date(reply.createdAt).toLocaleString()}
                                </span>
                              </span>
                            }
                            description={reply.content}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </List.Item>
              )}
        />
        </div>
      </div>
    </div>

  );
};

export default ProductDetail;
