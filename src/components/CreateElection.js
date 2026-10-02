import React, { useState } from "react";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateElection() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/elections", form);
      toast.success("Election Created");
      navigate("/elections");
    } catch (err) {
  console.log(err.response?.data);
  toast.error(err.response?.data?.message || "Failed");
}
  };

  return (
    <div style={{ padding: 30 }}>
      <div style={{ maxWidth: 500 }}>
        <h2>Create Election</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Election Title"
            value={form.title}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            style={{ width: "100%", padding: 10, marginBottom: 15 }}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: 12,
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8
            }}
          >
            Create Election
          </button>
        </form>
      </div>
    </div>
  );
}