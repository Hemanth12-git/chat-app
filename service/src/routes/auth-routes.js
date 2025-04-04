const express = require("express");
const AuthController  = require('../controller/auth-controller');
const protectRoutes = require('../middleware/auth-middleware');

const router = express.Router();

router.post('/signup', AuthController.signUpController);

router.post('/login', AuthController.loginController);

router.post('/logout', AuthController.logoutController);

router.put('/update-profile', protectRoutes,  AuthController.updateProfileController);

router.get('/check', protectRoutes, AuthController.checkAuth);

module.exports = router;