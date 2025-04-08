const router = require("express").Router();
const PizzaModel = require("../models/Pizza.model");

// Create Pizza

router.post("/create", async (req, res) => {
  try {
    const ResponseFromDB = await PizzaModel.create(req.body);
    res.status(201).json(ResponseFromDB);
  } catch {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble creating your pizza" });
  }
});

// Get all pizzas

router.get("/all-pizzas", async (_, res) => {
  try {
    const pizzaResponse = await PizzaModel.find();
    res.status(200).json({ allPizzas: pizzaResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble getting pizzas" });
  }
});

//update the pizza title
router.patch("/update-pizza/:pizzaId", async (req, res) => {
  try {
    const updatedPizza = await PizzaModel.findByIdAndUpdate(
      req.params.pizzaId,
      req.body,
      { new: true }
    );

    console.log("pizza updated", updatedPizza);
    res.status(200).json(updatedPizza);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble finding all the pizzas" });
  }
});

//delete a pizza
router.delete("/delete-pizza/:pizzaId", async (req, res) => {
  const { pizzaId } = req.params;
  try {
    const deletedPizza = await PizzaModel.findByIdAndDelete(pizzaId);
    console.log("pizza deleted", deletedPizza);
    res.status(204).json({ message: "pizza deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble deleting the pizza" });
  }
});

module.exports = router;
