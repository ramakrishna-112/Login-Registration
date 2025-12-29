import express from "express"
import { Login, Register } from "../controllers/Authcontroller.js"
import { authenticate } from "../middleware/authenticate.js"

const router = express.Router()

// Register user
router.post("/register", Register)

// Login user
router.post("/login", Login)

// Get logged-in user (protected)
router.get("/get-user", authenticate, (req, res) => {
  res.status(200).json({
    status: true,
    user: req.user
  })
})

export default router
