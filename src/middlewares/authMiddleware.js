const User = require('../models/user');
const TokenStore = require('../utils/TokenStore');

const authMiddleware = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization').replace('Bearer ', '');

        // Check if the token exists in the token store and is not expired
        const tokenData = await TokenStore.findOne({
            token: token,
            expirationTime: { $gt: new Date() } // Checks if the token is not expired
        });

        if (!tokenData) {
            throw new Error('Token is invalid or has expired');
        }

        // Find the user associated with the token
        const user = await User.findById(tokenData.userId);

        if (!user) {
            throw new Error('No user found with this token');
        }

        // Attach user to the request object
        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized to access this resource', error: error.message });
    }
};

module.exports = authMiddleware;
