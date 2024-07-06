const express = require("express");
const app = express();
const sequelize = require("./src/config/database");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
// Define routes
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require('./src/routes/productRoutes');

// Load environment variables from .env file
// require("dotenv").config();

const router = express.Router();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Import routes
app.use("/api", userRoutes,productRoutes);
// app.use("/api/createproduct",productRoutes)

// Default home /api route
app.get("/", (req, res) => {
  res.send("welcome to Nodejs Server!");
});
// app.listen(3000, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// Load SSL certificate and private key
const privateKeyPath = path.resolve(__dirname, "src/cert", "ers.key");
const certificatePath = path.resolve(__dirname, "src/cert", "ers.pem");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const credentials = { key: privateKey, cert: certificate };

sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 3000;
  const httpsServer = https.createServer( credentials,app);

  httpsServer.listen(PORT, () => {
    // console.log(`Serve is running on Port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
});
