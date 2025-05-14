import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from 'cors';
import connectDB from "./config/db.js";
import authorizationRoutes from "./routes/authorizationRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

connectDB();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use("/authorization", authorizationRoutes);
app.use("/users", usersRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
