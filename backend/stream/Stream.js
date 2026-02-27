import {StreamChat} from 'stream-chat'
import 'dotenv/config'


const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret) {
    console.log("Stream API or Secret is Missing")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData])
        return userData
    } catch (error) {
        console.log("Error upserting Stream user", error)
    }
}

export const generateStreamToken = async (userId) => {
    try {
        const userIdStr = userId.toString()
        return streamClient.createToken(userIdStr)
        
    } catch (error) {
       console.log("Error in generating Stream token", error) 
    }
}