const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const menuRoutes = require("./routes/menuRoutes");
const bannerRoutes = require("./routes/bannerRoutes");
// const aboutRoutes = require("./routes/aboutRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoute");
const path = require("path");
const taggedImageRoutes = require("./routes/taggedImageRoutes");
const seedAbout = require("./models/seedAbout");

//about route with seeding info only when info doesn't exist
// models/seedAbout.js (suggested)
const aboutRoutes = require("./routes/aboutRoutes");
// const About = require("./About");
// module.exports = async function seedAbout() {
//   const exists = await About.findOne({});
//   if (exists) return; // do nothing
//   await About.create({
//     banner: {
//       title: "About Us",
//       description: "…",
//       shape: "fullscreen",
//       image: "",
//     },
//     contentBlocks: [],
//     gridImages: [],
//   });
// };

// Load env vars
dotenv.config();

// Import DB connection
const connectDB = require("./config/db");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/banner", bannerRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/user", userRoutes);
app.use("/api/tagged", taggedImageRoutes);
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB and start server
const PORT = process.env.PORT || 5100;
connectDB().then(async () => {
  await seedAbout();
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
});

// console.log(`🔧 Environment PORT: ${process.env.PORT}`);
// console.log(`🔧 Using PORT: ${PORT}`);
