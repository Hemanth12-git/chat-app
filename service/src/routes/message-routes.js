const express = require('express');
const router = express.Router();

const MessageController = require('../controller/message-controller');
const protectRoutes = require('../middleware/auth-middleware');

router.get('/users', protectRoutes, MessageController.getUsersForSidebar);
router.get('/:id', protectRoutes, MessageController.getMessages);
router.post('/send/:id', protectRoutes, MessageController.sendMessage);

module.exports = router;