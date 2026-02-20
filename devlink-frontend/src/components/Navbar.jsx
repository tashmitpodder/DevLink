import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/posts", label: "Posts" },
  { to: "/teams", label: "Teams", authRequired: true },
  { to: "/profile", label: "Profile", authRequired: true },
];

function toggleTheme() {
  const root = document.documentElement;
  root.classList.toggle("dark");
  localStorage.theme = root.classList.contains("dark") ? "dark" : "light";
}

function Initials({ name }) {
  const letters = (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span className="avatar w-8 h-8 text-xs">{letters}</span>;
}

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [navigate]);

  const visibleLinks = NAV_LINKS.filter((l) => !l.authRequired || token);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
          ${scrolled
            ? "bg-white/90 dark:bg-surface/90 backdrop-blur-md shadow-sm dark:shadow-black/50 border-b border-gray-200 dark:border-white/[0.06]"
            : "bg-white/70 dark:bg-surface/70 backdrop-blur-sm border-b border-transparent"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white select-none">
            DevLink
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="btn-ghost hidden md:inline-flex text-base" aria-label="Toggle theme">
              <span className="dark:hidden">🌙</span>
              <span className="hidden dark:inline">☀️</span>
            </button>

            {!token ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary">Log in</Link>
                <Link to="/signup" className="btn-primary">Sign up</Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Initials name={user?.name} />
                <button onClick={() => { logout(); navigate("/"); }} className="btn-secondary text-xs">
                  Sign out
                </button>
              </div>
            )}

            {/* Hamburger */}
            <button onClick={() => setMenuOpen((o) => !o)} className="md:hidden btn-ghost p-2" aria-label="Open menu">
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current my-1 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-current transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setMenuOpen(false)} />
      )}

      <aside className={`fixed top-14 inset-x-0 z-40 md:hidden transition-all duration-300 overflow-hidden
        ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white dark:bg-surface-card border-b border-gray-200 dark:border-white/[0.07] px-4 py-4 flex flex-col gap-2">
          {visibleLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                  ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <hr className="border-gray-200 dark:border-white/[0.07] my-1" />

          <button onClick={toggleTheme} className="btn-ghost justify-center">
            <span className="dark:hidden">🌙 Dark mode</span>
            <span className="hidden dark:inline">☀️ Light mode</span>
          </button>

          {!token ? (
            <div className="flex gap-2 mt-1">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-secondary flex-1 justify-center">Log in</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn-primary  flex-1 justify-center">Sign up</Link>
            </div>
          ) : (
            <button onClick={() => { logout(); navigate("/"); setMenuOpen(false); }} className="btn-secondary w-full justify-center mt-1">
              Sign out ({user?.name || "User"})
            </button>
          )}
        </div>
      </aside>

      <div className="h-14" />
    </>
  );
}
