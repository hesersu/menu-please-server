// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// Auth Routes here
const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// Menus Routes here
const menuRoutes = require("./routes/menus.routes");
app.use("/menus", menuRoutes);

// Restaurant Routes here
const restaurantRoutes = require("./routes/restaurants.routes");
app.use("/restaurants", restaurantRoutes);

// Gemini Routes here
const geminiRoutes = require("./routes/gemini.routes");
app.use("/gemini", geminiRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
