import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
