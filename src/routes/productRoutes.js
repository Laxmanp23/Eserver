// src/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require ('../middlewares/authMiddleware');

// Protected routes
router.post('/createProduct',authMiddleware , productController.createProduct);
router.get('/getProducts', authMiddleware ,productController.getProducts);
router.get('/productid', authMiddleware, productController.getProductById);

// router.get('/product/:id',authMiddleware,productController.getProductById);
router.put('/updateProduct',authMiddleware,productController.updateProduct);
router.delete('/deleteProduct',authMiddleware,productController.deleteProduct);
module.exports = router;