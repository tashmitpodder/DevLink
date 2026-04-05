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
import UsersPage from "./pages/UsersPage";

/* ── Hero Landing Page ─────────────────────────────── */
const FEATURES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: "Share Projects",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Find Teams",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: "Join Hackathons",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: "Dev Community",
  },
];

function Hero() {
  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-white dark:bg-surface">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 text-center animate-slide-up">
        {/* Status pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-8
          bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400
          border border-gray-200 dark:border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-400 animate-ping inline-block" />
          Open to collaboration
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 text-gray-900 dark:text-white leading-[1.08]">
          Build with the<br />right people.
        </h1>

        <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          DevLink helps developers connect, share projects, and form teams for hackathons and open-source work.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Link to="/signup" className="btn-primary text-sm px-6 py-2.5">
            Get Started
          </Link>
          <Link to="/dashboard" className="btn-secondary text-sm px-6 py-2.5">
            Browse Posts
          </Link>
        </div>

        {/* Feature row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FEATURES.map(({ icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-4 py-4 rounded-xl
                bg-gray-50 dark:bg-white/[0.03]
                border border-gray-200 dark:border-white/[0.07]
                text-gray-500 dark:text-gray-400"
            >
              {icon}
              <span className="text-xs font-medium">{label}</span>
            </div>
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
        <Route path="/Users" element={<UsersPage />} />
      </Routes>
    </div>
  );
}

export default App;
