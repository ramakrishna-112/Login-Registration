import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import AuthRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */

// Parse JSON
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// ✅ FINAL CORS CONFIG (CRITICAL)
const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://login-registration-dusky.vercel.app", // production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true, // REQUIRED for cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
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
