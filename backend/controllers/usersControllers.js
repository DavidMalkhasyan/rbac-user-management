import usersServices from "../services/usersServices.js";
import User from "../models/User.js";
class usersControllers {
    async getMe (req, res) {
        try{
            const user = await usersServices.findById(req.user.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async getAllUsers(req, res) {
        try {
            const users = await User.find({ status: "active" });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await usersServices.findById(req.params.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async changeUser(req, res) {
        try {
            const user = await usersServices.findById(req.params.id);
            if (!user)
                return res.status(404).json({ message: "User not found" });

            const updateData = { ...req.body };

            if (req.file) {
                updateData.avatar = "/" + req.file.path.replace(/\\/g, "/");
            }

            const updatedUser = await usersServices.changeUser(
                req.params.id,
                updateData
            );

            res.status(200).json({
                message: "User updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.status = "deleted";
            await user.save();
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Delete error:", error.message);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new usersControllers();
