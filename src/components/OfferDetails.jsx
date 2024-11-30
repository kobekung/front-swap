import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/OffersDetail.css'; // Ensure the path is correct

const OffersDetail = ({ userId, onClose }) => {
  const [receivedOffers, setReceivedOffers] = useState([]);
  const [sentOffers, setSentOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('received'); // New state to toggle between views

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const [receivedResponse, sentResponse] = await Promise.all([
          axios.get(`http://localhost:3001/offers/user/${userId}`),
          axios.get(`http://localhost:3001/offers/sent/${userId}`),
        ]);
        setReceivedOffers(receivedResponse.data);
        setSentOffers(sentResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError('Failed to fetch offers. Please try again later.');
        setLoading(false);
      }
    };

    if (userId) fetchOffers();
  }, [userId]);

  const handleAccept = async (offerId) => {
    try {
      await axios.post('http://localhost:3001/offers/accept', { offerId });
      setReceivedOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === offerId ? { ...offer, status: 'ACCEPTED' } : offer
        )
      );
    } catch (error) {
      console.error('Error accepting offer:', error);
    }
  };

  const handleReject = async (offerId) => {
    try {
      await axios.post('http://localhost:3001/offers/reject', { offerId });
      setReceivedOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === offerId ? { ...offer, status: 'REJECTED' } : offer
        )
      );
    } catch (error) {
      console.error('Error rejecting offer:', error);
    }
  };

  if (loading) {
    return <div>Loading offers...</div>;
  }

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
                        alt={offer.fromUser.firstName}
                        className="profile-pic"
                      />
                      <span>
                        {offer.fromUser.firstName} {offer.fromUser.lastName} ต้องการแลก{' '}
                        <strong>{offer.name}</strong> กับ{' '}
                        <strong>{offer.product.name}</strong>.
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
                    สถานะ: {offer.status}
                  </div>
                  {offer.status === 'ACCEPTED' && (
                    <div className="chat-actions">
                      <button>แชท</button>
                    </div>
                  )}
                  {offer.status === 'PENDING' && (
                    <div className="offer-actions">
                      <button onClick={() => handleAccept(offer.id)}>ยอมรับ</button>
                      <button onClick={() => handleReject(offer.id)}>ปฏิเสธ</button>
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
                      <span>
                        ข้อเสนอของคุณ <strong>{offer.name}</strong> {' '}
                        ต้องการแลก <strong>{offer.product.name}</strong> กับ{' '}
                        <strong>
                          {offer.toUser.firstName} {offer.toUser.lastName}
                        </strong>
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
                    Status: {offer.status}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default OffersDetail;
