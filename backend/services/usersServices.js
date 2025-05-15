import User from "../models/User.js";
import bcrypt from "bcrypt";
const saltRounds = 10;

class usersServices {
    async find() {
        try {
            const usersList = await User.find();
            return usersList;
        } catch (error) {
            throw new Error("Error fetching users: " + error.message);
        }
    }

    async findById(id) {
        try {
            const user = await User.findById(id);
            if (!user) throw new Error("User not found");
            return user;
        } catch (error) {
            throw new Error("Error fetching user: " + error.message);
        }
    }

    async changeUser(
        id,
        { firstName, lastName, phone, username, password, avatar }
    ) {
        try {
            const user = await User.findById(id);
            if (!user) throw new Error("User not found");

            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (phone) user.phone = phone;
            if (username) user.username = username;
            if (avatar) user.avatar = avatar;

            if (password) {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                user.password = hashedPassword;
            }

            await user.save();

            return {
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                role: user.role,
                permissions: user.permissions,
                avatar: user.avatar,
            };
        } catch (error) {
            throw new Error("Error updating user: " + error.message);
        }
    }
}

export default new usersServices();
