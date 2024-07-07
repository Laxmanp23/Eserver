const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
// app.use(authMiddleware);
router.post('/register', userController.registerUser);
// router.post('/getusers', userController.getUserProfile);
router.post('/login',userController.loginUser)
// router.get('/users/:id',  userController.getUser);
// router.post('/signup', userController.signUp);
module.exports = router;