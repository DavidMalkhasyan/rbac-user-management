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
    avatar: "",
  });

  const [file, setFile] = useState(null);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDataChanged, setIsDataChanged] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/me");
        const user = res.data;

        setUserId(user._id);
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          phone: user.phone || "",
          username: user.username || "",
          avatar: user.avatar || "",
        });
      } catch (err) {
        setMessage("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDataChanged(true);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPhotoMessage("");
    }
  };

  const handlePhotoUpload = async () => {
    if (!file) {
      setPhotoMessage("No photo selected");
      return;
    }

    try {
      const data = new FormData();
      data.append("avatar", file);

      await api.put(`api/photos/${userId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPhotoMessage("Photo uploaded successfully");
      setFile(null);
    } catch (err) {
      setPhotoMessage("Photo upload failed");
    }
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
    setMessage("");

    try {
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
      };

      await api.put(`/users/${userId}`, data);
      setMessage("Profile updated");
      setIsDataChanged(false);
    } catch (err) {
      setMessage("Update failed");
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
        <input
          type="text"
          name="username"
          value={formData.username}
          disabled
        />

        <button type="submit" disabled={isSaving || !isDataChanged}>
          {isSaving ? "Saving..." : "Save Changes"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>

      <div className="photo-upload">
        <h3>Upload Avatar</h3>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="button" onClick={handlePhotoUpload}>
          Upload Photo
        </button>
        {photoMessage && <p className="message">{photoMessage}</p>}
      </div>

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
