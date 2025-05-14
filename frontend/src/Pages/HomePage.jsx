import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = ({ currentUser }) => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const [userFirstName, setUserFirstName] = useState("Anonymous");
    const [userLastName, setUserLastName] = useState("");
    const [permissions, setPermissions] = useState({});

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            setUserFirstName(user.user.firstName || "Anonymous");
            setUserLastName(user.user.lastName || "");
            setPermissions(user.user.permissions || {});
        }

        const fetchUsers = async () => {
            try {
                const res = await api.get("users/all");
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        fetchUsers();
    }, []);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/users/${id}`);
            setUsers((prevUsers) =>
                prevUsers.filter((user) => user._id !== id)
            );
        } catch (err) {
          console.error("Error deleting user:", err.response?.data || err.message);
          alert("Failed to delete user: " + (err.response?.data?.message || err.message));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleProfileClick = () => {
        navigate("/my-profile");
    };

    const showAdminPanel =
        permissions.canEditClients || permissions.canAddClients;

    return (
        <div className="homepage-container">
            <nav className="navbar">
                <div className="navbar-left">
                    {showAdminPanel && (
                        <button
                            className="admin-button"
                            onClick={() => navigate("/admin")}
                        >
                            Admin Panel
                        </button>
                    )}
                </div>
                <div className="navbar-right">
                    <span
                        className="profile-icon"
                        onClick={handleProfileClick}
                        style={{ cursor: "pointer" }}
                    >
                        👤
                    </span>
                    <span
                        className="profile-name"
                        onClick={handleProfileClick}
                        style={{ cursor: "pointer" }}
                    >
                        {userFirstName} {userLastName}
                    </span>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <h1 className="title">All Users</h1>
            <ul className="users-list">
                {users.map((user) => (
                    <li className="user-card" key={user._id}>
                        <span className="user-name">
                            {user.firstName} {user.lastName} ({user.role})
                        </span>
                        <div className="actions">
                            {permissions.canEditClients && (
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(user._id)}
                                >
                                    Edit
                                </button>
                            )}
                            {permissions.canDeleteClients && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
