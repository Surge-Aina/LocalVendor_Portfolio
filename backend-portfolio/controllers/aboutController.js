const AboutContent = require("../models/About");

exports.getAllAbouts = async (req, res) => {
  try {
    const about = await AboutContent.findOne().sort({ createdAt: -1 });
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch about content" });
  }
};

exports.createAbout = async (req, res) => {
  try {
    const { title, description, shape, contentBlocks } = req.body;

    const bannerImage = req.files?.bannerImage?.[0]?.path || "";
    const gridImages = req.files?.gridImages?.map((file) => file.path) || [];

    const parsedContentBlocks = contentBlocks
      ? JSON.parse(contentBlocks) // if sent as JSON string
      : [];

    const newSection = new AboutSection({
      banner: {
        title,
        description,
        shape,
        image: bannerImage,
      },
      contentBlocks: parsedContentBlocks,
      gridImages,
    });

    const saved = await newSection.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("About section creation failed:", err);
    res.status(500).json({ error: "Server error creating about section" });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    // Get the existing about document
    const about = await AboutContent.findOne();
    if (!about)
      return res.status(404).json({ error: "About section not found" });

    // Handle uploaded files
    if (req.files?.bannerImage && req.files.bannerImage.length > 0) {
      about.banner.image = `/api/uploads/${req.files.bannerImage[0].filename}`;
    }

    if (req.files?.gridImages && req.files.gridImages.length > 0) {
      about.gridImages = req.files.gridImages.map(
        (file) => `/api/uploads/${file.filename}`
      );
    }

    // Handle text fields
    if (req.body.title) about.title = req.body.title;
    if (req.body.description) about.description = req.body.description;

    // Handle structured text blocks if present
    if (req.body.blocks) {
      try {
        about.contentBlocks = JSON.parse(req.body.blocks); // expects a JSON string from frontend
      } catch {
        return res.status(400).json({ error: "Invalid format for blocks" });
      }
    }

    if (req.body.contentBlocks) {
      about.contentBlocks = req.body.contentBlocks;
    }

    try {
      about.contentBlocks =
        typeof req.body.contentBlocks === "string"
          ? JSON.parse(req.body.contentBlocks)
          : req.body.contentBlocks;
    } catch {
      return res.status(400).json({ error: "Invalid contentBlocks format" });
    }

    const updated = await about.save();
    res.json(updated);
  } catch (err) {
    console.error("Update About Error:", err);
    res.status(500).json({ error: "Failed to update about section" });
  }
};

exports.deleteAbout = async (req, res) => {
  try {
    const deleted = await AboutContent.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "About content not found" });
    res.json({ message: "About content deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete about content" });
  }
};

exports.imageUpload = async (req, res) => {
  try {
    const urls = req.files.map((file) => `/api/uploads/${file.filename}`);
    res.json({ urls });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: "Failed to upload images" });
  }
};
