import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/UserDetails.css";

const UserDetails = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setUser(res.data);
            } catch (error) {
                alert("User not found");
                navigate("/");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!user) return null;

    return (
        <div className="user-details-container">
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Back
            </button>
            <h2>
                {user.firstName} {user.lastName} ({user.role})
            </h2>
            <img
                src={`http://localhost:5000/uploads/${user.avatar}`}
                alt={`${user.firstName} ${user.lastName}`}
                className="user-details-avatar"
            />
            <ul className="user-info-list">
                <li>
                    <strong>Email:</strong> {user.email}
                </li>
                <li>
                    <strong>Phone:</strong> {user.phone || "N/A"}
                </li>
                <li>
                    <strong>Username:</strong> {user.username}
                </li>
                <li>
                    <strong>Permissions:</strong>{" "}
                    {user.permissions
                        ? Object.entries(user.permissions)
                              .map(
                                  ([key, val]) =>
                                      `${key}: ${val ? "Yes" : "No"}`
                              )
                              .join(", ")
                        : "None"}
                </li>

                <li>
                    <strong>Status:</strong> {user.status || "active"}
                </li>
            </ul>
        </div>
    );
};

export default UserDetails;
