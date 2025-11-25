// dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads variables from .env file

// Import Plant model
const Plant = require('./models/Plant');

// Initialize the App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware 
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows server to parse JSON data sent in requests

// Connect to MongoDB
// Use the variable MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// API Routes 

// Get all plants
app.get('/api/plants', async (req, res) => {
  try {
    
    const plants = await Plant.find().sort({ createdAt: -1 }); // Sorting by newest 
    res.json(plants); // Sending the list back to the frontend
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new plant
app.post('/api/plants', async (req, res) => {
  try {
    // Create a new Plant using the data sent in the request body
    const newPlant = new Plant({
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      stockLevel: req.body.stockLevel,
      supplier: req.body.supplier
    });

    // Save it to the database
    const savedPlant = await newPlant.save();
    
    // Send back the saved plant 
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});