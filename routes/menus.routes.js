const router = require("express").Router();
const MenuModel = require("../models/Menus.model");
const uploader = require("../middlewares/cloudinary.middleware");
const mongoose = require("mongoose");

// Create menu

router.post("/create", uploader.single("menuImg"), async (req, res) => {
  //   if(!req.file){
  //   try {
  //     const ResponseFromDB = await MenuModel.create(req.body);
  //     res.status(201).json(ResponseFromDB);
  //   } catch {
  //     console.log(err);
  //     res.status(500).json({ errorMessage: "Trouble creating menu" });
  //   }
  // } else {
  try {
    const menuToCreate = {
      ...req.body,
      menuImg: req.file.path,
    };
    console.log(menuToCreate);
    const ResponseFromDB = await MenuModel.create(menuToCreate);
    res.status(201).json(ResponseFromDB);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble creating menu" });
  }
});

// Get all menus

router.get("/all-menus", async (_, res) => {
  try {
    const menuResponse = await MenuModel.find();
    res.status(200).json({ allMenus: menuResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble getting menus" });
  }
});

//Get all menus for one user
router.get("/all-menus-one-user", async (req, res) => {
  const { ownerId } = req.query;
  console.log("this is the userId", ownerId);
  try {
    const menuResponse = await MenuModel.find({owner_id: new mongoose.Types.ObjectId(ownerId)})
    .populate("restaurant_id");
    res.status(200).json({ allMenusForOneUser: menuResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble getting menus" });
  }
});

// Get one menu
router.get("/one-menu/:menuId", async (req, res) => {
  try {
    const menuResponse = await MenuModel.findById(req.params.menuId);
    res.status(200).json({ oneMenu: menuResponse });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble getting one menu" });
  }
});

//update the menu
router.patch("/update-menu/:menuId", async (req, res) => {
  try {
    const updatedMenu = await MenuModel.findByIdAndUpdate(
      req.params.menuId,
      req.body,
      { new: true }
    );

    console.log("menu updated", updatedMenu);
    res.status(200).json(updatedMenu);
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble finding all the menus" });
  }
});

//delete a menu
router.delete("/delete-menu/:menuId", async (req, res) => {
  const { menuId } = req.params;
  try {
    const deletedMenu = await MenuModel.findByIdAndDelete(menuId);
    console.log("menu deleted", deletedMenu);
    res.status(204).json({ message: "menu deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: "Trouble deleting the menu" });
  }
});

module.exports = router;
