import React, { useState, useEffect } from 'react';
import '../styles/myProfile.css';
import api from '../utils/api'; 

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    username: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isDataChanged, setIsDataChanged] = useState(false); 

  const userId = JSON.parse(localStorage.getItem('user')).id;  

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/users/${userId}`); 
        const userData = res.data;
        setFormData(userData);
      } catch (err) {
        console.error('Error loading profile', err);
      }
    }

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDataChanged(true);  
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDataChanged) {
      setMessage('No changes made.');
      return;
    }

    const confirmUpdate = window.confirm('Are you sure you want to save these changes?');
    if (!confirmUpdate) return;

    setIsSaving(true);
    try {
      await api.put(`/users/${userId}`, formData);  
      setMessage('Profile updated successfully!');
      setIsDataChanged(false); 
    } catch (err) {
      setMessage('Error updating profile.');
    }
    setIsSaving(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New password and confirmation do not match.");
      return;
    }

    setIsSaving(true);
    try {
      await api.put(`/users/${userId}/password`, passwordData);
      setMessage('Password updated successfully!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setMessage('Error changing password.');
    }
    setIsSaving(false);
  };

  return (
    <div className="profile-container">
      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>My Profile</h2>

        <div className="profile-data">
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
          />

          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
          />

          <p><strong>Phone:</strong> {formData.phone}</p>
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <p><strong>Username:</strong> {formData.username}</p>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            disabled
          />
        </div>

        <button type="submit" disabled={isSaving || !isDataChanged}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <form className="password-form" onSubmit={handlePasswordSubmit}>
        <h2>Change Password</h2>

        <input
          type="password"
          name="oldPassword"
          placeholder="Old Password"
          value={passwordData.oldPassword}
          onChange={handlePasswordChange}
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={handlePasswordChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm New Password"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Changing Password...' : 'Change Password'}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default MyProfile;
