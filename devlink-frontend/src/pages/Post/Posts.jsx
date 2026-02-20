import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { usePosts } from "../../store/postsContext";
import { apiRequest } from "../../utils/api";

function Initials({ name }) {
  const letters = (name || "U").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span className="avatar w-9 h-9 text-sm shrink-0">{letters}</span>;
}

function TagChip({ label }) {
  return <span className="tag-chip">#{label}</span>;
}

export default function Posts() {
  const { feed, setFeed, addPost, loading: feedLoading, error: feedError } = usePosts();
  const { user, token } = useAuth();

  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");
  const [focused, setFocused] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const myPosts = user && Array.isArray(feed) ? feed.filter((p) => p.author?._id === user.id) : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true); setLocalError("");
    try {
      await addPost({ content, tags: tags.split(",").map((t) => t.trim()).filter(Boolean) }, token);
      setContent(""); setTags(""); setFocused(false);
    } catch (err) {
      setLocalError(err.message || "Failed to create post");
    } finally { setSubmitting(false); }
  };

  const startEdit = (p) => { setEditingId(p._id); setEditContent(p.content); setEditTags((p.tags || []).join(", ")); };
  const cancelEdit = () => { setEditingId(null); setEditContent(""); setEditTags(""); };

  const saveEdit = async (postId) => {
    try {
      const updated = await apiRequest(`/posts/${postId}`, "PUT",
        { content: editContent, tags: editTags.split(",").map((t) => t.trim()).filter(Boolean) }, token);
      setFeed((prev) => prev.map((p) => (p._id === postId ? updated : p)));
      cancelEdit();
    } catch (err) { alert(err.message || "Failed to update post"); }
  };

  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post? This action cannot be undone.")) return;
    try {
      await apiRequest(`/posts/${postId}`, "DELETE", null, token);
      setFeed((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) { alert(err.message || "Failed to delete post"); }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">

        {/* Composer */}
        {user ? (
          <form onSubmit={onSubmit} className="card p-5 space-y-3">
            <div className="flex gap-3 items-start">
              <Initials name={user?.name} />
              <textarea
                rows={focused ? 4 : 2}
                className="textarea-base flex-1 transition-all duration-200"
                placeholder="Share what you're building or looking for…"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setFocused(true)}
              />
            </div>

            {(focused || content) && (
              <div className="flex gap-3 items-center animate-fade-in pl-12">
                <input
                  className="input-base flex-1"
                  placeholder="Tags: react, hackathon, open-source…"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <button disabled={submitting || !content.trim()} className="btn-primary shrink-0">
                  {submitting ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : "Post"}
                </button>
              </div>
            )}

            {(localError || feedError) && (
              <p className="text-red-500 text-sm pl-12">{localError || feedError}</p>
            )}
          </form>
        ) : (
          <div className="card p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">Join the conversation</p>
              <p className="text-xs text-gray-400 mt-0.5">Log in to share your projects and ideas.</p>
            </div>
            <Link to="/login" className="btn-primary shrink-0">Log in</Link>
          </div>
        )}

        {/* My Posts */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h1 className="section-title">Your Posts</h1>
            {myPosts.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full
                bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400
                border border-gray-200 dark:border-white/10">
                {myPosts.length}
              </span>
            )}
          </div>

          {!user && (
            <div className="card p-6 text-center text-gray-400 text-sm">Log in to see your posts.</div>
          )}
          {user && myPosts.length === 0 && !feedLoading && (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-2">✍️</div>
              <p className="text-sm text-gray-400">You haven't posted anything yet.</p>
            </div>
          )}

          <div className="space-y-4">
            {myPosts.map((p) => (
              <article key={p._id} className="card p-5 animate-fade-in">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3 items-start">
                    <Initials name={p.author?.name} />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-white">{p.author?.name}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  {editingId !== p._id && (
                    <div className="flex gap-1">
                      <button onClick={() => startEdit(p)} className="btn-ghost text-xs">Edit</button>
                      <button onClick={() => deletePost(p._id)} className="btn-ghost text-xs text-red-500">Delete</button>
                    </div>
                  )}
                </div>

                {editingId === p._id ? (
                  <div className="mt-3 space-y-2 pl-12 animate-fade-in">
                    <textarea className="textarea-base" rows={3} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                    <input className="input-base" placeholder="Tags (comma separated)" value={editTags} onChange={(e) => setEditTags(e.target.value)} />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(p._id)} className="btn-primary text-xs px-3 py-1.5">Save</button>
                      <button onClick={cancelEdit} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pl-12">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{p.content}</p>
                    {!!p.tags?.length && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {p.tags.map((t, i) => <TagChip key={i} label={t} />)}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
