import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Hook for redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', formData);
      console.log('Login successful:', response.data);

      const { access_token, id } = response.data; // Ensure the names match backend

      if (access_token && id) {
        localStorage.setItem('token', access_token); // Store token in local storage
        localStorage.setItem('userId', id); // Store user ID in local storage
        navigate(`/main/${id}`); // Redirect to main page with user ID
      } else {
        setError('Failed to retrieve user ID or token.');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="container-form-login">
      <Form className="card" onFinish={handleSubmit}>
        <Title level={2}>Login</Title>

        <Form.Item
          className='in-username'
          layout="vertical"
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          className='in-pass'
          layout="vertical"
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </Form.Item>

        <Form.Item>
          <Button className='bt-submit' type="primary" htmlType="submit" block>
            Login
          </Button>
        </Form.Item>

        {error && <p style={{ color: 'red' }}>{error}</p>}
      </Form>
    </div>

  );
};

export default Login;
