import { useEffect, useState } from "react";
import API from "../services/api";
import { isAdminLoggedIn } from "../services/auth";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = () => {
    API.get("/menu")
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Error fetching menu:", err));
  };
  // adding categories for menu filters
  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category)),
  ];

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  const handleSubmit = () => {
    const formPayload = new FormData();
    formPayload.append("name", formData.name);
    formPayload.append("description", formData.description);
    formPayload.append("price", formData.price);
    formPayload.append("category", formData.category);
    if (formData.image) formPayload.append("image", formData.image);
    console.log("ENV BASE URL:", import.meta.env.VITE_API_BASE_URL);
    console.log("Submitting FormData:", [...formPayload.entries()]);

    const request = editingId
      ? API.put(`/menu/${editingId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : API.post("/menu", formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then(() => {
        fetchMenu();
        setFormData({
          name: "",
          price: "",
          description: "",
          category: "",
          image: null,
        });
        setEditingId(null);
        setShowForm(false);
      })
      .catch((err) => console.error("Save failed:", err));
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category || "",
      image: null,
    });
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure?")) {
      API.delete(`/menu/${id}`)
        .then(fetchMenu)
        .catch((err) => console.error("Delete failed:", err));
    }
  };

  return (
    <section className="py-10 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Menu</h2>

      {/* Add Button */}
      {isAdminLoggedIn() && (
        <div className="text-center mb-6">
          <button
            onClick={() => {
              setFormData({
                name: "",
                price: "",
                description: "",
                category: "",
                image: null,
              });
              setEditingId(null);
              setShowForm(true);
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Menu Item
          </button>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "text-gray-600 border-gray-400"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Form */}
      {isAdminLoggedIn() && showForm && (
        <div className="space-y-4 mb-10 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, image: e.target.files[0] })
            }
            className="w-full border p-2 rounded"
          />
          <div className="flex justify-between">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {menuItems
          .filter(
            (item) =>
              activeCategory === "All" || item.category === activeCategory
          )
          .map((item) => (
            <div
              key={item._id}
              className="border rounded-lg shadow-md overflow-hidden"
            >
              {item.image && (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500">{item.category}</p>
                <p className="text-sm text-gray-700 mb-2">{item.description}</p>
                <p className="text-blue-600 font-bold mb-3">${item.price}</p>
                {isAdminLoggedIn() && (
                  <div className="flex justify-between">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Menu;
