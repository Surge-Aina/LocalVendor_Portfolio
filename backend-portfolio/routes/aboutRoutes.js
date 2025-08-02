const express = require("express");
const upload = require("../config/multer");
const router = express.Router();
const {
  getAllAbouts,
  createAbout,
  updateAbout,
  imageUpload,
  deleteAbout,
} = require("../controllers/aboutController");

router.get("/", getAllAbouts);
router.post(
  "/about",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "gridImages", maxCount: 6 },
  ]),
  createAbout
);
router.put(
  "/",
  upload.fields([
    { name: "bannerImage", maxCount: 1 },
    { name: "gridImages", maxCount: 5 },
  ]),
  updateAbout
);

router.post("/upload-grid-images", upload.array("images", 10), imageUpload);

router.delete("/:id", deleteAbout);

module.exports = router;
