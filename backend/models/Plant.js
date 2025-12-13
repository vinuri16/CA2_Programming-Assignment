// structure of a Plant in the database
const PlantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["Indoor", "Outdoor"],
    },
    price: {
      type: Number,
      required: true,
    },
    stockLevel: {
      type: Number,
      required: true,
      default: 0,
    },
    supplier: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Plant", PlantSchema);
