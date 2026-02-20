import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", techStack: "", github: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    } catch {
      setError("Server error — please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", type: "text", label: "Full name", placeholder: "Alex Johnson", required: true },
    { name: "email", type: "email", label: "Email address", placeholder: "you@example.com", required: true },
    { name: "password", type: "password", label: "Password", placeholder: "••••••••", required: true },
    { name: "techStack", type: "text", label: "Tech stack (optional)", placeholder: "React, Node, Python…", required: false },
    { name: "github", type: "text", label: "GitHub URL (optional)", placeholder: "https://github.com/you", required: false },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex">
      {/* Left black panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-1/2 relative overflow-hidden bg-black">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative z-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">DevLink</p>
          <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
            Start building<br />with the best.
          </h1>
          <p className="text-gray-400 text-lg max-w-xs">
            Join hundreds of developers collaborating on projects and hackathons.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {["Free forever", "Find teammates instantly", "Share your work"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-gray-500 text-sm">
                <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs text-white/50">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-surface overflow-y-auto">
        <div className="w-full max-w-sm animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create an account</h2>
          <p className="text-sm text-gray-400 mb-8">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-700 dark:text-gray-200 font-medium underline underline-offset-2 hover:text-black dark:hover:text-white">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ name, type, label, placeholder, required }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                <input
                  type={type} name={name} placeholder={placeholder} value={formData[name]}
                  onChange={handleChange} className="input-base" required={required}
                />
              </div>
            ))}

            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account…
                </span>
              ) : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
