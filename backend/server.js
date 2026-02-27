import express from 'express'
import 'dotenv/config'
import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import chatRoute from './routes/chatRoute.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 5001

const __dirname = path.resolve()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())


app.use('/api/auth', authRoute)
app.use('/api/users', userRoute)
app.use('/api/chat', chatRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.use((req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected Successfully")
    } catch (error) {
        console.log("Connection Failed", error)
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectDB()
})