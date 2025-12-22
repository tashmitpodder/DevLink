import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

const PostsContext = createContext();

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return ctx;
}

export function PostsProvider({ children }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Load posts once
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);

        // ✅ FIXED ENDPOINT
        const data = await apiRequest("/posts");

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.posts)
          ? data.posts
          : [];

        if (mounted) setFeed(list);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // 🔹 Create post (optimistic)
  const addPost = async (payload, token) => {
    const tempId = `temp-${Date.now()}`;
    const temp = {
      _id: tempId,
      content: payload.content,
      tags: payload.tags || [],
      author: { name: "You" },
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setFeed((prev) => [temp, ...prev]);

    try {
      // ✅ FIXED ENDPOINT
      const created = await apiRequest(
        "/posts",
        "POST",
        payload,
        token
      );

      setFeed((prev) =>
        prev.map((item) => (item._id === tempId ? created : item))
      );

      return created;
    } catch (err) {
      setFeed((prev) => prev.filter((item) => item._id !== tempId));
      throw err;
    }
  };

  return (
    <PostsContext.Provider
      value={{ feed, setFeed, loading, error, addPost }}
    >
      {children}
    </PostsContext.Provider>
  );
}
