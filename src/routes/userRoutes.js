const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/registerUser', userController.registerUser);
router.get('/getusers', userController.getUserProfile);
// router.get('/users/:id',  userController.getUser);
// router.post('/signup', userController.signUp);
module.exports = router;