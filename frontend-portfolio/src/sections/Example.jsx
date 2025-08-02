import { useState } from "react";

const AboutSection = () => {
  const [leftBlocks, setLeftBlocks] = useState([]);
  const [rightBlocks, setRightBlocks] = useState([]);
  const [bottomImages, setBottomImages] = useState([]);

  const handleAddTextBlock = (side) => {
    const newBlock = { heading: "", subheading: "", isEditing: true };
    if (side === "left") setLeftBlocks([...leftBlocks, newBlock]);
    else if (side === "right") setRightBlocks([...rightBlocks, newBlock]);
  };

  const handleEditToggle = (side, index) => {
    const blocks = side === "left" ? [...leftBlocks] : [...rightBlocks];
    blocks[index].isEditing = !blocks[index].isEditing;
    side === "left" ? setLeftBlocks(blocks) : setRightBlocks(blocks);
  };

  const handleDelete = (side, index) => {
    const blocks = side === "left" ? [...leftBlocks] : [...rightBlocks];
    blocks.splice(index, 1);
    side === "left" ? setLeftBlocks(blocks) : setRightBlocks(blocks);
  };

  const handleChange = (side, index, field, value) => {
    const blocks = side === "left" ? [...leftBlocks] : [...rightBlocks];
    blocks[index][field] = value;
    side === "left" ? setLeftBlocks(blocks) : setRightBlocks(blocks);
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setBottomImages([...bottomImages, ...urls]);
  };

  return (
    <section className="max-w-6xl mx-auto p-8">
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Left Container */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-xl font-bold mb-4"></h3>
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
            </div>
          ))}
          <button
            onClick={() => handleAddTextBlock("left")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Left Block
          </button>
        </div>

        {/* Right Container */}
        <div className="bg-white shadow p-6 rounded">
          <h3 className="text-xl font-bold mb-4"></h3>
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
            </div>
          ))}
          <button
            onClick={() => handleAddTextBlock("right")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Right Block
          </button>
        </div>
      </div>

      {/* Bottom Image Grid
      <div className="bg-white shadow p-6 rounded">
        <h3 className="text-xl font-bold mb-4">Bottom Grid</h3>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddImage}
          className="mb-4"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bottomImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`grid-${idx}`}
              className="max-h-32 object-contain rounded border"
            />
          ))}
        </div>
      </div> */}
      <div className="mt-10 bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-semibold mb-4">Bottom Grid</h3>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleAddImage}
          className="mb-4"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {bottomImages.map((img, idx) => (
            <div key={idx} className="relative w-full aspect-square">
              <img
                src={img}
                alt={`Grid ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
