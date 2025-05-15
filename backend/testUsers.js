import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/RBAC";

try {
    await mongoose.connect(MONGO_URI);
    const hash = await bcrypt.hash("1111", 10);
    for (let i = 0; i < 20; i++) {
        await User.create({
            email: `user${i + 1}@gmail.com`,
            username: `user${i + 1}`,
            password: hash,
            role: "user",
            permissions: {
                canEditClients: false,
                canDeleteClients: false,
                canAddClients: false,
            },
            avatar: "",
            status: "active",
            firstName: `userName${i + 1}`,
            lastName: `userLastname${i + 1}`,
        });
    }
    process.exit(0);
} catch (err) {
    process.exit(1);
}
