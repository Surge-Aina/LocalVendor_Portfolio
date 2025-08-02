const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, default: "Uncategorized" },
    image: String, // optional for future use
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItems", menuItemSchema);
