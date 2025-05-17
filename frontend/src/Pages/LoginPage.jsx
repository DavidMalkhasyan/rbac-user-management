import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        try {
            const res = await api.post("authorization/login", {
                username,
                password,
            });
            setSuccess("Login successful!");
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (err) {
            setError("Invalid username or password.");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
                <a href="/forgot-password" className="forgot-password">
                    Forgot password?
                </a>
            </form>
        </div>
    );
};

export default LoginPage;
