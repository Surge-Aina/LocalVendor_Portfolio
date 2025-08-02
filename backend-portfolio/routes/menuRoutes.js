const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

router.get("/", getMenuItems);
router.post("/", upload.single("image"), createMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenuItem);

module.exports = router;
