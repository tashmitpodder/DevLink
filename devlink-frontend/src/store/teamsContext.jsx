// src/store/teamsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

// Create context
const TeamsContext = createContext();

// Hook to use teams store
export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error("useTeams must be used inside a TeamsProvider");
  return ctx;
}

// Provider component
export function TeamsProvider({ children }) {
  const [teams, setTeams] = useState([]);      // array of team objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load teams once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/teams");
        const list = Array.isArray(data) ? data : (Array.isArray(data?.teams) ? data.teams : []);
        if (mounted) setTeams(list);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load teams");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Create team and prepend to list
  const addTeam = async (payload, token) => {
    // call backend
    const created = await apiRequest("/teams", "POST", payload, token);
    // update frontend list
    setTeams(prev => [created, ...prev]);
    return created;
  };

  // Join team (returns updated team)
  const joinTeam = async (slug, token) => {
    const updated = await apiRequest(`/teams/${slug}/join`, "POST", null, token);
    setTeams(prev => prev.map(t => t.slug === slug ? updated : t));
    return updated;
  };

  // Leave team (returns updated team)
  const leaveTeam = async (slug, token) => {
    const updated = await apiRequest(`/teams/${slug}/leave`, "POST", null, token);
    setTeams(prev => prev.map(t => t.slug === slug ? updated : t));
    return updated;
  };

  return (
    <TeamsContext.Provider value={{ teams, loading, error, addTeam, joinTeam, leaveTeam, setTeams }}>
      {children}
    </TeamsContext.Provider>
  );
}
