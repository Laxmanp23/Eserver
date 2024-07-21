// src/controllers/ProductController.js
const { Op } = require("sequelize");
const Joi = require("joi");
const excelToJson = require("convert-excel-to-json");
const Product = require("../models/Product");
const generateProductID = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let productID = "";
  for (let i = 0; i < 9; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    productID += characters.charAt(randomIndex);
  }
  return productID;
};

const productController = {
  // Create a new product
  createProduct: async (req, res) => {
    try {
      // Access shop_id from the request object
      const { shop_id } = req;
      // Retrieve the user's IP address from the request object
      const ipAddress = req.ip || req.connection.remoteAddress;

      // Define a concise Joi schema for validation
      const schema = Joi.object({
        pname: Joi.string().required(),
        // brand: Joi.string(),

        brand: Joi.string().optional().allow(""),
        cat: Joi.string(),
        hsn: Joi.string().optional().allow(""), // Make hsn optional
        size: Joi.string(),
        utype: Joi.string(),
        stock: Joi.number().default(0),
        mrp_price: Joi.number(),
        price: Joi.number(),
        gst_rate: Joi.number(),
        tax_type: Joi.string(),
        purchase_price: Joi.number(),
        profit: Joi.number(),
        sale_price: Joi.number(),
        srate: Joi.number(),
        sts: Joi.boolean().default(true),
        note: Joi.string().optional().allow(""), // Make note optional
      }).options({ abortEarly: false, stripUnknown: true });

      // Validate request body against the schema
      const { error, value } = schema.validate(req.body);

      if (error) {
        return res.status(400).json({
          error: true,
          message: error.details.map((detail) => detail.message),
        });
      }

      const uniqueProductID = generateProductID();
      // console.log('uniqueProductID : ', uniqueProductID);

      // If validation passes, create the product with the associated shop_id
      const newProduct = await Product.create({
        ...value,
        shop_id,
        product_id: uniqueProductID,
        ip: ipAddress,
      });

      res.status(201).json({
        error: false,
        message: "Product created successfully",
        data: newProduct,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // Get a list of products
  getProductList: async (req, res) => {
    try {
      const { shop_id } = req;

      // Adding where condition to filter by shop_id
      const products = await Product.findAll({
        where: {
          shop_id: shop_id,
        },
      });

      if (products.length > 0) {
        res.status(200).json({ error: false, products });
      } else {
        res.status(404).json({
          error: true,
          message: "Products not found for the given shop_id",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  findProduct: async (req, res) => {
    try {
      const { shop_id } = req;
      const { pname } = req.body; // Assuming you're sending the product name in the request body

      // Adding where condition to filter by shop_id and pname with case-insensitive partial match
      const product = await Product.findAll({
        where: {
          shop_id: shop_id,
          pname: {
            [Op.like]: `%${pname}%`, // Using [Op.iLike] for case-insensitive like
          },
        },
      });

      if (product) {
        res.status(200).json({ error: false, data: product });
      } else {
        res.status(404).json({
          error: true,
          message: "Product not found for the given pname",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // Update a product
  updateProduct: async (req, res) => {
    try {
      // Extract the productId from the request parameters
      const { productId } = req.params;
      console.log("Updating product with ID:", productId);

      // Log the request body for debugging purposes
      console.log("Request body:", req.body);

      // Update the product using the Product model and Sequelize
      const [updatedCount, updatedProducts] = await Product.update(req.body, {
        where: { id: productId },
        returning: true,
      });

      // Check if any products were updated
      if (updatedCount === 0) {
        console.log("Product not found for update.");
        res.status(404).json({ error: true, message: "Product not found" });
      } else {
        console.log("Product updated successfully:", updatedProducts[0]);
        // If products were updated, send a success response with the updated product data
        res.status(200).json({
          error: false,
          message: "Product updated successfully",
          data: updatedProducts[0],
        });
      }
    } catch (error) {
      // Handle any errors that occur during the update process
      console.error("Error updating product:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  // Delete a product
  deleteProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const deletedCount = await Product.destroy({
        where: { id: productId },
      });

      if (deletedCount === 0) {
        res.status(404).json({ error: true, message: "Product not found" });
      } else {
        res
          .status(204)
          .json({ error: false, message: "Product deleted successfully" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },

  uploadProducts: async (req, res) => {
    try {
      // Access shop_id from the request object
      const { shop_id } = req;

      // Extract the file buffer from the request
      const fileBuffer = req.file.buffer;
       console.log("File buffer:", fileBuffer);

      // Convert Excel data to JSON
      const excelData = excelToJson({
        source: fileBuffer,
        header: { rows: 1 }, // Assuming the first row contains headers
      });
       console.log("Excel data:", excelData);

      // Iterate through each row in the Excel data
      for (const row of excelData.Sheet) {
        // console.log("Processing row:", row);

        // Extract data from the row object
        const {
          A: pname,
          B: brand,
          C: cat,
          D: hsn,
          E: size,
          F: utype,
          G: stock,
          H: mrp_price,
          I: sale_price,
          J: gst_rate,
          K: tax_type,
          L: purchase_price,
          M: profit,
          P: srate,
          Q: note,
        } = row;

        // Create a new product using extracted data
        try {
          const newProduct = await Product.create({
            pname,
            brand,
            cat,
            hsn,
            size,
            utype,
            stock,
            mrp_price,
            sale_price,
            gst_rate,
            tax_type,
            purchase_price,
            profit,
            srate,
            note,
            price: purchase_price,
            // Customize this part according to your Excel sheet's structure
            product_id: generateProductID(),
            // Add shop_id, ip, and other necessary fields
            shop_id: shop_id,
          });

          console.log("New product created:", newProduct);
        } catch (error) {
          console.error("Error creating product:", error);
          // Handle error appropriately
        }
      }

      // Send success response
      res.json({ error: false,  message: "Products added successfully" });
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      res.status(500).json({ error: true, message: "Internal Server Error" });
    }
  },
};

module.exports = productController;