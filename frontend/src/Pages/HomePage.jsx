import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

const HomePage = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const local = JSON.parse(localStorage.getItem("user"));
                if (local?.user) {
                    setCurrentUser(local.user);
                }
    
                const res = await api.get("users/all");
                setUsers(res.data); 
            } catch (err) {
                console.error("somthing get wrong", err);
            }
        };
    
        fetchData();
    }, []);;

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
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/my-profile");
    };

    const showAdminPanel =
        currentUser?.permissions?.canEditClients || currentUser?.permissions?.canAddClients;

    return (
        <div className="homepage-container">
            <nav className="navbar">
                <div className="navbar-left">
                    {showAdminPanel && (
                        <button className="admin-button" onClick={() => navigate("/admin")}>
                            Admin Panel
                        </button>
                    )}
                </div>
                <div className="navbar-right">
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
                            <span className="user-name">
                                {user.firstName} {user.lastName} ({user.role})
                            </span>
                        </div>
                        <div className="actions">
                            {currentUser?.permissions?.canEditClients && (
                                <button className="edit-button" onClick={() => handleEdit(user._id)}>
                                    Edit
                                </button>
                            )}
                            {currentUser?.permissions?.canDeleteClients && (
                                <button className="delete-button" onClick={() => handleDelete(user._id)}>
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
