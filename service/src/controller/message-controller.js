const User = require("../models/user");
const Message = require("../models/message");

class MessageController {
    static async getUsersForSidebar(req, res) {
        try {
            const loggedUserId = req.user._id;
            const filteredUsers = await User.find({
                _id: {$ne: loggedUserId},
            }).select('-password');

            res.status(200).json(filteredUsers);
        } catch (e) {
            res.status(500).json({ message: 'internal server eror'});
        }
x
        
    }

    static async getMessages(req, res) {
        const { id: userToChatId } = req.params;
        try {
            const myId = req.user._id;
            const messages = await Message.find({
                $or: [
                    { senderId: myId, receiverId: userToChatId },
                    { senderId: userToChatId, receiverId: myId }
                ]
            });
    
            res.status(200).json(messages);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async sendMessage(req, res) {
        try {
            const { text, image } = req.body;
            const { id: receiverId } = req.params;
            const senderId = req.user._id;
    
            let imageUrl = null;
            if (image) {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            }
    
            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl,
            });
    
            await newMessage.save();
    
            res.status(201).json(newMessage);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }    
    
}

module.exports = MessageController;