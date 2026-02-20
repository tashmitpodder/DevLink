import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "./components/Layout";
import Signup from "./pages/auth/signup";
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/Navbar";
import Posts from "./pages/Post/Posts";
import Teams from "./pages/Teams/teams";
import CreateTeam from "./pages/Teams/CreateTeam";
import TeamDetails from "./pages/Teams/teamDetails";

/* ── Hero Landing Page ─────────────────────────────── */
function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-white dark:bg-surface">
      {/* Background decoration — subtle white glow circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.03] dark:bg-white/[0.03] rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-white/[0.02] dark:bg-white/[0.02] rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6
          bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400
          border border-gray-200 dark:border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-white/60 animate-ping inline-block" />
          Open to collaboration — find your dev team
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white leading-tight">
          Build together with
          <br />
          <span className="text-gray-900 dark:text-white">DevLink</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 dark:text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with developers, share what you're building, and find your perfect hackathon team — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/signup" className="btn-primary text-base px-6 py-3">
            Get Started →
          </Link>
          <Link to="/dashboard" className="btn-secondary text-base px-6 py-3">
            Explore Posts
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-12">
          {["🚀 Share Projects", "👥 Find Teams", "🏆 Join Hackathons", "💬 Dev Community"].map((feat) => (
            <span
              key={feat}
              className="px-4 py-2 rounded-full text-sm font-medium
                bg-gray-100 dark:bg-white/5
                text-gray-500 dark:text-gray-400
                border border-gray-200 dark:border-white/[0.08]"
            >
              {feat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── App ───────────────────────────────────────────── */
function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-surface text-gray-900 dark:text-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hero />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/new" element={<CreateTeam />} />
        <Route path="/teams/:slug" element={<TeamDetails />} />
      </Routes>
    </div>
  );
}

export default App;
