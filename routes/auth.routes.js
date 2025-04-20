const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// Create a route to make a user with an
router.post("/signup", async (req, res) => {
  try {
    const salt = bcryptjs.genSaltSync();
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
      ...req.body,
      password: hashedPassword,
    };
    const newUser = await UserModel.create(hashedUser);
    console.log("user created successfully", newUser);
    res.status(201).json({ message: "User successfully create in DB" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Find user based on their e-mail
router.post("/login", async (req, res) => {
  try {
    // Finding a user
    const foundUser = await UserModel.findOne({ email: req.body.email });
    if (!foundUser) {
      res
        .status(400)
        .json({ errorMessage: "Invalid email or password. Please try again." });
    } else {
      // Compare passwords when found user
      const passwordFromFrontend = req.body.password;
      const passwordHashedInDB = foundUser.password;
      const passwordsMatch = bcryptjs.compareSync(
        passwordFromFrontend,
        passwordHashedInDB
      );
      console.log("Match?", passwordsMatch);
      if (!passwordsMatch) {
        res.status(400).json({
          errorMessage: "Invalid email or password. Please try again.",
        });
      } else {
        // Add non secret data
        const data = { _id: foundUser.id, username: foundUser.username };
        const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "24h",
        });
        res.status(200).json({
          message: "You are logged in!",
          authToken,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Verify route to check if token is present and valid
router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("Token Valid!");
  res.status(200).json({ message: "Token Valid", payload: req.payload });
});

module.exports = router;
