import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/EditUserProfile.css";

const EditUserProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        username: "",
        role: "",
        permissions: {},
    });

    const [isAdmin, setIsAdmin] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, currentUserRes] = await Promise.all([
                    api.get(`/users/${id}`),
                    api.get("/users/me")
                ]);
    
                setFormData(userRes.data);
    
                if (currentUserRes.data?.role === "admin") {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
    
        fetchData();
    }, [id]);    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePermissionChange = (e) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [name]: checked,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}`, formData);
            setMessage("User updated successfully.");
            navigate("/home");
        } catch (err) {
            setMessage("Error updating user.");
        }
    };

    const handleGoHome = () => {
        navigate("/home");
    };

    return (
        <div className="edit-profile-container">
            <button onClick={handleGoHome} className="back-button">
                ⬅ Back to Home
            </button>
            <form onSubmit={handleSubmit} className="edit-profile-form">
                <h2>Edit User</h2>

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
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                />

                {isAdmin && (
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                )}

                {isAdmin && (
                    <div className="permissions-section">
                        <h4>Permissions</h4>
                        {[
                            "Edit Clients",
                            "Delete Clients",
                            "Add Clients",
                        ].map((perm) => (
                            <label key={perm}>
                                <input
                                    type="checkbox"
                                    name={perm}
                                    checked={
                                        formData.permissions?.[perm] || false
                                    }
                                    onChange={handlePermissionChange}
                                />
                                {perm}
                            </label>
                        ))}
                    </div>
                )}

                <button type="submit">Save</button>
                {message && <p className="message">{message}</p>}
            </form>
        </div>
    );
};

export default EditUserProfile;
