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

function SkillBadge({ label }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
      bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300
      border border-gray-200 dark:border-white/10">
      {label}
    </span>
  );
}

export default function TeamDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { teams, leaveTeam } = useTeams();
  const { user, token } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState(null);

  // Join request state
  const [myRequest, setMyRequest] = useState(null); // null | {status, _id}
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestMsg, setRequestMsg] = useState("");
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestError, setRequestError] = useState("");

  // Owner: pending requests
  const [pendingRequests, setPendingRequests] = useState([]);

  // Positions
  const [positions, setPositions] = useState([]);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [posForm, setPosForm] = useState({ roleTitle: "", description: "", requiredSkills: "" });
  const [posLoading, setPosLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiRequest(`/teams/${slug}`);
        if (mounted) setTeam(data);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load team");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  // Once team loaded, fetch join requests + positions
  useEffect(() => {
    if (!team) return;
    const isOwnerCheck = user && team.owner?._id === user.id;
    const isMemberCheck = Array.isArray(team.members) && user &&
      team.members.some((m) => (typeof m === "string" ? m : m._id || m.id) === user.id);

    // Fetch positions (public)
    apiRequest(`/positions?teamId=${team._id}`).then(setPositions).catch(() => {});

    if (!isMemberCheck && user && token) {
      apiRequest(`/join-requests/my?teamId=${team._id}`, "GET", null, token)
        .then(setMyRequest).catch(() => {});
    }
    if (isOwnerCheck && token) {
      apiRequest(`/join-requests/team/${team._id}`, "GET", null, token)
        .then(setPendingRequests).catch(() => {});
    }
  }, [team, user, token]);

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

  const handleRequestJoin = async () => {
    setRequestLoading(true);
    setRequestError("");
    try {
      const jr = await apiRequest("/join-requests", "POST", { teamId: team._id, message: requestMsg }, token);
      setMyRequest(jr);
      setShowRequestForm(false);
    } catch (err) {
      setRequestError(err.message || "Failed to send request");
    } finally {
      setRequestLoading(false);
    }
  };

  const handleRespond = async (requestId, status) => {
    try {
      await apiRequest(`/join-requests/${requestId}`, "PUT", { status }, token);
      setPendingRequests(prev => prev.filter(r => r._id !== requestId));
      if (status === "accepted") {
        // Refresh team to show new member
        const updated = await apiRequest(`/teams/${slug}`);
        setTeam(updated);
      }
    } catch (err) {
      alert(err.message || "Failed to respond");
    }
  };

  if (loading) return (
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

  if (error) return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
      <div className="card p-8 text-center max-w-sm">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={() => navigate("/teams")} className="btn-secondary mt-4">← Back to Teams</button>
      </div>
    </div>
  );

  if (!team) return null;

  const isOwner = user && team.owner?._id === user.id;
  const isMember = Array.isArray(team.members) && user &&
    team.members.some((m) => (typeof m === "string" ? m : m._id || m.id) === user.id);

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

            {/* Hackathon */}
            {team.hackathon && (
              <div className="flex items-center gap-2 mt-3 text-sm">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="text-xs text-gray-500 dark:text-gray-400">Hackathon:</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{team.hackathon}</span>
              </div>
            )}

            {!!team.tags?.length && (
              <div className="flex flex-wrap gap-2 mt-4">
                {team.tags.map((t, i) => <TagChip key={i} label={t} />)}
              </div>
            )}

            {/* Needed skills */}
            {Array.isArray(team.neededSkills) && team.neededSkills.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Skills we need</p>
                <div className="flex flex-wrap gap-1.5">
                  {team.neededSkills.map((s, i) => <SkillBadge key={i} label={s} />)}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-5 space-y-3">
              <div className="flex gap-3">
                {isOwner ? (
                  <button onClick={handleDelete} className="btn-danger">Delete Team</button>
                ) : isMember ? (
                  <button disabled={btnLoading} onClick={handleLeave} className="btn-secondary">
                    {btnLoading ? "Working…" : "Leave Team"}
                  </button>
                ) : myRequest ? (
                  <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium border
                    ${ myRequest.status === "pending"
                        ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                        : myRequest.status === "accepted"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800"
                    }`}>
                    { myRequest.status === "pending" ? "⏳ Request Pending"
                      : myRequest.status === "accepted" ? "✓ Request Accepted"
                      : "✕ Request Rejected" }
                  </span>
                ) : user ? (
                  <button onClick={() => setShowRequestForm(v => !v)} className="btn-primary">
                    Request to Join
                  </button>
                ) : (
                  <button onClick={() => navigate("/login")} className="btn-primary">Log in to Join</button>
                )}
              </div>

              {/* Request form */}
              {showRequestForm && !myRequest && (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    placeholder="Optional: introduce yourself or explain why you want to join…"
                    value={requestMsg}
                    onChange={e => setRequestMsg(e.target.value)}
                    className="textarea-base"
                  />
                  {requestError && <p className="text-xs text-red-500">{requestError}</p>}
                  <div className="flex gap-2">
                    <button onClick={handleRequestJoin} disabled={requestLoading} className="btn-primary text-sm">
                      {requestLoading ? "Sending…" : "Send Request"}
                    </button>
                    <button onClick={() => setShowRequestForm(false)} className="btn-secondary text-sm">Cancel</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Owner: Pending join requests */}
        {isOwner && pendingRequests.length > 0 && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Join Requests
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                {pendingRequests.length}
              </span>
            </h2>
            <ul className="space-y-3">
              {pendingRequests.map(r => (
                <li key={r._id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 dark:border-white/[0.05] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{r.candidate?.name || r.candidate?.email}</p>
                    {r.message && <p className="text-xs text-gray-400 mt-0.5 italic">"{r.message}"</p>}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleRespond(r._id, "accepted")} className="btn-primary text-xs py-1 px-3">Accept</button>
                    <button onClick={() => handleRespond(r._id, "rejected")} className="btn-secondary text-xs py-1 px-3">Reject</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Positions */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              Open Positions
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                {positions.filter(p => p.status === "Open").length}
              </span>
            </h2>
            {isOwner && (
              <button onClick={() => setShowAddPosition(v => !v)} className="btn-secondary text-xs">
                {showAddPosition ? "Cancel" : "+ Add Position"}
              </button>
            )}
          </div>

          {/* Owner: add position form */}
          {isOwner && showAddPosition && (
            <div className="mb-4 space-y-2 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06]">
              <input
                placeholder="Role title (e.g. UI/UX Designer)"
                value={posForm.roleTitle}
                onChange={e => setPosForm(f => ({ ...f, roleTitle: e.target.value }))}
                className="input-base"
              />
              <input
                placeholder="Description (what they will build)"
                value={posForm.description}
                onChange={e => setPosForm(f => ({ ...f, description: e.target.value }))}
                className="input-base"
              />
              <input
                placeholder="Required skills (comma separated)"
                value={posForm.requiredSkills}
                onChange={e => setPosForm(f => ({ ...f, requiredSkills: e.target.value }))}
                className="input-base"
              />
              <button
                disabled={posLoading || !posForm.roleTitle.trim()}
                onClick={async () => {
                  setPosLoading(true);
                  try {
                    const p = await apiRequest("/positions", "POST", {
                      teamId: team._id,
                      roleTitle: posForm.roleTitle,
                      description: posForm.description,
                      requiredSkills: posForm.requiredSkills,
                    }, token);
                    setPositions(prev => [...prev, p]);
                    setPosForm({ roleTitle: "", description: "", requiredSkills: "" });
                    setShowAddPosition(false);
                  } catch (err) { alert(err.message); }
                  finally { setPosLoading(false); }
                }}
                className="btn-primary text-sm"
              >
                {posLoading ? "Adding…" : "Add Position"}
              </button>
            </div>
          )}

          {positions.length === 0 ? (
            <p className="text-sm text-gray-400">No positions listed yet.</p>
          ) : (
            <ul className="space-y-3">
              {positions.map(p => (
                <li key={p._id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 dark:border-white/[0.05] last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{p.roleTitle}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        p.status === "Open"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                      }`}>{p.status}</span>
                    </div>
                    {p.description && <p className="text-xs text-gray-400 mt-0.5">{p.description}</p>}
                    {p.requiredSkills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {p.requiredSkills.map((s, i) => <SkillBadge key={i} label={s} />)}
                      </div>
                    )}
                  </div>
                  {isOwner && (
                    <div className="flex gap-1.5 shrink-0">
                      <button
                        onClick={async () => {
                          const newStatus = p.status === "Open" ? "Filled" : "Open";
                          const updated = await apiRequest(`/positions/${p._id}`, "PUT", { status: newStatus }, token);
                          setPositions(prev => prev.map(x => x._id === p._id ? updated : x));
                        }}
                        className="btn-secondary text-xs py-1 px-2"
                      >
                        {p.status === "Open" ? "Mark Filled" : "Reopen"}
                      </button>
                      <button
                        onClick={async () => {
                          await apiRequest(`/positions/${p._id}`, "DELETE", null, token);
                          setPositions(prev => prev.filter(x => x._id !== p._id));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 px-2"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
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
