// src/pages/teams/Teams.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../../store/teamsContext";
import { useAuth } from "../../store/auth";

export default function Teams() {
  const { teams, loading, error } = useTeams();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <div>
          {user ? (
            <button
              onClick={() => navigate("/teams/new")}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Create Team
            </button>
          ) : (
            <Link to="/login" className="text-sm text-blue-600">Login to create</Link>
          )}
        </div>
      </div>

      {loading && <p className="text-gray-500">Loading teams…</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4">
        {(!Array.isArray(teams) || teams.length === 0) && !loading && (
          <p className="text-gray-500">No teams yet — create the first one!</p>
        )}

        {Array.isArray(teams) && teams.map(team => (
          <article key={team._id || team.slug} className="class border rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <Link to={`/teams/${team.slug}`} className="text-xl font-semibold hover:underline">
                  {team.name}
                </Link>
                <p className="text-sm text-gray-500">{team.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Owner: {team.owner?.name || "Unknown"} • Members: {Array.isArray(team.members) ? team.members.length : 0}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!!team.tags?.length && (
                  <div className="flex flex-wrap gap-2">
                    {team.tags.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 border">#{t}</span>
                    ))}
                  </div>
                )}
                <Link to={`/teams/${team.slug}`} className="text-sm text-blue-600">View</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
