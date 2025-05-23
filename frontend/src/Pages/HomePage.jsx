import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCurrent = await api.get("/users/me");
                setCurrentUser(resCurrent.data);

                const resAll = await api.get("/users/all");
                setUsers(resAll.data);
                setFilteredUsers(resAll.data);
            } catch (err) {
                console.error("Error in fetching users:", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.firstName.toLowerCase().includes(term) ||
                user.lastName.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const handleEdit = (id) => {
        navigate(`/edit/${id}`);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/users/${id}`);
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user: " + err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/my-profile");
    };

    const showAdminPanel =
        currentUser?.permissions?.canEditClients ||
        currentUser?.permissions?.canAddClients;

    const getAvatarUrl = (id) => `http://localhost:5000/api/photos/${id}`;

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
                    <div>
                        {currentUser?.avatar ? (
                            <img
                                src={getAvatarUrl(currentUser._id)}
                                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                                className="user-avatar"
                            />
                        ) : (
                            <p>No image</p>
                        )}
                    </div>
                    <span
                        className="profile-name"
                        onClick={handleProfileClick}
                        style={{ cursor: "pointer" }}
                    >
                        {currentUser?.firstName} {currentUser?.lastName}
                    </span>
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            <h1 className="title">All Users</h1>

            <input
                type="text"
                placeholder="Search by first or last name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            <ul className="users-list">
                {filteredUsers.map((user) => (
                    <li className="user-card" key={user._id}>
                        <div className="user-info">
                            {user.avatar ? (
                                <img
                                    src={getAvatarUrl(user._id)}
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className="user-avatar"
                                />
                            ) : user.role === "superAdmin" ? (
                                <div className="user-avatar-placeholder">Super Admin</div>
                            ) : (
                                <div className="user-avatar-placeholder">No image</div>
                            )}
                            <span className="user-name">
                                {user.firstName} {user.lastName} ({user.role})
                            </span>
                        </div>
                        <div className="actions">
                            {currentUser?.permissions?.canEditClients && (
                                <button
                                    className="edit-button"
                                    onClick={() => handleEdit(user._id)}
                                >
                                    Edit
                                </button>
                            )}
                            {currentUser?.permissions?.canDeleteClients && (
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(user._id)}
                                >
                                    Delete
                                </button>
                            )}
                            <button
                                className="details-button"
                                onClick={() => navigate(`/users/${user._id}`)}
                            >
                                Details
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
