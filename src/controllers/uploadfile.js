const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload'); // Adjust the path as needed

router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // const additionalField = req.body.additionalField;

  res.status(200).json({ 
    message: 'File uploaded successfully', 
    file: req.file ,
    // additionalField: additionalField,
  });

});

module.exports = router;

