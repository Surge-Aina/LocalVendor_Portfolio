import { useEffect, useState } from "react";
import API from "../services/api";
import { isAdminLoggedIn } from "../services/auth";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    shape: "blob", // default
  });

  useEffect(() => {
    API.get("/banner")
      .then((res) => {
        const data = res.data[0]; // assuming single banner
        setBanner(data);
        setFormData({
          title: data?.title || "",
          description: data?.description || "",
          image: null,
          shape: data?.shape || "fullscreen",
        });
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = () => {
    const payload = new FormData();
    if (image) payload.append("image", image);
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("shape", formData.shape);

    const endpoint = banner?._id ? `/banner/${banner._id}` : "/banner";

    const request = banner?._id
      ? API.put(endpoint, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      : API.post(endpoint, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });

    request
      .then((res) => {
        setBanner(res.data);
        alert("Banner updated!");
      })
      .catch((err) => console.error("Save error:", err));
  };

  return (
    <section className="min-h-screen relative">
      {banner?.image && (
        <div
          className={`relative w-full ${
            banner.shape === "fullscreen" ? "h-screen" : "h-[60vh]"
          } overflow-hidden`}
          style={{ backgroundColor: "#969391ff" }}
        >
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}${banner.image}`}
            alt={banner.title}
            className={`absolute inset-0 w-full h-full object-cover ${
              banner.shape === "blob"
                ? "clip-blob"
                : banner.shape === "oval"
                  ? "rounded-[50%]"
                  : banner.shape === "square"
                    ? "rounded-none"
                    : banner.shape === "fullscreen"
                      ? "" // no extra styling
                      : ""
            }`}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
            <h1 className="text-6xl md:text-8xl font-extrabold uppercase drop-shadow-lg mb-4">
              {banner.title}
            </h1>
            <p className="text-lg md:text-2xl max-w-2xl drop-shadow-md">
              {banner.description}
            </p>
          </div>
        </div>
      )}

      {isAdminLoggedIn() && (
        <div className="mt-8 space-y-4 max-w-md mx-auto">
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter banner title"
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter banner description"
            className="w-full border p-2 rounded"
          />

          <select
            value={formData.shape}
            onChange={(e) =>
              setFormData({ ...formData, shape: e.target.value })
            }
            className="w-full border p-2 rounded"
          >
            <option value="blob">Blob</option>
            <option value="oval">Oval</option>
            <option value="square">Square</option>
            <option value="fullscreen">Fullscreen</option>
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {banner ? "Update Banner" : "Add Banner"}
          </button>
        </div>
      )}
    </section>
  );
};

export default Banner;
