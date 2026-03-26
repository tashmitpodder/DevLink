import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTeams } from "../../store/teamsContext";
import { useAuth } from "../../store/auth";

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

function MemberBadge({ count }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {count} {count === 1 ? "member" : "members"}
    </span>
  );
}

export default function Teams() {
  const { teams, loading, error } = useTeams();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Teams</h1>
            <p className="text-sm text-gray-400 mt-1">Find a team or start your own.</p>
          </div>
          {user ? (
            <button onClick={() => navigate("/teams/new")} className="btn-primary">+ Create Team</button>
          ) : (
            <Link to="/login" className="btn-secondary text-sm">Log in to create</Link>
          )}
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-5 space-y-3 animate-pulse">
                <div className="skeleton h-5 w-40 rounded" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-2/3 rounded" />
                <div className="flex gap-2 mt-2">
                  <div className="skeleton h-5 w-16 rounded-full" />
                  <div className="skeleton h-5 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">{error}</div>
        )}

        {!loading && (!Array.isArray(teams) || teams.length === 0) && (
          <div className="card p-12 text-center">
            <svg className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">No teams yet</h3>
            <p className="text-sm text-gray-400 mt-1">Be the first to create one!</p>
          </div>
        )}

        {!loading && Array.isArray(teams) && teams.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4">
            {teams.map((team) => {
              const neededSkills = Array.isArray(team.neededSkills) ? team.neededSkills : [];
              return (
                <article
                  key={team._id || team.slug}
                  className="card p-5 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-200 animate-fade-in
                    border-l-[3px] border-l-gray-300 dark:border-l-white/20"
                >
                  <div>
                    <Link
                      to={`/teams/${team.slug}`}
                      className="font-bold text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {team.name}
                    </Link>
                    {team.description && (
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{team.description}</p>
                    )}
                  </div>

                  {/* Hackathon badge */}
                  {team.hackathon && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="font-medium">{team.hackathon}</span>
                    </div>
                  )}

                  {!!team.tags?.length && (
                    <div className="flex flex-wrap gap-1.5">
                      {team.tags.map((t, i) => <TagChip key={i} label={t} />)}
                    </div>
                  )}

                  {/* Needed skills */}
                  {neededSkills.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Looking for</p>
                      <div className="flex flex-wrap gap-1">
                        {neededSkills.map((s, i) => <SkillBadge key={i} label={s} />)}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-white/[0.05]">
                    <MemberBadge count={Array.isArray(team.members) ? team.members.length : 0} />
                    <Link
                      to={`/teams/${team.slug}`}
                      className="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
