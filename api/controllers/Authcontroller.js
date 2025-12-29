import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/* ========== REGISTER ========== */
export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        status: false,
        message: "User already registered",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return res.status(201).json({
      status: true,
      message: "Registration successful",
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
    })
  }
}

/* ========== LOGIN ========== */
export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ CRITICAL: SET TOKEN AS COOKIE
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // REQUIRED on Render (HTTPS)
      sameSite: "none",    // REQUIRED for Vercel ↔ Render
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};

