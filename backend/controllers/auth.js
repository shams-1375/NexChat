import User from "../models/User.js"
import jwt from "jsonwebtoken"
import { upsertStreamUser } from "../stream/Stream.js"


export const Signup = async (req, res) => {
    const { email, password, fullName } = req.body

    try {
        if (!email || !password || !fullName) {
           return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password.length < 6) {
           return res.status(400).json({
                success: false,
                message: "Password must be of atleast 6 Characters"
            })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
          return  res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const idx = Math.floor(Math.random() * 100) + 1
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || "",
            })
            console.log(`Stream User Created for ${newUser.fullName}`)
        } catch (error) {
            console.log("Error Creating Stream User")
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Invalid Email or Password" })

        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid Email or Password" })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


export const Logout = async (req, res) => {
    res.clearCookie("jwt")
    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
}

export const onboard = async (req, res) => {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location, } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, bio, nativeLanguage, learningLanguage, location, isOnboarded: true, }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Onboarding Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};