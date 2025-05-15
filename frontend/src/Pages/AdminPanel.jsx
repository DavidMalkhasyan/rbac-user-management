import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/AdminPanel.css";

const AdminPanel = () => {
  const [formData, setFormData] = useState({
    email: "",
    role: "user",
    canEditClients: false,
    canDeleteClients: false,
    canAddClients: false,
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("authorization/sendAutorizationLink", formData);
      navigate("/home");
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    }
  };
  const handleGoHome = () => {
    navigate("/home"); 
  };
  
  return (
    <div className="admin-panel-container">
      <form className="admin-form" onSubmit={handleSubmit}>
      <button onClick={handleGoHome} className="back-button">
        ⬅ Back to Home
      </button>
        <h2>Create User</h2>

        <input
          className="admin-input"
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <select
          className="admin-select"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              name="canEditClients"
              onChange={handleChange}
            />
            Edit User
          </label>
          <label>
            <input
              type="checkbox"
              name="canDeleteClients"
              onChange={handleChange}
            />
            Delete User
          </label>
          <label>
            <input
              type="checkbox"
              name="canAddClients"
              onChange={handleChange}
            />
            Add User
          </label>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" className="admin-button">
          Send Authorization Link
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
