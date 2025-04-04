const User = require("../models/user");

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
}

module.exports = MessageController;