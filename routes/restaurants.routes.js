const router = require("express").Router();
const RestaurantModel = require("../models/Restaurant.model");

// Create restaurant

router.post("/create", async (req, res) => {
  try {
    const ResponseFromDB = await RestaurantModel.create(req.body);
    res.status(201).json(ResponseFromDB);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble creating restaurant" });
  }
});

// Get all restaurants

router.get("/all-restaurants", async (_, res) => {
  try {
    const restaurantResponse = await RestaurantModel.find();
    res.status(200).json({ allRestaurants: restaurantResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble getting restaurants" });
  }
});

//update the restaurant
router.patch("/update-restaurants/:restaurantId", async (req, res) => {
  try {
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      req.params.restaurantId,
      req.body,
      { new: true }
    );

    console.log("restaurant updated", updatedRestaurant);
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ errorMessage: "Trouble finding all the restaurants" });
  }
});

//delete a restaurant
router.delete("/delete-restaurant/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const deletedRestaurant = await RestaurantModel.findByIdAndDelete(
      restaurantId
    );
    console.log("restaurant deleted", deletedRestaurant);
    res.status(204).json({ message: "restaurant deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble deleting the restaurant" });
  }
});

module.exports = router;
