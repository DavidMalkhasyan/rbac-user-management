import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./models/User.js";

const MONGO_URI = "mongodb://127.0.0.1:27017/RBAC";

try {
    await mongoose.connect(MONGO_URI);

    const exists = await User.findOne({ username: "superadmin" });
    if (exists) {
        console.log("Super-admin already exists");
        process.exit(0);
    }

    const hash = await bcrypt.hash("1111", 10);

    await User.create({
        email: "superadmin@gmial.com",
        username: "superadmin",
        password: hash,
        role: "admin",
        permissions: {
            canEditClients: true,
            canDeleteClients: true,
            canAddClients: true,
        },
        phone: `+380123456789${i}`,
        avatar: "avatar.svg",
        status: "Active",
        firstName: "Super",
        lastName: "Admin",
    });

    process.exit(0);
} catch (err) {
    process.exit(1);
}
