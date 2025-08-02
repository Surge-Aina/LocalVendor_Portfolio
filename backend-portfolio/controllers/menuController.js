const MenuItem = require("../models/MenuItems");

// @desc Fetch all menu items
exports.getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Server error fetching menu items" });
  }
};

// @desc Create a new menu item
exports.createMenuItem = async (req, res) => {
  //console.log("Incoming Form Data:", req.body);
  const { name, price, category, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : "";

  try {
    const menuItem = new MenuItem({
      name,
      price,
      category,
      description,
      image,
    });
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (err) {
    res.status(400).json({ error: "Failed to create menu item" });
  }
};

exports.updateMenuItem = async (req, res) => {
  // const { name, description, category, price } = req.body;
  const updateData = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category, // <-- include this
  };

  if (req.file) {
    updateData.image = `/uploads/${req.file.filename}`;
  }

  try {
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(400).json({ error: "Failed to update menu item" });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const deleted = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting item" });
  }
};
