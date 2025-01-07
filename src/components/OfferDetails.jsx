import React, { useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import axios from 'axios';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import '../css/OffersDetail.css'; // Ensure the path is correct
import Chat from '../pages/ChatPage'; // Import the Chat component
const { confirm } = Modal;

const OffersDetail = ({ userId, productId, onClose }) => {
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('received'); // New state to toggle between views
  const [activeChatProductId, setActiveChatProductId] = useState(null); // Track the active product chat
  const [isChatOpen, setIsChatOpen] = useState(false); // Track whether chat is open
  const [chatUserId, setChatUserId] = useState(null); // Store the ID of the user to chat with
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const receivedResponse = await axios.get(`http://localhost:3001/offers/receiver/${userId}`);
        setReceivedOffers(receivedResponse.data);
      } catch (error) {
        console.error('Error fetching received offers:', error);
      }
    
      try {
        const sentResponse = await axios.get(`http://localhost:3001/offers/sent/${userId}`);
        setSentOffers(sentResponse.data);
      } catch (error) {
        console.error('Error fetching sent offers:', error);
      }
    
      setLoading(false);
    };
    
    if (userId) fetchOffers();
  }, [userId]);

  const handleAccept = (offerId) => {
    confirm({
      title: 'Confirm Acceptance',
      icon: <ExclamationCircleOutlined />,
      content: 'คุณต้องการจะยอมรับข้อเสนอนี้ไหม?',
      okText: 'ใช่',
      okType: 'primary',
      cancelText: 'ไม่ใช่',
      onOk: async () => {
        try {
          // Make API call to accept offer
          await axios.post('http://localhost:3001/offers/accept', { offerId });
  
          // Update offers state
          setReceivedOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.id === offerId ? { ...offer, status: 'ACCEPTED' } : offer
            )
          );
  
          // Success message
          message.success('Offer accepted successfully!');
        } catch (error) {
          console.error('Error accepting offer:', error);
  
          // Error message
          message.error('Failed to accept the offer. Please try again.');
        }
      },
      onCancel: () => {
        message.info('Offer acceptance cancelled.');
      },
    });
  };

  const handleReject = (offerId) => {
    confirm({
      title: 'Confirm Rejection',
      icon: <ExclamationCircleOutlined />,
      content: 'คุณต้องการจะปฏิเสธข้อเสนอนี้ไหม?',
      okText: 'ใข่',
      okType: 'danger',
      cancelText: 'ไม่ใช่',
      onOk: async () => {
        try {
          await axios.post('http://localhost:3001/offers/reject', { offerId });
          setReceivedOffers((prevOffers) =>
            prevOffers.map((offer) =>
              offer.id === offerId ? { ...offer, status: 'REJECTED' } : offer
            )
          );
          message.success('Offer rejected successfully!');
        } catch (error) {
          console.error('Error rejecting offer:', error);
          message.error('Failed to reject the offer. Please try again.');
        }
      },
      onCancel: () => {
        message.info('Offer rejection cancelled.');
      },
    });
  };

  const handleDeliveryTypeUpdate = async (offerId, deliveryType) => {
    try {
      await axios.post(`http://localhost:3001/offers/update-delivery-type`, {
        offerId,
        deliveryType,
      });
      setReceivedOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === offerId ? { ...offer, deliveryType } : offer
        )
      );
    } catch (error) {
      console.error('Error updating delivery type:', error);
    }
  };

  const handleMarkAsCompleted = async (productId) => {
    try {
      const response = await fetch('http://localhost:3001/products/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to mark as completed');
      }
  
      const data = await response.json();
      console.log('Product marked as completed:', data);
      setIsCompleted(true);  // Update the state to trigger a re-render
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const openChat = (offer) => {
    // If the clicked offer has the same productId as the active chat, don't open a new chat
    if (offer.product.id === activeChatProductId) {
      return;
    }
    setChatUserId(offer.fromUser.id);
    setActiveChatProductId(offer.product.id); // Set the current productId as active chat
    setIsChatOpen(true); // Open the chat modal
  };

  const closeChat = () => {
    setIsChatOpen(false); // Close the chat modal
    setChatUserId(null); // Reset the chat user
    setActiveChatProductId(null); // Reset the active productId for chat
  };

  const confirmAction = (content, onConfirm) => {
    confirm({
      title: 'ยืนยันการเลือก',
      icon: <ExclamationCircleOutlined />,
      content: content,
      okText: 'ใช่',
      cancelText: 'ไม่ใช่',
      onOk: async () => {
        try {
          await onConfirm(); // Execute the action passed
          message.success('ดำเนินการสำเร็จ!');
        } catch (error) {
          console.error('Error executing action:', error);
          message.error('เกิดข้อผิดพลาดในการดำเนินการ');
        }
      },
      onCancel: () => {
        message.info('การดำเนินการถูกยกเลิก');
      },
    });
  };

  return (
    <div className="offers-detail">
      <button className="close-btn" onClick={onClose}>×</button>
      <h2>ข้อเสนอของคุณ</h2>
      {error && <div className="error-message">{error}</div>}

      {/* Buttons to toggle between Received and Sent Offers */}
      <div className="offer-toggle-buttons">
        <button
          onClick={() => setView('received')}
          className={view === 'received' ? 'active' : ''}
        >
          ข้อเสนอที่ได้รับ
        </button>
        <button
          onClick={() => setView('sent')}
          className={view === 'sent' ? 'active' : ''}
        >
          ข้อเสนอที่คุณส่ง
        </button>
      </div>

      {/* Conditional Rendering Based on 'view' state */}
      {view === 'received' && (
        <>
          <h3>ข้อเสนอที่ได้รับ</h3>
          {receivedOffers.length === 0 ? (
            <p>No received offers found.</p>
          ) : (
            <ul>
              {receivedOffers.map((offer) => (
                <li key={offer.id} className="offer-card">
                  <div className="offer-info-container">
                    <div className="offer-info">
                      <img
                        src={offer.fromUser.profilePicture}
                        alt={`${offer.fromUser.firstName} ${offer.fromUser.lastName}`}
                        className="profile-pic"
                      />
                      <span>
                        {offer.fromUser.firstName} {offer.fromUser.lastName} ต้องการแลก{' '}
                        <strong>{offer.name}</strong> กับ{' '}
                        <strong>{offer.product.name} </strong>ของคุณ.
                      </span>
                    </div>
                    <div className="product-info">
                      <img
                        className="offer-product-image"
                        src={offer.image}
                        alt={offer.name}
                      />
                      <img
                        className="offer-product-image"
                        src={offer.product.image}
                        alt={offer.product.name}
                      />
                    </div>
                  </div>
                  <div className={`offer-status ${offer.status.toLowerCase()}`}>
                    สถานะข้อเสนอ: {offer.status}
                  </div>
                  {offer.status === 'PENDING' && (
                    <div className="offer-actions">
                      <button onClick={() => handleAccept(offer.id)}>ยอมรับ</button>
                      <button onClick={() => handleReject(offer.id)}>ปฏิเสธ</button>
                    </div>
                  )}
                  {offer.status === 'ACCEPTED' && (
                    <div className="chat-actions">
                      <button onClick={() => openChat(offer)}>แชท</button>
                      {!offer.deliveryType && ( // Only show the delivery buttons if no delivery type is selected
                        <div className="button-container">
                          <button
                            className="btn"
                            onClick={() =>
                              confirmAction(
                                'คุณต้องการเลือกการจัดส่งแบบตัวต่อตัวหรือไม่?',
                                () => handleDeliveryTypeUpdate(offer.id, 'IN_PERSON')
                              )
                            }
                          >
                            ตัวต่อตัว
                          </button>
                          <button
                            className="btn"
                            onClick={() =>
                              confirmAction(
                                'คุณต้องการเลือกการจัดส่งแบบไปรษณีหรือไม่?',
                                () => handleDeliveryTypeUpdate(offer.id, 'REMOTE')
                              )
                            }
                          >
                            ไปรษณี
                          </button>
                        </div>
                      )}
                      {offer.deliveryType && (
                        <div>
                          <button
                            className="btn-complete"
                            onClick={() =>
                              confirmAction(
                                'คุณต้องการยืนยันว่าคุณได้รับของแล้วหรือไม่?', 
                                () => handleMarkAsCompleted(offer.product.id)
                              )
                            }
                          >
                            {isCompleted || offer.product.status === 'complete' 
                              ? 'แลกสำเร็จ' 
                              : 'ยืนยันว่าได้รับของแล้ว'}
                          </button>

                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {view === 'sent' && (
        <>
          <h3>ข้อเสนอที่คุณส่ง</h3>
          {sentOffers.length === 0 ? (
            <p>No sent offers found.</p>
          ) : (
            <ul>
              {sentOffers.map((offer) => (
                <li key={offer.id} className="offer-card">
                  <div className="offer-info-container">
                    <div className="offer-info">
                      <img
                        src={offer.toUser.profilePicture}
                        alt={`${offer.toUser.firstName} ${offer.toUser.lastName}`}
                        className="profile-pic"
                      />
                      <span>
                        {offer.toUser.firstName} {offer.toUser.lastName} ยอมรับข้อเสนอ{' '}
                        <strong>{offer.name}</strong> แลกกับ{' '}
                        <strong>{offer.product.name}</strong>
                      </span>
                    </div>
                    <div className="product-info">
                      <img
                        className="offer-product-image"
                        src={offer.image}
                        alt={offer.name}
                      />
                      <img
                        className="offer-product-image"
                        src={offer.product.image}
                        alt={offer.product.name}
                      />
                    </div>
                  </div>
                  <div className={`offer-status ${offer.status.toLowerCase()}`}>
                    สถานะข้อเสนอ: {offer.status}
                  </div>
                  
                  {offer.status === 'ACCEPTED' && (
                    <div className="chat-actions">
                      <button onClick={() => openChat(offer)}>แชท</button>
                  {offer.deliveryType && (
                        <div>
                          <button
                            className="btn-complete"
                            onClick={() =>
                              confirmAction(
                                'คุณต้องการยืนยันว่าคุณได้รับของแล้วหรือไม่?', 
                                () => handleMarkAsCompleted(offer.product.id)
                              )
                            }
                          >
                            {isCompleted || offer.product.status === 'complete' 
                              ? 'แลกสำเร็จ' 
                              : 'ยืนยันว่าได้รับของแล้ว'}
                          </button>
                        </div>
                      )}
                    </div>
                    )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {isChatOpen && activeChatProductId && (
        <Chat 
          fromUserId={userId} 
          toUserId={chatUserId} 
          productId={activeChatProductId} 
          onClose={closeChat} 
        />
      )}
    </div>
  );
};

export default OffersDetail;
