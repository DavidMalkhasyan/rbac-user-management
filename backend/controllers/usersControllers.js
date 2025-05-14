import usersServices from "../services/usersServices.js";
import User from "../models/User.js";
class usersControllers{
    async getAllUsers(req, res) {
        try {
            const users = await User.find({ status: "Active" });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await usersServices.findById(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async changeUser(req, res) {
        try {
            const user = await usersServices.findById(req.params.id);
            if (!user) return res.status(404).json({ message: "User not found" });
    
            const updatedUser = await usersServices.changeUser(req.params.id, req.body);
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
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            console.error("Delete error:", error.message);
            res.status(500).json({ message: error.message });
        }
    }
    
}

export default new usersControllers();