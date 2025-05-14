import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../styles/authorization.css';
import api from '../utils/api.js';

const AuthorizationForm = () => {
  const location = useLocation();
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.phone.trim() &&
      formData.username.trim() &&
      formData.password &&
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const { confirmPassword, ...data } = formData;
    console.log(token)
    try {
      const res = await api.post(`authorization/verify?token=${token}`, data);
      console.log(res.status);
      navigate("/")
    } catch (error) {
      console.error("Somthing went wrong")
    }
  };

  return (
    <div className="auth-page-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Verify Account</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="auth-input"
          required
        />

        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="auth-input"
          required
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="auth-input"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="auth-input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="auth-input"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Repeat Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="auth-input"
          required
        />

        {formData.confirmPassword &&
          formData.password !== formData.confirmPassword && (
            <p style={{ color: 'red', fontSize: '0.9rem', margin: 0 }}>
              Passwords do not match
            </p>
          )}

        <button type="submit" className="auth-button" disabled={!isFormValid()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AuthorizationForm;
