const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protectRoutes = async (req, res, next) => {
    let response;

    try {
        const jwtToken = req.cookies?.['platform-token'];
        if (!jwtToken) {
            response = { status: 401, body: { message: "Unauthorized: No token provided" } };
        } else {
            const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
            const existingUser = await User.findById(decoded.userId).select("-password");

            if (!existingUser) {
                response = { status: 404, body: { message: "User not found" } };
            } else {
                req.user = existingUser;
                return next();
            }
        }
    } catch (error) {
        response = { status: 401, body: { message: "Unauthorized: Invalid or expired token" } };
    }

    res.status(response.status).json(response.body);
};

module.exports = protectRoutes;
