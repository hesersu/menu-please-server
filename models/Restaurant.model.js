const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the Restaurant model to whatever makes sense in this case
const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required."],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    restaurantImage: {
      type: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Restaurant = model("Restaurant", restaurantSchema);

module.exports = Restaurant;
