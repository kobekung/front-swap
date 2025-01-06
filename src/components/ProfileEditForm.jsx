// src/components/ProfileEditForm.js
import React from 'react';
import { Button, Form } from 'react-bootstrap';

const ProfileEditForm = ({ editForm, handleChange, handleSave, handleEditToggle }) => {
  return (
    <Form>
      <Form.Group controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control 
          type="text" 
          name="firstName" 
          value={editForm.firstName} 
          onChange={handleChange} 
        />
      </Form.Group>
      <Form.Group controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control 
          type="text" 
          name="lastName" 
          value={editForm.lastName} 
          onChange={handleChange} 
        />
      </Form.Group>
      <Form.Group controlId="formNickname">
        <Form.Label>Nickname</Form.Label>
        <Form.Control 
          type="text" 
          name="nickname" 
          value={editForm.nickname} 
          onChange={handleChange} 
        />
      </Form.Group>
      <Form.Group controlId="formPhoneNumber">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control 
          type="text" 
          name="phoneNumber" 
          value={editForm.phoneNumber} 
          onChange={handleChange} 
        />
      </Form.Group>
      <Form.Group controlId="formAddress">
        <Form.Label>Address</Form.Label>
        <Form.Control 
          type="text" 
          name="address" 
          value={editForm.address} 
          onChange={handleChange} 
        />
      </Form.Group>
      <Form.Group controlId="formProfilePicture">
        <Form.Label>Profile Picture URL</Form.Label>
        <Form.Control 
          type="text" 
          name="profilePicture" 
          value={editForm.profilePicture} 
          onChange={handleChange} 
        />
      </Form.Group>
      <Button variant="primary" onClick={handleSave}>Save</Button>
      <Button variant="secondary" onClick={handleEditToggle}>Cancel</Button>
    </Form>
  );
};

export default ProfileEditForm;
