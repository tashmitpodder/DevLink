// src/pages/teams/CreateTeam.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../../store/teamsContext";
import { useAuth } from "../../store/auth";

export default function CreateTeam() {
  const { addTeam } = useTeams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", description: "", tags: "", repo: "" });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  if (!user) {
    // If user not logged in, we could redirect; here we show message
    return (
      <div className="max-w-xl mx-auto p-4">
        <p className="text-yellow-700 bg-yellow-50 border rounded p-3">You must be logged in to create a team.</p>
      </div>
    );
  }

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setLocalError("Name is required");
    setSubmitting(true);
    setLocalError("");

    try {
      const payload = {
        name: form.name,
        description: form.description,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        repo: form.repo
      };
      const created = await addTeam(payload, token);
      // navigate to team detail by slug
      navigate(`/teams/${created.slug}`);
    } catch (err) {
      setLocalError(err.message || "Failed to create team");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create a Team</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
        <input
          name="name"
          placeholder="Team name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
          rows={4}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated) e.g. MERN, Hackathon"
          value={form.tags}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          name="repo"
          placeholder="Repository URL (optional)"
          value={form.repo}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        {localError && <p className="text-red-600 mb-2">{localError}</p>}

        <div className="flex gap-2">
          <button disabled={submitting} className="bg-black text-white px-4 py-2 rounded">
            {submitting ? "Creating…" : "Create Team"}
          </button>
          <button type="button" className="px-4 py-2 border rounded" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
