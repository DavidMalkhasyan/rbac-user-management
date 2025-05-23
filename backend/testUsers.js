import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/RBAC";

async function createUsers() {
    try {
        await mongoose.connect(MONGO_URI);

        const hash = await bcrypt.hash("1111", 10);

        for (let i = 0; i < 20; i++) {
            const email = `user${i + 1}@gmail.com`;
            const username = `user${i + 1}`;

            const userExists = await User.findOne({ username });
            if (userExists) {
                continue;
            }

            await User.create({
                email,
                username,
                password: hash,
                role: "user",
                permissions: {
                    canEditClients: false,
                    canDeleteClients: false,
                    canAddClients: false,
                },
                phone: `+380123456789${i}`,
                avatar: "",
                status: "active",
                firstName: `userName${i + 1}`,
                lastName: `userLastname${i + 1}`,
            });

        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Error creating users:", err);
        process.exit(1);
    }
}

createUsers();
