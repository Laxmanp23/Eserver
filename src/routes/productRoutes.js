const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware =require ("../middlewares/authMiddleware");

router.get('/getproduct',productController.getProducts,authMiddleware);
router.post('/createproduct',productController.createProduct,authMiddleware);

module.exports = router;