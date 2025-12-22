import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const navLinkClass = ({ isActive }) =>
  `px-3 py-2 rounded-lg text-sm transition ${
    isActive
      ? "bg-black text-white dark:bg-white dark:text-black"
      : "text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800"
  }`;
  
const toggleTheme = () => {
  const root = document.documentElement;
  root.classList.toggle("dark");
  localStorage.theme = root.classList.contains("dark")
    ? "dark"
    : "light";
};

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white dark:bg-[#0d1117] dark:border-[#30363d]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Logo */}
        <Link
          to="/"
          className="font-bold text-xl text-black dark:text-white"
        >
          DevLink
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          <NavLink to="/posts" className={navLinkClass}>Posts</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
          {token && (
            <>
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <NavLink to="/teams" className={navLinkClass}>My Teams</NavLink>
            </>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="px-3 py-2 rounded-lg border text-sm dark:border-[#30363d]"
          >
            🌙
          </button>

          {!token ? (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-lg bg-black text-white text-sm dark:bg-white dark:text-black"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-2 rounded-lg border text-sm dark:border-[#30363d]"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="px-3 py-2 rounded-lg border text-sm dark:border-[#30363d]"
            >
              Sign out ({user?.name || "User"})
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
