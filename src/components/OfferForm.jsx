import React, { useState } from 'react';
import axios from 'axios';
import { Input, Button, message, Form, Upload, InputNumber } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import '../css/OfferForm.css'; // Ensure you're using the existing CSS

const OfferForm = ({ productId, fromUserId, toUserId, onClose }) => {
  const [offerDetails, setOfferDetails] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    status: 'pending',
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferDetails({ ...offerDetails, [name]: value });
  };

  const handleFileChange = (info) => {
    if (info.file.status === 'done') {
      setImageFile(info.file.originFileObj);
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
        const formData = new FormData();
        formData.append('file', imageFile);

        const uploadResponse = await axios.post('http://localhost:3001/offers/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        imageUrl = uploadResponse.data.url;
      }

      const offerData = {
        ...offerDetails,
        status: 'PENDING',
        price: parseFloat(offerDetails.price),
        from_user_id: parseInt(fromUserId, 10),
        to_user_id: parseInt(toUserId, 10),
        product_id: parseInt(productId, 10),
        image: imageUrl,
      };

      await axios.post('http://localhost:3001/offers/create', offerData);
      message.success('Offer sent successfully!');
      setOfferDetails({
        name: '',
        description: '',
        price: '',
        status: 'pending',
        image: '',
      });
      setImageFile(null);

      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error creating offer:', error.response.data);
      message.error('Failed to create offer.');
    }
  };

  return (
    <div className="offer-form-popup">
      <div className="offer-form-content">
        <h2>Create Offer</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Item label="Offer Name" required>
            <Input
              name="name"
              value={offerDetails.name}
              onChange={handleChange}
              placeholder="Enter offer name"
            />
          </Form.Item>

          <Form.Item label="Description" required>
            <Input.TextArea
              name="description"
              value={offerDetails.description}
              onChange={handleChange}
              placeholder="Enter offer description"
            />
          </Form.Item>

          <Form.Item label="Price" required>
            <InputNumber
              name="price"
              value={offerDetails.price}
              onChange={(value) => setOfferDetails({ ...offerDetails, price: value })}
              min={0}
              placeholder="Enter price"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item label="Image Upload">
            <Upload
              name="image"
              listType="picture"
              onChange={handleFileChange}
              beforeUpload={() => false} // Prevent automatic upload
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Select Image</Button>
            </Upload>
          </Form.Item>

          <div className="form-buttons">
            <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
              Submit Offer
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default OfferForm;
