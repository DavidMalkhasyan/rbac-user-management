import express from "express";
import authorizationController from "../controllers/authorizationController.js";

const router = express.Router();

router.post("/sendAutorizationLink", async (req, res) => {
    authorizationController.sendAutorizationLink(req, res);
});
router.post("/login", async (req, res) => {
    authorizationController.login(req, res);
});
router.post("/verify", async (req, res) => {
    authorizationController.verifyToken(req, res);
});
router.post("/sendPasswordRecovery", async (req, res) => {
    authorizationController.sendPasswordRecovery(req, res);
});
router.post("/verifyPasswordRecovery", async (req, res) => {
    authorizationController.verifyPasswordRecovery(req, res);
});

export default router;
