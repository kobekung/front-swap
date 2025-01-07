import React from 'react';
import { Button, Input, Form, Row, Col } from 'antd';

const ProfileEditForm = ({ editForm, handleChange, handleSave, handleEditToggle }) => {
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
        label="First Name"
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
        label="Last Name"
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
        label="Nickname"
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
        label="Phone Number"
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
        label="Address"
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
        label="Profile Picture URL"
        name="profilePicture"
      >
        <Input
          type="text"
          name="profilePicture"
          value={editForm.profilePicture}
          onChange={handleChange}
        />
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
