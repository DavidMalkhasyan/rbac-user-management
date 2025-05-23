import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import HomePage from "./Pages/HomePage";
import AdminPanel from "./Pages/AdminPanel";
import LoginPage from "./Pages/LoginPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import VerifyPage from "./Pages/VerifyPage";
import MyProfile from "./Pages/MyProfile";
import EditUserProfile from "./Pages/EditUserProfile";
import ResetPassword from "./Pages/ResetPassword";
import UserDetails from "./Components/UserDetails.jsx";
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/authorization/verify" element={<VerifyPage />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/edit/:id" element={<EditUserProfile />} /> 
                <Route path="authorization/verifyPasswordRecovery" element={<ResetPassword />} />
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/users/:id" element={<UserDetails />} />
            </Routes>
        </Router>
    );
};

export default App;