const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
  x: Number, // relative X (0 to 1)
  y: Number, // relative Y (0 to 1)
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItems" },
  label: String,
});

const TaggedImageSchema = new mongoose.Schema({
  imageUrl: String,
  tags: [TagSchema],
});

module.exports = mongoose.model("TaggedImage", TaggedImageSchema);
