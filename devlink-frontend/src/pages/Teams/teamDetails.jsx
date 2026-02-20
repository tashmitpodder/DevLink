import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../../store/teamsContext";
import { useAuth } from "../../store/auth";
import { apiRequest } from "../../utils/api";

function Initials({ name, size = "w-9 h-9 text-sm" }) {
  const letters = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span className={`avatar ${size}`}>{letters}</span>;
}

function TagChip({ label }) {
  return <span className="tag-chip">#{label}</span>;
}

export default function TeamDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { teams, joinTeam, leaveTeam } = useTeams();
  const { user, token } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const found = teams?.find((t) => t.slug === slug);
        if (found) { if (mounted) setTeam(found); }
        else {
          const data = await apiRequest(`/teams/${slug}`);
          if (mounted) setTeam(data);
        }
      } catch (err) { if (mounted) setError(err.message || "Failed to load team"); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [slug, teams]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <svg className="animate-spin w-8 h-8" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm">Loading team…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-sm">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={() => navigate("/teams")} className="btn-secondary mt-4">← Back to Teams</button>
        </div>
      </div>
    );
  }
  if (!team) return null;

  const isOwner = user && team.owner?._id === user.id;
  const isMember = Array.isArray(team.members) && user &&
    team.members.some((m) => (typeof m === "string" ? m : m._id || m.id) === user.id);

  const handleJoin = async () => {
    if (!user) return alert("Login to join");
    setBtnLoading(true);
    try { setTeam(await joinTeam(slug, token)); }
    catch (err) { alert(err.message || "Failed to join"); }
    finally { setBtnLoading(false); }
  };
  const handleLeave = async () => {
    setBtnLoading(true);
    try { setTeam(await leaveTeam(slug, token)); }
    catch (err) { alert(err.message || "Failed to leave"); }
    finally { setBtnLoading(false); }
  };
  const handleDelete = async () => {
    if (!window.confirm("Delete this team? This cannot be undone.")) return;
    try { await apiRequest(`/teams/${slug}`, "DELETE", null, token); navigate("/teams"); }
    catch (err) { alert(err.message || "Failed to delete team"); }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 animate-slide-up">

        {/* Hero card */}
        <div className="card overflow-hidden">
          {/* Dark monochrome banner */}
          <div className="h-28 bg-zinc-900 dark:bg-black relative">
            <div className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "30px 30px"
              }}
            />
          </div>

          <div className="p-6 -mt-4">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{team.name}</h1>
            {team.description && (
              <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-lg">{team.description}</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Owner: <strong className="text-gray-600 dark:text-gray-300">{team.owner?.name || "Unknown"}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {Array.isArray(team.members) ? team.members.length : 0} members
              </span>
              {team.repo && (
                <a href={team.repo} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  Repository
                </a>
              )}
            </div>

            {!!team.tags?.length && (
              <div className="flex flex-wrap gap-2 mt-4">
                {team.tags.map((t, i) => <TagChip key={i} label={t} />)}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              {isMember ? (
                <button disabled={btnLoading} onClick={handleLeave} className="btn-secondary">
                  {btnLoading ? "Working…" : "Leave Team"}
                </button>
              ) : (
                <button disabled={btnLoading} onClick={handleJoin} className="btn-primary">
                  {btnLoading ? "Working…" : "Join Team"}
                </button>
              )}
              {isOwner && (
                <button onClick={handleDelete} className="btn-danger">Delete Team</button>
              )}
            </div>
          </div>
        </div>

        {/* Members */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            Members
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
              {Array.isArray(team.members) ? team.members.length : 0}
            </span>
          </h2>
          {(!team.members || team.members.length === 0) ? (
            <p className="text-sm text-gray-400">No members yet.</p>
          ) : (
            <ul className="space-y-3">
              {team.members.map((m, i) => {
                const name = typeof m === "string" ? m : (m.name || m.email || m._id);
                return (
                  <li key={i} className="flex items-center gap-3">
                    <Initials name={name} />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{name}</span>
                    {isOwner && team.owner?._id === (m._id || m) && (
                      <span className="tag-chip text-xs">Owner</span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
