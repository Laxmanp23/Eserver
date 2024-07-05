const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/users', userController.createUser);
router.get('/users/:id', authMiddleware.verifyToken, userController.getUser);

module.exports = router;
