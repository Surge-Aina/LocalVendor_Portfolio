import { useState, useEffect } from "react";
import API from "../services/api";
import { isAdminLoggedIn } from "../services/auth";

const AboutSection = () => {
  const [leftBlocks, setLeftBlocks] = useState([]);
  const [rightBlocks, setRightBlocks] = useState([]);
  const [bottomImages, setBottomImages] = useState([]);

  useEffect(() => {
    API.get("/about")
      .then((res) => {
        let data = res.data;
        const blocks = data.contentBlocks || [];
        const midpoint = Math.ceil(blocks.length / 2);
        setLeftBlocks(
          blocks.slice(0, midpoint).map((b) => ({ ...b, isEditing: false }))
        );
        setRightBlocks(
          blocks.slice(midpoint).map((b) => ({ ...b, isEditing: false }))
        );
        setBottomImages(data.gridImages || []);
      })
      .catch((err) =>
        console.error("Failed to fetch or create about data", err)
      );
  }, []);

  const handleAddTextBlock = (side) => {
    const newBlock = { heading: "", subheading: "", isEditing: true };
    const updated =
      side === "left" ? [...leftBlocks, newBlock] : [...rightBlocks, newBlock];
    saveBlocks(side, updated);
  };

  const handleEditToggle = (side, index) => {
    const blocks = side === "left" ? [...leftBlocks] : [...rightBlocks];
    blocks[index].isEditing = !blocks[index].isEditing;
    saveBlocks(side, blocks);
  };

  const handleDelete = (side, index) => {
    const blocks = side === "left" ? [...leftBlocks] : [...rightBlocks];
    blocks.splice(index, 1);
    saveBlocks(side, blocks);
  };

  const handleChange = (side, index, field, value) => {
    const blocks = side === "left" ? [...leftBlocks] : [...rightBlocks];
    blocks[index][field] = value;
    side === "left" ? setLeftBlocks(blocks) : setRightBlocks(blocks);
  };

  const saveBlocks = (side, updatedBlocks) => {
    const mergedBlocks =
      side === "left"
        ? [...updatedBlocks, ...rightBlocks]
        : [...leftBlocks, ...updatedBlocks];

    API.put("/about", {
      contentBlocks: mergedBlocks.map(({ isEditing, ...b }) => b),
      gridImages: bottomImages,
    })
      .then((res) => {
        const data = res.data || { contentBlocks: [], gridImages: [] };
        side === "left"
          ? setLeftBlocks(updatedBlocks)
          : setRightBlocks(updatedBlocks);
      })

      .catch((err) => console.error("Failed to save content blocks", err));
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const payload = new FormData();
    files.forEach((file) => payload.append("images", file));

    API.post("/about/upload-grid-images", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        setBottomImages([...bottomImages, ...res.data.urls]);
      })
      .catch((err) => console.error("Failed to upload images", err));
  };

  return (
    <section id="about" className="max-w-6xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Left Container */}
        <div className="bg-white shadow p-6 rounded">
          {leftBlocks.map((block, idx) => (
            <div key={idx} className=" p-4 mb-4 rounded">
              {block.isEditing ? (
                <>
                  <input
                    type="text"
                    value={block.heading}
                    onChange={(e) =>
                      handleChange("left", idx, "heading", e.target.value)
                    }
                    placeholder="Heading"
                    className=" p-2 w-full mb-2 rounded"
                  />
                  <textarea
                    value={block.subheading}
                    onChange={(e) =>
                      handleChange("left", idx, "subheading", e.target.value)
                    }
                    placeholder="Subheading"
                    className=" p-2 w-full mb-2 rounded"
                  />
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-blue-900">
                    {block.heading}
                  </h4>
                  <p className="text-gray-700">{block.subheading}</p>
                </>
              )}
              {isAdminLoggedIn() && (
                <div className="flex gap-4 text-sm mt-2">
                  <button
                    onClick={() => handleEditToggle("left", idx)}
                    className="text-blue-600 hover:underline"
                  >
                    {block.isEditing ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete("left", idx)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
          {isAdminLoggedIn() && (
            <button
              onClick={() => handleAddTextBlock("left")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Left Block
            </button>
          )}
        </div>

        {/* Right Container */}
        <div className="bg-white shadow p-6 rounded">
          {rightBlocks.map((block, idx) => (
            <div key={idx} className=" p-4 mb-4 rounded">
              {block.isEditing ? (
                <>
                  <input
                    type="text"
                    value={block.heading}
                    onChange={(e) =>
                      handleChange("right", idx, "heading", e.target.value)
                    }
                    placeholder="Heading"
                    className=" p-2 w-full mb-2 rounded"
                  />
                  <textarea
                    value={block.subheading}
                    onChange={(e) =>
                      handleChange("right", idx, "subheading", e.target.value)
                    }
                    placeholder="Subheading"
                    className=" p-2 w-full mb-2 rounded"
                  />
                </>
              ) : (
                <>
                  <h4 className="font-semibold text-blue-900">
                    {block.heading}
                  </h4>
                  <p className="text-gray-700">{block.subheading}</p>
                </>
              )}
              {isAdminLoggedIn() && (
                <div className="flex gap-4 text-sm mt-2">
                  <button
                    onClick={() => handleEditToggle("right", idx)}
                    className="text-blue-600 hover:underline"
                  >
                    {block.isEditing ? "Save" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete("right", idx)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
          {isAdminLoggedIn() && (
            <button
              onClick={() => handleAddTextBlock("right")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              + Add Right Block
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">Bottom Grid</h3>

        {isAdminLoggedIn() && (
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImage}
            className="mb-4"
          />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {bottomImages.map((img, idx) => (
            <div key={idx} className="relative w-full aspect-square">
              <img src={img} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
