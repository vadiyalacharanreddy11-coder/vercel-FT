import api from "../../api";
import React, { useState } from "react";

const CreateFoodPage = () => {
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const video = e.target.video.files[0];
    const description = e.target.description.value;

    // Validate that all fields are filled
    if (!name || !video || !description) {
      console.log("Please fill all fields");
      return;
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("video", video);
    formData.append("description", description);

    setLoading(true);

    try {
      const res = await api.post(
        "/api/food/",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      e.target.reset(); // Reset form after successful submission
      setLoading(false);
    } catch (err) {
      console.log(err.response?.data || err.message);
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="form-card">
        <h1>Create Food Item</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Food Name</label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            placeholder="Enter food name"
            disabled={loading}
          />

          <label htmlFor="video">Video File</label>
          <input 
            id="video" 
            name="video" 
            type="file" 
            accept="video/*"
            disabled={loading}
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter food description"
            rows={4}
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Food"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateFoodPage;
 
 