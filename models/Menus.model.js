const { Schema, model } = require("mongoose");

const menusSchema = new Schema(
  {
    owner_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant_id: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      //add that required true later
    },
    language: {
      type: String,
      enum: ["Chinese", "Japanese", "Korean"],
      required: true,
    },

    menuImg: {
      type: String,
      required: true,
    },
    dishes: [
      {
        categoryOriginal: { type: String },
        categoryEnglish: { type: String },
        nameOriginal: { type: String },
        nameEnglish: { type: String },
        phoneticPronunciation: { type: String },
        descriptionEnglish: { type: String },
        //audio: {type: String },
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Menus = model("Menus", menusSchema);

module.exports = Menus;
