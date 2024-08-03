const express = require('express');
const Product  = require('../models/product'); // Ensure the path is correct
const upload = require('../middlewares/upload')
const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to upload image', error: err.message });
      }

      try {
        const { name, price, description, inStock, categoryId, userId, quantity, sku, status } = req.body;
        if (!name || !price || !description || !categoryId || !userId) {
          return res.status(400).json({ message: 'Required fields are missing' });
        }

        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // Get the image URL

        const newProduct = await Product.create({
          name,
          price,
          description,
          inStock,
          imageUrl,
          categoryId,
          userId,
          quantity,
          sku,
          status: status || 'active'
        });

        res.status(201).json(newProduct);
      } catch (err) {
        console.error('Failed to create product:', err);
        res.status(500).json({ message: 'Failed to create product', error: err.message });
      }
    });
  },




  // createProduct: async (req, res) => {
  //   try {
  //     const { name, price, description, inStock, imageUrl, categoryId, userId, quantity, sku, status } = req.body;
  //     if (!name || !price || !description || !categoryId || !userId) {
  //       return res.status(400).json({ message: "Required fields are missing" });
  //     }
  //     const newProduct = await Product.create({
  //       name,
  //       price,
  //       description,
  //       inStock,
  //       imageUrl,
  //       categoryId,
  //       userId,
  //       quantity,
  //       sku,
  //       status: status || 'active'
  //     });
  //     res.status(201).json(newProduct);
  //   } catch (err) {
  //     console.error("Failed to create product:", err);
  //     res.status(500).json({ message: "Failed to create product", error: err.message });
  //   }
  // },

  // Get all products
  getProducts: async (req, res) => {
    try {
      const products = await Product.findAll();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get a single product by ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params; // Assuming the parameter name in the route is 'id'
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, description, inStock, imageUrl, categoryId, quantity, sku, status } = req.body;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      product.name = name;
      product.price = price;
      product.description = description;
      product.inStock = inStock;
      product.imageUrl = imageUrl;
      product.categoryId = categoryId;
      product.quantity = quantity;
      product.sku = sku;
      product.status = status;

      await product.save();
      res.json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      await product.destroy();
      res.status(204).json();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = productController;




// const Product = require("../models/product");
// const { Op } = require("sequelize");
// // Create a new product
// const createProduct = async (req, res) => {
//   try {
//     const { name, price, description, inStock } = req.body;
//     const userId = req.user; // Assuming 'user' is attached to 'req' by your authentication middleware
//     console.log(userId);
//     if (!name || !price || !description || !userId) {
//       return res
//         .status(400)
//         .json({ message: "All fields including user ID must be provided" });
//     }

//     const newProduct = await Product.create({
//       name,
//       price,
//       description,
//       inStock: inStock || true,
//       userId, // Storing the creator's user ID
//     });

//     res.status(201).json(newProduct);
//   } catch (err) {
//     console.error("Failed to create product:", err);
//     res
//       .status(500)
//       .json({ message: "Failed to create product", error: err.message });
//   }
// };

// // Get all products
// const getProducts = async (req, res) => {
//   try {
//     const userId = req.user;
//     // console.log(userId);
//     const products = await Product.findAll({
//       where: { userId },
//     });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Get a single product by ID
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.body; // Assuming the parameter name in the route is 'id'
//     const userId = req.user; // Assuming 'user' is attached to 'req' by your authentication middleware

//     const product = await Product.findOne({
//       where: {
//         id: id, // Use the ID to find the product
//         userId: userId, // Optional: if you want to ensure the product belongs to the user
//       },
//     });

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Update a product
// const updateProduct = async (req, res) => {
//   try {
//     const userId = req.user;
//     const { id } = req.body;
//     console.log("laxman product id is", id);
//     const { name, price, description, inStock } = req.body;
//     const product = await Product.findOne({
//       where: {
//         id: id,
//         userId: userId,
//       },
//     });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     product.id = id;
//     product.name = name;
//     product.price = price;
//     product.description = description;
//     product.inStock = inStock;
//     await product.save();
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete a product
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.body;
//     const userId = req.user;

//     const product = await Product.findOne({
//       where: {
//         id: id,
//         userId: userId,
//       },
//     });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     await product.destroy();
//     res.status(204).json();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
// };
