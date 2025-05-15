import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/myProfile.css";
import api from "../utils/api";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isDataChanged, setIsDataChanged] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?.id;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/users/${userId}`);
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phone: res.data.phone || "",
          username: res.data.username || "",
        });
      } catch {
        setMessage("Something went wrong");
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDataChanged(true);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isDataChanged) {
      setMessage("No changes detected");
      return;
    }

    if (!window.confirm("Save changes?")) return;

    setIsSaving(true);

    try {
      await api.put(`/users/${userId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage("Profile updated");
      setIsDataChanged(false);
    } catch (err) {
      setMessage("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await api.put(`/users/${userId}`, {
        password: passwordData.newPassword,
      });

      setMessage("Password changed successfully");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleGoHome = () => {
    navigate("/home");
  };

  return (
    <div className="profile-container">
      <button onClick={handleGoHome} className="back-button">
        ⬅ Back to Home
      </button>

      <form className="profile-form" onSubmit={handleSubmit}>
        <h2>My Profile</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
        <input type="text" name="username" value={formData.username} disabled />

        <button type="submit" disabled={isSaving || !isDataChanged}>
          {isSaving ? "Saving..." : "Save Changes"}
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
          placeholder="Confirm Password"
          value={passwordData.confirmPassword}
          onChange={handlePasswordChange}
        />
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default MyProfile;
