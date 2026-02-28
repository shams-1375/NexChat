import express from 'express'
import { Login, Logout, onboard, Signup, updateProfile } from '../controllers/auth.js'
import { protectedRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post("/signup", Signup )
router.post("/login", Login)
router.post("/logout", Logout)
router.post("/onboarding", protectedRoute ,onboard)
router.put("/update-profile", protectedRoute, updateProfile);

router.get("/me", protectedRoute, (req, res) => {
    res.status(200).json({success: true, user: req.user})
})

export default router