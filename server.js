// 1. Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Loads variables from .env file

// Import our Plant model
const Plant = require('./models/Plant');

// 2. Initialize the App
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware (Tools the server uses)
app.use(cors()); // Allows frontend to talk to backend
app.use(express.json()); // Allows server to parse JSON data sent in requests

// 4. Connect to MongoDB
// We use the variable MONGO_URI from the .env file
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// 5. API Routes (The "CRUD" operations)

// READ: Get all plants
app.get('/api/plants', async (req, res) => {
  try {
    // .find() is a Mongoose method to get all documents
    const plants = await Plant.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(plants); // Send the list back to the frontend
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE: Add a new plant
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
    
    // Send back the saved plant (good for confirmation)
    res.status(201).json(savedPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 6. Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});