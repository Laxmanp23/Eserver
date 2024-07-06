const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/getproduct',productController.getProducts);
router.post('/createproduct',productController.createProduct);

module.exports = router;