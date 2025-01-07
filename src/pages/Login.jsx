import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Input, Button, Checkbox, Form, Alert } from 'antd';
import '../css/Login.css'; // ไฟล์ CSS แยกสำหรับจัดการสไตล์

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('http://localhost:3001/auth/login', values);
      console.log('Login successful:', response.data);

      const { access_token, id } = response.data;

      if (access_token && id) {
        localStorage.setItem('token', access_token);
        localStorage.setItem('userId', id);
        navigate(`/main/${id}`);
      } else {
        setError('Failed to retrieve user ID or token.');
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2 className="text-center">Login</h2>
      {error && <Alert message={error} type="error" />}

      <Form
        name="login"
        className="login-form"
        onFinish={handleSubmit}
        initialValues={formData}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            aria-label="Email"
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            aria-label="Password"
          />
        </Form.Item>

        <Form.Item>
          <Checkbox defaultChecked>Remember me</Checkbox>
          <a href="#!" className="forgot-password-link">Forgot password?</a>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Sign in
          </Button>
        </Form.Item>

        <div className="register-link">
          Not a member? <a href="/register" className="register-link-anchor">Register here</a>
        </div>
      </Form>
    </div>
  );
};

export default Login;
