import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/OffersDetail.css'; // Ensure the path is correct

const OffersDetail = ({ userId, onClose }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/offers/user/${userId}`);
        setOffers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError('');
        setShowError(true);
        setLoading(false);

        // Hide the error message after 2 seconds
       
      }
    };

    if (userId) fetchOffers();
  }, [userId]);

  const handleAccept = async (offerId) => {
    try {
      await axios.post('http://localhost:3001/offers/accept', { offerId });
      setOffers((prevOffers) =>
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
      setOffers((prevOffers) =>
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
      <h2>Your Offers</h2>
      {showError && <div className="error-message">{error}</div>}
      {offers.length === 0 ? (
        <p>No offers found.</p>
      ) : (
        <ul>
          {offers.map((offer) => (
            <li key={offer.id} className="offer-card">
              <div className="offer-info-container">
                <div className="offer-info">
                  <img 
                    src={offer.fromUser.profilePicture} 
                    alt={offer.fromUser.firstName} 
                    className="profile-pic" 
                  />
                  <span>
                    {offer.fromUser.firstName} {offer.fromUser.lastName} ต้องการเอา {offer.name} แลกกับ {offer.product.name} ของคุณ
                  </span>
                </div>
                <div className="product-info">
                    <img 
                      className="offer-product-image"
                      src={offer.image} 
                      alt={offer.name} 
                    />
                    <span className="product-price">{offer.price}</span>
                    
                    <img 
                      className="offer-product-image"
                      src={offer.product.image} 
                      alt={offer.product.name} 
                    />
                    <span className="offer-product-price">{offer.product.price}</span>
                  </div>
              </div>

              <div className={`offer-status ${offer.status.toLowerCase()}`}>
                Status: {offer.status}
              </div>

              {offer.status === 'PENDING' && (
                <div className="offer-actions">
                  <button className="accept-btn" onClick={() => handleAccept(offer.id)}>Accept</button>
                  <button className="reject-btn" onClick={() => handleReject(offer.id)}>Reject</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OffersDetail;
