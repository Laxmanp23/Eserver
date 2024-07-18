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
// Enable CORS for all routes
app.use(cors());
// Define CORS options
// const corsOptions = {
//   origin: 'https://efrontend-two.vercel.app', // or whatever your front-end origin is
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

// Or, to allow only specific origins:
// app.use(cors({
//   origin: 'http://localhost:3000' // Adjust this to match the URL of your frontend
// }));

// Parse JSON bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// Import routes
app.use("/api", userRoutes,productRoutes);
// app.use("/api/createproduct",productRoutes)

// Default home /api route
app.get("/", (req, res) => {
  res.send("welcome to Nodejs Server!");
});

// Load SSL certificate and private key
const privateKeyPath = path.resolve(__dirname, "src/cert", "server.key");
const certificatePath = path.resolve(__dirname, "src/cert", "server.cert");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const credentials = { key: privateKey, cert: certificate };

sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 3001;
  const httpsServer = https.createServer(credentials , app);

  httpsServer.listen(PORT, () => {
    // console.log(`Serve is running on Port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
});


// /**
//  * Synchronizes the Sequelize models with the database and starts the server.
//  * 
//  * @param {boolean} force - Whether to force sync the models with the database.
//  * @returns {Promise} - A promise that resolves when the server is running.
//  */
// sequelize.sync({ force: false }).then(() => {
//   const PORT = process.env.PORT || 3001;
//   const httpServer = http.createServer(app);

//   httpServer.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//   });
// });
