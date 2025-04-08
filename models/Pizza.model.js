const { Schema, model } = require("mongoose");

const pizzaSchema = new Schema({
  title: {
    type: String,
    required: [true, "Pizza required"],
    unique: true,
  },
  toppings: [String],
  size: {
    type: String,
    enum: ["small", "medium", "large", "xlarge"],
    required: true,
  },
  // Here is the link to the user
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Pizza = model("Pizza", pizzaSchema);

module.exports = Pizza;
