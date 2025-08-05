// src/sections/TaggedShowcase.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const TaggedShowcase = () => {
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

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
              onClick={() => navigate(`/menu/${tag.menuItem?._id}`)}
              title={`Go to: ${tag.menuItem?.name || tag.label}`}
            >
              {tag.label}
            </div>
          ))}
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
