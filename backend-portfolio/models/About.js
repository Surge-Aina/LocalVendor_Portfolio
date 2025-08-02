const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema(
  {
    banner: {
      image: String,
      title: String,
      description: String,
      shape: { type: String, default: "blob" },
    },
    contentBlocks: [
      {
        heading: String,
        subheading: String,
      },
    ],
    gridImages: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);
