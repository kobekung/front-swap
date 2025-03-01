import { Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';

const OfferShow = () => {
    const { offerId } = useParams();
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('userId');
    const [offers, setOffers] = useState([]);
    const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1); // ใช้ navigate แทนที่จะเรียก Navigate โดยตรง
  };

    useEffect(() => {
        const fetchOffers = async () => {
          if (!offerId) {
            console.error('Offer ID is missing');
            return;
          }
          try {
            const response = await axios.get(`http://localhost:3001/offers/${offerId}`);
            setOffers(response.data);
          } catch (error) {
            console.error('Error fetching offers:', error);
          }
        };
        fetchOffers();
      }, [offerId]);
      

    return (
        <div className="product-detail-modal">
          <div className="modal-content">
            <Button type="text" onClick={handleClose} style={{ marginBottom: 16 }}>
              ย้อนกลับ
            </Button>
            <h2>{offers?.name}</h2>
            <img
              src={offers?.image || '/default-product.png'}
              alt={offers?.name}
              className="product-detail-image"
            />
            <div className="product-detail-info">
              <p><span>รายละเอียดสินค้า:</span> {offers?.description}</p>
              <p><span>ราคาประเมิน:</span> {offers?.price}</p>
              
              {/* <p><span>โพสต์สินค้าโดย:</span> {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}</p> */}
            </div>
          </div>
        </div>
    
      );
}

export default OfferShow