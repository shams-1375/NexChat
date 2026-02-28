import FriendRequest from "../models/FriendRequest.js"
import User from "../models/User.js"

export const getRecommendedUser = async (req, res) => {
    try {
        const currentUserId = req.user.id
        const currentUser = req.user

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },  //exclude current user
                { _id: { $nin: currentUser.friends } },  // exclude current user's friends
                { isOnboarded: true }
            ]
        })

        res.status(200).json(recommendedUsers)


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends", "fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(user.friends)


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id
        const { id: recipientId } = req.params

        if (myId === recipientId) return res.status(400).json({ message: "You can't send friend Request to yourself" })

        const recipient = await User.findById(recipientId)
        if (!recipient) return res.status(400).json({ message: "Recepient Not Found" })

        if (recipient.friends.includes(myId)) return res.status(400).json({ message: "You are already friend with this user" })

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
            status: "pending"
        })

        if (existingRequest) return res.status(400).json({ message: "A friend request already exists between you and this user" })

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(200).json({ friendRequest })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params

        const friendRequest = await FriendRequest.findById(requestId)

        if (!friendRequest) return res.status(400).json({ message: "Friend Request Not found" })

        if (friendRequest.recipient.toString() !== req.user.id) return res.status(400).json({ message: "You are not authorized to accept this friend request" })

        friendRequest.status = "accepted"
        await friendRequest.save()

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        })

        res.status(200).json({ message: "Friend Request accepted" })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const declineFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params;
        const deletedRequest = await FriendRequest.findByIdAndDelete(requestId);

        if (!deletedRequest) {
            return res.status(404).json({ message: "Not found" });
        }

        res.status(200).json({ message: "Declined and removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        const incomingRequest = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")

        const acceptedRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted",
        }).populate("recipient", "fullName profilePic")

        res.status(200).json({ incomingRequest, acceptedRequest })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getOutgoingFriendReqs = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage")

        res.status(200).json(outgoingRequests)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getFriendProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const friend = await User.findById(id).select(
            "fullName profilePic nativeLanguage learningLanguage bio location email"
        );

        if (!friend) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(friend);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const removeFriend = async (req, res) => {
    try {
        const myId = req.user.id;
        const { id: friendId } = req.params;

        await User.findByIdAndUpdate(myId, {
            $pull: { friends: friendId }
        });

        await User.findByIdAndUpdate(friendId, {
            $pull: { friends: myId }
        });

        await FriendRequest.findOneAndDelete({
            $or: [
                { sender: myId, recipient: friendId },
                { sender: friendId, recipient: myId }
            ],
            status: "accepted"
        });

        res.status(200).json({ success: true, message: "Friend removed successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};