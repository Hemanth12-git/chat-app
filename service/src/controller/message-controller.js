const User = require("../models/user");
const Message = require("../models/message");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, getIoInstance } = require("../lib/socket");

class MessageController {
  static async getUsersForSidebar(req, res) {
    let response;
    try {
      const loggedUserId = req.user._id;

      const filteredUsers = await User.find({
        _id: { $ne: loggedUserId },
      }).select("-password");

      response = { status: 200, body: filteredUsers };
    } catch (e) {
      response = { status: 500, body: { message: "Internal server error" } };
    }

    res.status(response.status).json(response.body);
  }

  static async getMessages(req, res) {
    let response;
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;

      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });

      response = { status: 200, body: messages };
    } catch (e) {
      response = { status: 500, body: { message: "Internal server error" } };
    }

    res.status(response.status).json(response.body);
  }

  static async sendMessage(req, res) {
    let response;
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

      const receiverSocketId = getReceiverSocketId(receiverId);
      const io = getIoInstance();

      if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      response = { status: 201, body: newMessage };
    } catch (e) {
      response = { status: 500, body: { message: "Internal server error" } };
    }

    res.status(response.status).json(response.body);
  }
}

module.exports = MessageController;
