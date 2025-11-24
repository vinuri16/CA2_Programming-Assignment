const mongoose = require('mongoose');

// This Schema defines the structure of a "Plant" in our database
const PlantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // The plant MUST have a name
  },
  type: {
    type: String, 
    required: true,
    enum: ['Indoor', 'Outdoor', 'Succulent'] // Optional: Restrict to specific types
  },
  price: {
    type: Number,
    required: true
  },
  stockLevel: {
    type: Number,
    required: true,
    default: 0 // Default to 0 if not specified
  },
  supplier: {
    type: String,
    required: false
  },
  // We can add a "createdAt" timestamp automatically
}, { timestamps: true });

module.exports = mongoose.model('Plant', PlantSchema);