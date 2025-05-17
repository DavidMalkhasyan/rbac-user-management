import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resCurrent = await api.get("/users/me");
                setCurrentUser(resCurrent.data);

                const resAll = await api.get("users/all");
                setUsers(resAll.data);
            } catch (err) {
                console.error("Error in uploading", err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const res = await api.get("/uploads/avatar.svg", {
                    responseType: "blob",
                });
                const imageBlob = res.data;
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setImageUrl(imageObjectURL);
            } catch (err) {
                console.error("Ошибка при загрузке изображения", err);
            }
        };
        fetchImage();
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
            setUsers((prev) => prev.filter((user) => user._id !== id));
        } catch (err) {
            console.error("Ошибка при удалении пользователя:", err);
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
                                src={`http://localhost:5000/uploads/${currentUser.avatar}`}
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
            <ul className="users-list">
                {users.map((user) => (
                    <li className="user-card" key={user._id}>
                        <div className="user-info">
                            <img
                                src={`http://localhost:5000/uploads/${user.avatar}`}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="user-avatar"
                            />
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
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
