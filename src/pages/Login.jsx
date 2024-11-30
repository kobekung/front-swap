import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/login', formData);
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
      {error && <p className="error-message">{error}</p>}

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loginName">Email</label>
          <input
            type="email"
            id="loginName"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <input
            type="password"
            id="loginPassword"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group remember-forgot">
          <div className="checkbox-container">
            <input type="checkbox" id="rememberMe" defaultChecked />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <a href="#!" className="forgot-password-link">Forgot password?</a>
        </div>


        <button type="submit" className="btn btn-primary">Sign in</button>
        <div className="register-link">
          Not a member? <a href="/register" className="register-link-anchor">Register here</a>
        </div>
        
      </form>
    </div>
  );
};

export default Login;
