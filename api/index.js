import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */

app.use(express.json());
app.use(cookieParser());

// ✅ SIMPLE & SAFE CORS (PRODUCTION READY)
app.use(
  cors({
    origin: [
      "https://login-registration-dusky.vercel.app",
      "https://login-registration-d6lt9uokq-ramakrishna-112s-projects.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


/* ===================== ROUTES ===================== */

app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend is running" });
});

app.use("/api/auth", AuthRoute);

/* ===================== DATABASE + SERVER ===================== */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_CONN)
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
