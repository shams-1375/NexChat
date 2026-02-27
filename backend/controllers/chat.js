import { generateStreamToken } from "../stream/Stream.js"


export const getStreamToken = async (req, res) => {
    try {
        const token = await generateStreamToken(req.user.id)

        res.status(200).json({token})

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}