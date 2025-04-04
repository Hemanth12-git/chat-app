const express = require('express');
const router = express.Router();

const MessageController = require('../controller/message-controller');
const protectRoutes = require('../middleware/auth-middleware');

router.post('/users', protectRoutes, MessageController.getUsersForSidebar);

module.exports = router;