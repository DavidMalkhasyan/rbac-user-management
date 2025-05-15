import mongoose from "mongoose";

export default function connectDB() {
    mongoose
        .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ ")
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB error:", err));
}
