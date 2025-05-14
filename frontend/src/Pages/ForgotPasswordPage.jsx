import { useState } from "react";
import api from "../utils/api";
import "../styles/LoginPage.css";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSend = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/authorization/sendPasswordRecovery", { email });
      setSent(true);
      setTimeout(
      navigate("/")
    ,1500);
    } catch (err) {
      setError("Failed to send email. Try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSend}>
        <h2>Forgot Password</h2>
        {error && <div className="error">{error}</div>}
        {sent && <div className="success">Email has been sent!</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={sent}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" disabled={sent || !email}>
          Send
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
