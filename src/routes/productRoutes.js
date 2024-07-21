// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require ('../middlewares/authMiddleware');

// Protected routes
router.post('/createProduct',authMiddleware , productController.createProduct),
router.get('/getProducts', authMiddleware ,productController.getProducts)

module.exports = router;