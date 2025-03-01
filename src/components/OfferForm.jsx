import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const OfferForm = ({ productId, fromUserId, toUserId, onClose }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [previousOffers, setPreviousOffers] = useState([]); // เก็บข้อเสนอเก่า
  const [selectedOffer, setSelectedOffer] = useState(null);

  useEffect(() => {
    // ดึงประเภทสินค้า
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    // ดึงข้อเสนอที่เคยส่ง
    const fetchPreviousOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/offers/sent/${fromUserId}`);
        setPreviousOffers(response.data);
      } catch (error) {
        console.error('Error fetching previous offers:', error);
      }
    };

    fetchCategories();
    fetchPreviousOffers();
  }, [fromUserId]);

  // เมื่อเลือกข้อเสนอเก่า ให้เติมข้อมูลลงฟอร์ม
  const handlePreviousOfferSelect = (offerId) => {
    const offer = previousOffers.find((o) => o.id === offerId);
    if (offer) {
      setSelectedOffer(offer);
      form.setFieldsValue({
        name: offer.name,
        description: offer.description,
        price: offer.price,
        // categoryId: offer.categoryId, // ✅ เติม categoryId
        image: offer.image ? [{ url: offer.image }] : [], // ✅ เติมรูปภาพ
      });
    }
  };

  const handleSubmit = async (values) => {
    const confirmSubmit = window.confirm('Are you sure you want to submit this offer?');
    if (!confirmSubmit) return;

    try {
      let imageUrl = selectedOffer?.image || ''; // ใช้รูปเดิมถ้าเป็นข้อเสนอเก่า

      if (values.image?.file) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', values.image.file);

        const uploadResponse = await axios.post(
          'http://localhost:3001/offers/upload',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        imageUrl = uploadResponse.data.url;
        setUploading(false);
      }

      const offerData = {
        name: values.name,
        description: values.description,
        price: parseFloat(values.price),
        categoryId: values.categoryId,
        status: 'PENDING',
        from_user_id: parseInt(fromUserId, 10),
        to_user_id: parseInt(toUserId, 10),
        product_id: parseInt(productId, 10),
        image: imageUrl,
      };

      await axios.post('http://localhost:3001/offers/create', offerData);
      setSuccessMessage('Offer sent successfully!');
      message.success('Offer sent successfully!');
      form.resetFields();

      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating offer:', error.response?.data || error);
      message.error('Failed to create offer.');
      setUploading(false);
    }
  };

  return (
    <Modal title="สร้างข้อเสนอ" visible={true} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'PENDING' }}>
        
        {/* เลือกข้อเสนอเก่า */}
        <Form.Item label="เลือกข้อเสนอเก่า (ถ้ามี)">
          <Select placeholder="เลือกข้อเสนอเก่า" onChange={handlePreviousOfferSelect} allowClear>
            {previousOffers.map((offer) => (
              <Select.Option key={offer.id} value={offer.id}>
                {offer.name} - ${offer.price}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="ชื่อสินค้าที่จะเสนอ" name="name" rules={[{ required: true, message: 'Please input the offer name!' }]}>
          <Input />
        </Form.Item>

        <Form.Item label="รายระเอียดสินค้า" name="description" rules={[{ required: true, message: 'Please input the description!' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="ราคาประเมิน" name="price" rules={[{ required: true, message: 'Please input the price!' }]}>
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        {/* <Form.Item name="categoryId" label="ประเภทสินค้า" rules={[{ required: true, message: 'กรุณาเลือกประเภทสินค้า' }]}>
          <Select placeholder="เลือกประเภท">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item label="รูปสินค้า" name="image" valuePropName="fileList">
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            defaultFileList={selectedOffer?.image ? [{ uid: '-1', url: selectedOffer.image, name: 'Offer Image' }] : []}
          >
            <Button icon={<UploadOutlined />}>เลือกรูปภาพ</Button>
          </Upload>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" loading={uploading} style={{ marginRight: '10px' }}>
            ส่งข้อเสนอ
          </Button>
          <Button onClick={onClose}>ยกเลิก</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default OfferForm;
