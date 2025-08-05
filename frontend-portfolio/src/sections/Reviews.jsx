import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { isAdminLoggedIn } from "../services/auth";
import API from "../services/api";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ name: "", feedback: "", rating: 1 });
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = () => {
    API.get("/reviews")
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Failed to fetch reviews", err));
  };

  const handleAddReview = () => {
    setForm({ name: "", feedback: "", rating: 1 });
    setEditingIndex(reviews.length);
  };

  const handleSaveReview = () => {
    const payload = {
      name: form.name,
      feedback: form.feedback,
      rating: form.rating,
    };
    console.log("Payload being sent:", payload);

    if (editingIndex === reviews.length) {
      API.post("/reviews", payload)
        .then(() => {
          fetchReviews();
          setEditingIndex(null);
          setForm({ name: "", feedback: "", rating: 1 });
        })
        .catch((err) => console.error("Failed to add review", err));
    } else {
      const id = reviews[editingIndex]._id;
      API.put(`/reviews/${id}`, payload)
        .then(() => {
          fetchReviews();
          setEditingIndex(null);
          setForm({ name: "", feedback: "", rating: 1 });
        })
        .catch((err) => console.error("Failed to update review", err));
    }
  };

  const handleDeleteReview = (index) => {
    const id = reviews[index]._id;
    API.delete(`/reviews/${id}`)
      .then(() => fetchReviews())
      .catch((err) => console.error("Failed to delete review", err));
  };

  const scrollLeft = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setForm({ name: "", feedback: "", rating: 1 });
  };

  return (
    <section id="reviews" className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Customer Reviews</h2>
        {isAdminLoggedIn() && (
          <button
            onClick={handleAddReview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Review
          </button>
        )}
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-white border rounded-full shadow p-2 z-10"
        >
          ←
        </button>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
        >
          {[...reviews, ...(editingIndex === reviews.length ? [{}] : [])].map(
            (review, idx) => (
              <motion.div
                key={review._id || idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="min-w-[300px] bg-white p-4 rounded shadow relative"
              >
                {editingIndex === idx ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Name"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="border p-2 w-full rounded"
                    />
                    <textarea
                      placeholder="Review"
                      value={form.feedback}
                      onChange={(e) => handleChange("feedback", e.target.value)}
                      className="border p-2 w-full rounded"
                    />
                    <div>
                      <label className="block mb-1 text-sm font-medium">
                        Rating:
                      </label>
                      <select
                        value={form.rating}
                        onChange={(e) =>
                          handleChange("rating", parseInt(e.target.value))
                        }
                        className="border p-2 rounded w-full"
                      >
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r} Star{r > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleSaveReview}
                        className="bg-blue-500 text-white px-4 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-lg">{review.name}</div>
                    <div className="text-yellow-500 mb-2">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="text-gray-700 mb-2">{review.feedback}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                    {isAdminLoggedIn() && (
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingIndex(idx);
                            setForm({
                              name: review.name,
                              feedback: review.feedback,
                              rating: review.rating,
                            });
                          }}
                        >
                          ✏️
                        </button>
                        <button onClick={() => handleDeleteReview(idx)}>
                          🗑️
                        </button>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )
          )}
        </div>

        <button
          onClick={scrollRight}
          className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-white border rounded-full shadow p-2 z-10"
        >
          →
        </button>
      </div>
    </section>
  );
};

export default Reviews;
