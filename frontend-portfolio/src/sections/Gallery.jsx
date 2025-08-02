import { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import API from "../services/api";
import { isAdminLoggedIn } from "../services/auth";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ image: null, caption: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = () => {
    API.get("/gallery")
      .then((res) => setImages(res.data))
      .catch((err) => console.error("Error fetching gallery:", err));
  };

  const handleSubmit = () => {
    const payload = new FormData();
    if (formData.image) payload.append("image", formData.image);
    payload.append("caption", formData.caption);

    const request = editingId
      ? API.put(`/gallery/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : API.post("/gallery", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => {
        fetchImages();
        setFormData({ image: null, caption: "" });
        setEditingId(null);
        setShowForm(false);
      })
      .catch((err) => console.error("Save failed:", err));
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({ caption: item.caption || "", image: null });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure?")) {
      API.delete(`/gallery/${id}`)
        .then(fetchImages)
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  const galleryItems = images.map((img) => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
    return {
      original: `${baseUrl}${img.imageUrl}`,
      thumbnail: `${baseUrl}${img.imageUrl}`,
      originalAlt: img.caption || "Gallery image",
      thumbnailAlt: img.caption || "Gallery thumbnail",
    };
  });

  const renderStyledImage = (item) => (
    <img
      src={item.original}
      alt={item.originalAlt}
      className="object-cover h-[300px] w-full max-w-[700px] mx-auto rounded"
      style={{ objectFit: "cover" }}
    />
  );

  return (
    <section className="py-12 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Gallery</h2>

      {isAdminLoggedIn() && (
        <div className="text-center mb-6">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => {
              setFormData({ image: null, caption: "" });
              setEditingId(null);
              setShowForm(true);
            }}
          >
            + Add New Image
          </button>
        </div>
      )}

      {isAdminLoggedIn() && showForm && (
        <div className="mb-6 space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="w-full border p-2"
          />
          <input
            type="text"
            placeholder="Caption (optional)"
            value={formData.caption}
            onChange={(e) =>
              setFormData({ ...formData, caption: e.target.value })
            }
            className="w-full border p-2"
          />
          <div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="ml-4 text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {images.length > 0 ? (
        <ImageGallery
          items={galleryItems}
          showPlayButton={false}
          showFullscreenButton={true}
          renderItem={renderStyledImage}
          thumbnailPosition="bottom"
          showThumbnails={true}
        />
      ) : (
        <p className="text-center text-gray-600">
          No gallery images available.
        </p>
      )}

      <ul className="mt-8 space-y-4">
        {images.map((img) => (
          <li
            key={img._id}
            className="flex items-center justify-between border p-4 rounded"
          >
            <div className="flex items-center gap-4">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}${img.imageUrl}`}
                alt={img.caption}
                className="w-20 h-20 object-cover rounded"
              />
              <p>{img.caption}</p>
            </div>
            {isAdminLoggedIn() && (
              <div className="space-x-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(img)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(img._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Gallery;
