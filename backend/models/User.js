import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        default: "",
    },
    password: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    permissions: {
        canEditClients: { type: Boolean, default: false },
        canDeleteClients: { type: Boolean, default: false },
        canAddClients: { type: Boolean, default: false },
    },
    status: {
        type: String,
        default: "not Active",
    },
    avatar: {
        type: String,
        default: "",
    },
});

const User = mongoose.model("User", userSchema);
export default User;
