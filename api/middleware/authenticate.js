import jwt from "jsonwebtoken"

export const authenticate = (req, res, next) => {
  try {
    // Expect token in Authorization header: Bearer <token>
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized: Token missing"
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded
    next()

  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized: Invalid or expired token"
    })
  }
}
