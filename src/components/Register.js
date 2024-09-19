import React, { useState } from 'react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [passwordHash, setPasswordHash] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call API to register user
    fetch('http://localhost:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        passwordHash,
        firstName,
        lastName,
        phoneNumber,
        address
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSuccessMessage('Registration successful!');
          setErrorMessage(null);
        } else {
          setErrorMessage(data.error);
          setSuccessMessage(null);
        }
      })
      .catch((error) => {
        setErrorMessage('An error occurred');
        setSuccessMessage(null);
      });
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={passwordHash} onChange={(event) => setPasswordHash(event.target.value)} />
        </label>
        <br />
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
        </label>
        <br />
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(event) => setLastName(event.target.value)} />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} />
        </label>
        <br />
        <label>Address
          <input type="text" value={address} onChange={(event) => setAddress(event.target.value)} />
        </label>
        <button type="submit">Register</button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;