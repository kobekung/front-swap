import React, { useState } from "react";
import axios from "axios";
import "../css/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    passwordHash: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:3001/auth/register", formData);
      setSuccess("Registration successful! You can now log in.");
      setFormData({
        email: "",
        passwordHash: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            aria-label="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="passwordHash">Password</label>
          <input
            type="password"
            id="passwordHash"
            name="passwordHash"
            aria-label="Enter your password"
            value={formData.passwordHash}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            aria-label="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            aria-label="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            aria-label="Enter your phone number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            aria-label="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <button type="submit" className="btn-submit">Register</button>
        <div className="login-link">
          Already a member?{" "}
          <a href="/" className="register-link-anchor">
            Login here
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
