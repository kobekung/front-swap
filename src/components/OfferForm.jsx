import React, { useState } from 'react';
import axios from 'axios';
import '../css/OfferForm.css'; // Ensure you're using the existing CSS

const OfferForm = ({ productId, fromUserId, toUserId, onClose }) => {
  const [offerDetails, setOfferDetails] = useState({
    name: '',
    description: '',
    price: '',
    image: '', // Add image field for the URL
    status: 'pending',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [imageFile, setImageFile] = useState(null); // State to hold the selected file

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferDetails({ ...offerDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store the file in the state
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmation before submitting
    const confirmSubmit = window.confirm('Are you sure you want to submit this offer?');
    if (!confirmSubmit) return;

    try {
      let imageUrl = '';

      if (imageFile) {
        // Create a FormData object to send the image file
        const formData = new FormData();
        formData.append('file', imageFile);

        // Upload the image and get the URL
        const uploadResponse = await axios.post('http://localhost:3001/offers/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadResponse.data.url; // Assuming your backend returns the image URL
      }

      const offerData = {
        ...offerDetails,
        status: 'PENDING', // Ensure valid status
        price: parseFloat(offerDetails.price), // Ensure price is a number
        from_user_id: parseInt(fromUserId, 10),
        to_user_id: parseInt(toUserId, 10),
        product_id: parseInt(productId, 10),
        image: imageUrl, // Use the uploaded image URL
      };

      // Submit the offer data
      await axios.post('http://localhost:3001/offers/create', offerData);
      setSuccessMessage('Offer sent successfully!');
      setOfferDetails({
        name: '',
        description: '',
        price: '',
        status: 'pending',
        image: '', // Clear image URL
      });
      setImageFile(null); // Clear selected file

      setTimeout(() => {
        setSuccessMessage('');
        onClose(); // Close the form after submission
      }, 3000);
    } catch (error) {
      console.error('Error creating offer:', error.response.data);
      setError('Failed to create offer.');
    }
  };

  return (
    <div className="offer-form-popup">
      <div className="offer-form-content">
        <h2>Create Offer</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Offer Name</label>
            <input
              type="text"
              name="name"
              value={offerDetails.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              value={offerDetails.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              value={offerDetails.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image Upload</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange} // Handle file input
              accept="image/*"
            />
          </div>

          <div className="form-buttons">
            <button type="submit">Submit Offer</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfferForm;
