import { useState, useEffect } from "react";
import API from "../services/api";

const TaggedShowcase = () => {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    API.get("/tagged")
      .then((res) => {
        const latest = res.data[res.data.length - 1];
        if (latest) {
          setImage(latest.imageUrl);
          setTags(latest.tags);
        }
      })
      .catch((err) => console.error("Error loading tagged image:", err));
  }, []);

  return (
    <section id="showcase" className="p-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        Explore Our Showcase
      </h2>

      {image ? (
        <div className="relative inline-block">
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${image}`}
            alt="Product Showcase"
            className="max-w-full rounded shadow"
          />

          {/* Tags */}
          {tags.map((tag, idx) => (
            <div
              key={idx}
              className="absolute bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-blue-600 transition"
              style={{
                left: `${tag.x * 100}%`,
                top: `${tag.y * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => setSelectedItem(tag.menuItem)}
              title={`Go to: ${tag.menuItem?.name || tag.label}`}
            >
              {tag.label}
            </div>
          ))}

          {/* Floating Banner */}
          {selectedItem && (
            <div className="absolute top-4 left-4 bg-white shadow-lg rounded-lg p-4 w-72 z-50">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold">{selectedItem.name}</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Menu Item Image */}
              {selectedItem.image && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${selectedItem.image}`}
                  alt={selectedItem.name}
                  className="w-full h-32 object-cover rounded mb-2"
                />
              )}

              {/* Description */}
              <p className="text-sm text-gray-700">
                {selectedItem.description || "No description"}
              </p>

              {/* Price */}
              <p className="text-sm font-bold mt-2">${selectedItem.price}</p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No showcase image available.
        </p>
      )}
    </section>
  );
};

export default TaggedShowcase;
