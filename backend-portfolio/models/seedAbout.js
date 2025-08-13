// models/seedAbout.js
const About = require("./About");

module.exports = async function seedAbout() {
  // If an About doc exists, do nothing
  const exists = await About.findOne({});
  if (exists) return;

  await About.create({
    banner: {
      title: "About Us",
      description: "Welcome to our story.",
      shape: "fullscreen",
      image: "", // can be filled later via admin
    },
    contentBlocks: [],
    gridImages: [],
  });

  console.log("Seeded initial About document");
};
