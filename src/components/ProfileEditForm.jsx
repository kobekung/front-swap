import React, { useState } from 'react';
import { Button, Input, Form, Row, Col, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const ProfileEditForm = ({ editForm, handleChange, handleSave, handleEditToggle }) => {
  const [fileList, setFileList] = useState([]);

  // Handle upload change to capture the file and update profile picture field
  const handleUploadChange = async ({ file, fileList }) => {
    setFileList(fileList); // Update the file list state
    if (file.status === 'done') {
      message.success(`${file.name} file uploaded successfully`);
      const fileUrl = file.response?.url; // Assuming the server returns the file URL
      handleChange({
        target: { name: 'profilePicture', value: fileUrl },
      });
    } else if (file.status === 'error') {
      message.error(`${file.name} file upload failed.`);
    }
  };

  // Handle the profile picture upload to the backend
  const handleProfilePictureUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        `http://localhost:3001/users/${editForm.id}/upload-profile-picture`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      // Handle the response, and set the uploaded image URL in the form
      message.success(response.data.message);
      handleChange({
        target: { name: 'profilePicture', value: response.data.url },
      });
    } catch (error) {
      message.error('Profile picture upload failed.');
    }
  };

  return (
    <Form
      layout="vertical"
      initialValues={{
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        nickname: editForm.nickname,
        phoneNumber: editForm.phoneNumber,
        address: editForm.address,
        profilePicture: editForm.profilePicture,
      }}
    >
      <Form.Item
        label="ชื่อจริง"
        name="firstName"
        rules={[{ required: true, message: 'Please enter your first name!' }]}
      >
        <Input
          type="text"
          name="firstName"
          value={editForm.firstName}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="นามสกุล"
        name="lastName"
        rules={[{ required: true, message: 'Please enter your last name!' }]}
      >
        <Input
          type="text"
          name="lastName"
          value={editForm.lastName}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="ชื่อเล่น"
        name="nickname"
      >
        <Input
          type="text"
          name="nickname"
          value={editForm.nickname}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="เบอร์โทรศัพท์"
        name="phoneNumber"
      >
        <Input
          type="text"
          name="phoneNumber"
          value={editForm.phoneNumber}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="ที่อยู่"
        name="address"
      >
        <Input
          type="text"
          name="address"
          value={editForm.address}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="รูปโปรไฟล์"
        name="profilePicture"
      >
        <Upload
          customRequest={({ file }) => handleProfilePictureUpload(file)}
          showUploadList={false} // Hide the default upload list
          accept="image/*"
        >
          <Button icon={<UploadOutlined />}>อัพโหลด</Button>
        </Upload>
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Button type="primary" block onClick={handleSave}>
            Save
          </Button>
        </Col>
        <Col span={12}>
          <Button type="default" block onClick={handleEditToggle}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ProfileEditForm;
