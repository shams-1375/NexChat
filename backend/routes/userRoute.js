import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { acceptFriendRequest, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUser, sendFriendRequest } from '../controllers/user.js'

const router = express.Router()

router.use(protectedRoute)

router.get("/", getRecommendedUser)
router.get("/friends", getMyFriends)
router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)
router.get("/friend-requests", getFriendRequests )
router.get("/outgoing-friend-requests", getOutgoingFriendReqs )

export default router