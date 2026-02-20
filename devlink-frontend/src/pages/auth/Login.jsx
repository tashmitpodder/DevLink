import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { apiRequest } from "../../utils/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", "POST", { email, password });
      if (data.token) {
        login(data.token, data.user);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

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
            Welcome<br />back.
          </h1>
          <p className="text-gray-400 text-lg max-w-xs">
            Your community is waiting for you.
          </p>
          <div className="mt-10 flex flex-col gap-3">
            {["Connect with fellow devs", "Share your projects", "Find your dream team"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-gray-500 text-sm">
                <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs text-white/50">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-surface">
        <div className="w-full max-w-sm animate-slide-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign in</h2>
          <p className="text-sm text-gray-400 mb-8">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-700 dark:text-gray-200 font-medium underline underline-offset-2 hover:text-black dark:hover:text-white">
              Sign up free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
              <input type="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="input-base" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} className="input-base" required />
            </div>

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
                  Signing in…
                </span>
              ) : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
