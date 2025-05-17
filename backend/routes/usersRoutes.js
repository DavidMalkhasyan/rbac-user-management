import express from "express";
import usersControllers from "../controllers/usersControllers.js";
import upload from "../middleware/upload.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
    usersControllers.getMe(req, res);
});

router.get("/all", authenticateToken, (req, res) => {
    usersControllers.getAllUsers(req, res);
});

router.get("/:id", authenticateToken, (req, res) => {
    usersControllers.getUserById(req, res);
});

router.put("/:id", authenticateToken, upload.single("photo"), (req, res) => {
    usersControllers.changeUser(req, res);
});

router.delete("/:id", authenticateToken, (req, res) => {
    usersControllers.deleteUser(req, res);
});

export default router;
