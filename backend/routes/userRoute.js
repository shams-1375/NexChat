import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js'
import { acceptFriendRequest, declineFriendRequest, getFriendProfile, getFriendRequests, getMyFriends, getOutgoingFriendReqs, getRecommendedUser, removeFriend, sendFriendRequest } from '../controllers/user.js'

const router = express.Router()

router.use(protectedRoute)

router.get("/", getRecommendedUser)
router.get("/friends", getMyFriends)
router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest)
router.get("/friend-requests", getFriendRequests )
router.get("/outgoing-friend-requests", getOutgoingFriendReqs )
router.delete("/friend-request/:id/decline", declineFriendRequest);
router.get("/friends/:id", getFriendProfile);
router.delete("/friends/:id", removeFriend);

export default router