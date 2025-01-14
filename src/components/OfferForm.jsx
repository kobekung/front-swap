import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const OfferForm = ({ productId, fromUserId, toUserId, onClose }) => {
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values) => {
    const confirmSubmit = window.confirm('Are you sure you want to submit this offer?');
    if (!confirmSubmit) return;

    try {
      let imageUrl = '';

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
    <Modal
      title="สร้างข้อเสนอ"
      visible={true}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: 'PENDING' }}
      >
        <Form.Item
          label="ชื่อสินค้าที่จะเสนอ"
          name="name"
          rules={[{ required: true, message: 'Please input the offer name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="รายระเอียดสินค้า"
          name="description"
          rules={[{ required: true, message: 'Please input the description!' }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="ราคาประเมิน"
          name="price"
          rules={[{ required: true, message: 'Please input the price!' }]}
        >
          <InputNumber
            min={0}
            style={{ width: '100%' }}
            formatter={(value) => `$ ${value}`}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          label="รูปสินค้า"
          name="image"
          valuePropName="file"
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent automatic upload
          >
            <Button icon={<UploadOutlined />}>เลือกรูปภาพ</Button>
          </Upload>
        </Form.Item>

        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={uploading}
            style={{ marginRight: '10px' }}
          >
            ส่งข้อเสนอ
          </Button>
          <Button onClick={onClose}>ยกเลิก</Button>
        </div>
      </Form>
    </Modal>
  );
};

export default OfferForm;
