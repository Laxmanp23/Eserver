const express = require("express");
const app = express();
const multer = require('multer')
const sequelize = require("./src/config/database");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
// Define routes
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require('./src/routes/productRoutes');
const uploadfile = require('./src/controllers/uploadfile')
// Enable CORS for all routes
app.use(cors());
// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// upload image
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
app.use("/api", userRoutes,productRoutes,uploadfile);
// Default home /api route
app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views',path.join(__dirname, 'src','views')); // Set the directory where EJS files are located
//ejs routes

app.get("/", (req, res) => {
  res.render('index',{title:"hello ejs"});
});
app.get("/create",(req,res)=>{
  res.render('create',{title:"upload a new product"})
})

// Load SSL certificate and private key
const privateKeyPath = path.resolve(__dirname, "src/cert", "server.key");
const certificatePath = path.resolve(__dirname, "src/cert", "server.cert");
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const certificate = fs.readFileSync(certificatePath, "utf8");
const credentials = { key: privateKey, cert: certificate };

sequelize.sync({ force: false}).then(() => {
  const PORT = process.env.PORT;
  const httpsServer = https.createServer(credentials , app);
  httpsServer.listen(PORT, () => {
    // console.log(`Serve is running on Port ${PORT}`);
    console.log(`Server is running on port ${PORT}`);
  });
});