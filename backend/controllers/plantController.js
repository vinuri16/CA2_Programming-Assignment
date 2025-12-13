const Plant = require("../models/Plant");

// 1. GET ALL PLANTS
exports.getAllPlants = async (req, res) => {
  try {
    console.log("Request to Get All Plants");

    // Extract search and sort values from the URL
    const searchText = req.query.search;
    const sortType = req.query.sort;

    console.log("Search Term:", searchText);
    console.log("Sort Type:", sortType);

    // Build the database query
    let filter = {};

    // filter by name
    if (searchText) {
      filter = {
        name: {
          $regex: searchText,
          $options: "i",
        },
      };
    }

    // Show newest plants first
    let sortOrder = { createdAt: -1 };

    if (sortType === "price_asc") {
      sortOrder = { price: 1 }; // Lowest price first
    } else if (sortType === "price_desc") {
      sortOrder = { price: -1 }; // Highest price first
    } else if (sortType === "name") {
      sortOrder = { name: 1 };
    }

    // Fetch from MongoDB
    const plants = await Plant.find(filter).sort(sortOrder);

    console.log("Found ${plants.length} plants.");
    res.status(200).json(plants);
  } catch (error) {
    console.error("Error getting plants:", error);
    res.status(500).json({ message: "Server Error: Could not get plants." });
  }
};

// 2. GET SINGLE PLANT
exports.getPlantById = async (req, res) => {
  try {
    const plantId = req.params.id;
    console.log("Looking for plant with ID:", plantId);

    const plant = await Plant.findById(plantId);

    // Check if plant actually exists
    if (!plant) {
      console.log("Plant not found.");
      return res.status(404).json({ message: "Plant not found in database" });
    }

    res.status(200).json(plant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. CREATE NEW PLANT
exports.createPlant = async (req, res) => {
  try {
    console.log("Creating New Plant");
    console.log("Data received:", req.body);

    // Create a new Plant object using the data sent
    const newPlant = new Plant({
      name: req.body.name,
      type: req.body.type,
      price: req.body.price,
      stockLevel: req.body.stockLevel,
      supplier: req.body.supplier,
    });

    // Save to database
    const savedPlant = await newPlant.save();

    console.log("Plant saved successfully with ID:", savedPlant._id);
    res.status(201).json(savedPlant);
  } catch (error) {
    console.error("Error creating plant:", error.message);
    res
      .status(400)
      .json({ message: "Error creating plant. Please check your data." });
  }
};

// 4. UPDATE PLANT
exports.updatePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    const updates = req.body;

    console.log(`Updating plant ${plantId} with:`, updates);

    const updatedPlant = await Plant.findByIdAndUpdate(plantId, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPlant) {
      return res.status(404).json({ message: "Plant not found to update" });
    }

    res.status(200).json(updatedPlant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 5. DELETE PLANT
exports.deletePlant = async (req, res) => {
  try {
    const plantId = req.params.id;
    console.log("Deleting plant:", plantId);

    const deletedPlant = await Plant.findByIdAndDelete(plantId);

    if (!deletedPlant) {
      return res.status(404).json({ message: "Plant not found to delete" });
    }

    res.status(200).json({ message: "Plant successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
