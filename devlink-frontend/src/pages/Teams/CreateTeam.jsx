import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../../store/teamsContext";
import { useAuth } from "../../store/auth";

const FIELDS = [
  { name: "name", label: "Team name *", placeholder: "Awesome Hackers", type: "text", required: true },
  { name: "hackathon", label: "Hackathon name", placeholder: "e.g. HackMIT 2025, MLH Local Hack Day…", type: "text", required: false },
  { name: "description", label: "Description", placeholder: "What are you building?", type: "area", required: false },
  { name: "neededSkills", label: "Skills needed (comma separated)", placeholder: "Backend, ML, UI/UX…", type: "text", required: false },
  { name: "tags", label: "Tags (comma separated)", placeholder: "MERN, Hackathon, AI…", type: "text", required: false },
  { name: "repo", label: "Repository URL (optional)", placeholder: "https://github.com/…", type: "text", required: false },
];

export default function CreateTeam() {
  const { addTeam } = useTeams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", hackathon: "", description: "", neededSkills: "", tags: "", repo: "" });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50 dark:bg-surface px-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <svg className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Login required</h2>
          <p className="text-sm text-gray-500">You must be logged in to create a team.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setLocalError("Team name is required.");
    setSubmitting(true);
    setLocalError("");
    try {
      const payload = {
        name: form.name,
        hackathon: form.hackathon,
        description: form.description,
        neededSkills: form.neededSkills.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        repo: form.repo,
      };
      const created = await addTeam(payload, token);
      navigate(`/teams/${created.slug}`);
    } catch (err) {
      setLocalError(err.message || "Failed to create team.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg animate-slide-up">

        <div className="mb-6">
          <h1 className="section-title">Create a Team</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Start a new group, find collaborators, and build something great.
          </p>
        </div>

        <div className="card p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            {FIELDS.map(({ name, label, placeholder, type, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  {label}
                </label>
                {type === "area" ? (
                  <textarea
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    className="textarea-base"
                    rows={4}
                  />
                ) : (
                  <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                    className="input-base"
                    required={required}
                  />
                )}
              </div>
            ))}

            {localError && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                {localError}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Creating…
                  </span>
                ) : "Create Team"}
              </button>
              <button
                type="button"
                className="btn-secondary flex-1 justify-center"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
