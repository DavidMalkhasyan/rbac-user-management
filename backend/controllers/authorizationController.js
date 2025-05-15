import authorizationServices from "../services/authorizationServices.js";

class AuthorizationController {
    async sendAutorizationLink(req, res) {
        const response = await authorizationServices.sendAuthorizationLink(
            req.body
        );
        res.status(response.status).json({ message: response.message });
    }

    async verifyToken(req, res) {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const response = await authorizationServices.verifyToken(
            token,
            req.body
        );
        res.status(response.status).json({ message: response.message });
    }

    async login(req, res) {
        const response = await authorizationServices.login(req.body);
        res.status(response.status).json({
            message: response.message,
            user: response.user,
            token: response.token,
        });
    }

    async sendPasswordRecovery(req, res) {
        const response = await authorizationServices.sendPasswordRecovery(
            req.body
        );
        res.status(response.status).json({ message: response.message });
    }

    async verifyPasswordRecovery(req, res) {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const response = await authorizationServices.verifyPasswordRecovery(
            token,
            req.body
        );
        res.status(response.status).json({ message: response.message });
    }
}

export default new AuthorizationController();
