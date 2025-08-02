// seedAbout.js
const AboutContent = require(".//About");

const seedAbout = async () => {
  const existing = await AboutContent.findOne();
  if (existing) return;

  const defaultAbout = new AboutContent({
    banner: {
      title: "Welcome to Donut Nook",
      description: "Delicious donuts, warm coffee, and cozy vibes.",
      shape: "rectangle", // or your default
      image: "", // or preload a static image if needed
    },
    contentBlocks: [
      { heading: "Our Story", subheading: "Handcrafted since 1999" },
      { heading: "Community", subheading: "Serving with love every day" },
    ],
    gridImages: [],
  });

  await defaultAbout.save();
  console.log("✅ Default About section seeded.");
};

module.exports = seedAbout;
