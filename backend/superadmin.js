import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/RBAC";

async function createSuperAdmin() {
    try {
        await mongoose.connect(MONGO_URI);

        const exists = await User.findOne({ username: "superadmin" });
        if (exists) {
        } else {
            const hash = await bcrypt.hash("1111", 10);

            await User.create({
                email: "superadmin@gmail.com",
                username: "superadmin",
                password: hash,
                role: "admin",
                permissions: {
                    canEditClients: true,
                    canDeleteClients: true,
                    canAddClients: true,
                },
                phone: `+3801234567890`,
                avatar: "",
                status: "active",
                firstName: "Super",
                lastName: "Admin",
            });

        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Error creating super-admin:", err);
        process.exit(1);
    }
}

createSuperAdmin();