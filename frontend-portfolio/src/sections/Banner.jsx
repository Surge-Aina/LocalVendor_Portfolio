import { useEffect, useState } from "react";
import API from "../services/api";
import { FiEdit } from "react-icons/fi";
import { isAdminLoggedIn } from "../services/auth";
import FileUploader from "../components/FileUploader";
import { toast } from "react-toastify";

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(null);

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

  const handleSave = () => {
    const payload = new FormData();
    payload.append("title", editData.title);
    payload.append("description", editData.description);
    payload.append("shape", editData.shape);
    if (!editData.image || !(editData.image instanceof File)) {
      toast.error("Please upload a valid image under 2MB");
      return;
    }
    if (editData.image) {
      payload.append("image", editData.image);
    }

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
        setEditing(false);
        setEditData(null);
        alert("Banner updated!");
      })
      .catch((err) => console.error("Save error:", err));
  };

  return (
    <section id="home" className="min-h-screen relative">
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
            {editing ? (
              <>
                <input
                  className="text-4xl md:text-6xl font-bold bg-white/80 text-black px-2 rounded mb-2"
                  value={editData.title}
                  onChange={(e) =>
                    setEditData({ ...editData, title: e.target.value })
                  }
                />
                <input
                  className="text-lg bg-white/80 text-black px-2 rounded mb-2"
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                />
                <select
                  className="bg-white/80 text-black px-2 rounded mb-2"
                  value={editData.shape}
                  onChange={(e) =>
                    setEditData({ ...editData, shape: e.target.value })
                  }
                >
                  <option value="blob">Blob</option>
                  <option value="oval">Oval</option>
                  <option value="square">Square</option>
                  <option value="fullscreen">Fullscreen</option>
                </select>
                <FileUploader
                  onFileAccepted={(file) =>
                    setEditData({ ...editData, image: file })
                  }
                  className="text-white"
                />

                <div className="mt-2 space-x-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                  <button
                    className="text-white underline"
                    onClick={() => {
                      setEditing(false);
                      setEditData(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h1 className="text-6xl md:text-8xl font-extrabold uppercase drop-shadow-lg mb-4">
                  {banner.title}
                </h1>
                <p className="text-lg md:text-2xl max-w-2xl drop-shadow-md">
                  {banner.description}
                </p>

                {isAdminLoggedIn() && !editing && (
                  <button
                    onClick={() => {
                      setEditing(true);
                      setEditData({ ...banner });
                    }}
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white text-black p-2 rounded-full shadow transition"
                    title="Edit Banner"
                  >
                    <FiEdit className="text-xl" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
