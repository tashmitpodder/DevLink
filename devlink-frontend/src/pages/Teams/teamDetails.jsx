// src/pages/teams/TeamDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../../store/teamsContext";
import { useAuth } from "../../store/auth";
import { apiRequest } from "../../utils/api";

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

        if (found) {
          if (mounted) setTeam(found);
        } else {
          const data = await apiRequest(`/teams/${slug}`);
          if (mounted) setTeam(data);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load team");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug, teams]);

  if (loading) return <p className="p-4 text-gray-500">Loading team…</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;
  if (!team) return <p className="p-4 text-gray-500">Team not found.</p>;

  const isOwner = user && team.owner?._id === user.id;

  const isMember =
    Array.isArray(team.members) &&
    user &&
    team.members.some((m) => {
      if (typeof m === "string") return m === user.id;
      return (m._id || m.id) === user.id;
    });

  const handleJoin = async () => {
    if (!user) return alert("Login to join");
    setBtnLoading(true);
    try {
      const updated = await joinTeam(slug, token);
      setTeam(updated);
    } catch (err) {
      alert(err.message || "Failed to join");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!user) return alert("Login to leave");
    setBtnLoading(true);
    try {
      const updated = await leaveTeam(slug, token);
      setTeam(updated);
    } catch (err) {
      alert(err.message || "Failed to leave");
    } finally {
      setBtnLoading(false);
    }
  };

  // 🗑️ DELETE TEAM (OWNER ONLY)
  const handleDeleteTeam = async () => {
    const ok = window.confirm(
      "Are you sure you want to delete this team? This action cannot be undone."
    );
    if (!ok) return;

    try {
      await apiRequest(`/teams/${slug}`, "DELETE", null, token);
      navigate("/teams"); // redirect after delete
    } catch (err) {
      alert(err.message || "Failed to delete team");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{team.name}</h1>
      <p className="text-sm text-gray-600 mb-4">{team.description}</p>

      <div className="flex items-center gap-4 mb-4">
        <p className="text-xs text-gray-500">
          Owner: {team.owner?.name || "Unknown"}
        </p>
        <p className="text-xs text-gray-500">
          Members: {Array.isArray(team.members) ? team.members.length : 0}
        </p>
        {!!team.repo && (
          <a
            href={team.repo}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm"
          >
            Repo
          </a>
        )}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mb-6">
        {isMember ? (
          <button
            disabled={btnLoading}
            onClick={handleLeave}
            className="px-4 py-2 border rounded"
          >
            {btnLoading ? "Working…" : "Leave Team"}
          </button>
        ) : (
          <button
            disabled={btnLoading}
            onClick={handleJoin}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {btnLoading ? "Working…" : "Join Team"}
          </button>
        )}

        {/* 🗑️ OWNER DELETE BUTTON */}
        {isOwner && (
          <button
            onClick={handleDeleteTeam}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            Delete Team
          </button>
        )}
      </div>

      <h2 className="font-semibold mb-2">Members</h2>
      <ul className="space-y-2">
        {Array.isArray(team.members) &&
          team.members.map((m, i) => (
            <li key={i} className="text-sm">
              {typeof m === "string" ? m : m.name || m.email || m._id}
            </li>
          ))}
      </ul>
    </section>
  );
}
