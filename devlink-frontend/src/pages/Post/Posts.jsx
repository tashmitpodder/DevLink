// pages/posts/Posts.jsx
import { useState } from "react";
import { useAuth } from "../../store/auth";
import { usePosts } from "../../store/postsContext";
import { apiRequest } from "../../utils/api";

export default function Posts() {
  const { feed, setFeed, addPost, loading: feedLoading, error: feedError } = usePosts();
  const { user, token } = useAuth();

  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  // ✏️ edit state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  // ✅ derive "my posts"
  const myPosts =
    user && Array.isArray(feed)
      ? feed.filter((p) => p.author?._id === user.id)
      : [];

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setLocalError("");

    const tagsArr = tags.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      await addPost({ content, tags: tagsArr }, token);
      setContent("");
      setTags("");
    } catch (err) {
      setLocalError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  };

  // ✏️ start editing
  const startEdit = (post) => {
    setEditingId(post._id);
    setEditContent(post.content);
    setEditTags((post.tags || []).join(", "));
  };

  // ❌ cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
    setEditTags("");
  };

  // 💾 save edit
  const saveEdit = async (postId) => {
    try {
      const updated = await apiRequest(
        `/posts/${postId}`,
        "PUT",
        {
          content: editContent,
          tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
        },
        token
      );

      setFeed((prev) => prev.map((p) => (p._id === postId ? updated : p)));
      cancelEdit();
    } catch (err) {
      alert(err.message || "Failed to update post");
    }
  };

  // 🗑️ delete post
  const deletePost = async (postId) => {
    const ok = window.confirm("Delete this post? This action cannot be undone.");
    if (!ok) return;

    try {
      await apiRequest(`/posts/${postId}`, "DELETE", null, token);
      // remove from UI
      setFeed((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.message || "Failed to delete post");
    }
  };

  return (
    <section className="max-w-3xl mx-auto p-4">
      {/* composer */}
      {user ? (
        <form onSubmit={onSubmit} className="card border rounded-2xl p-4 mb-6 shadow-sm">
          <textarea
            rows={3}
            className="w-full border rounded-lg p-3"
            placeholder="Share what you're building or looking for…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <input
              className="flex-1 border rounded-lg p-2"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <button disabled={submitting} className="px-4 py-2 rounded-lg bg-black text-white">
              {submitting ? "Posting…" : "Post"}
            </button>
          </div>
          {(localError || feedError) && (
            <p className="text-red-600 text-sm mt-2">{localError || feedError}</p>
          )}
        </form>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-3 mb-6">
          Login to create a post.
        </div>
      )}

      {/* MY POSTS */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-4">Your Posts</h1>

        {!user && <p className="text-gray-500">Login to see your posts.</p>}
        {user && myPosts.length === 0 && (
          <p className="text-gray-500">You haven’t posted anything yet.</p>
        )}

        {myPosts.map((p) => (
          <article key={p._id} className="card border rounded-2xl p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{p.author?.name}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(p.createdAt).toLocaleString()}
                </p>
              </div>

              {/* actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => startEdit(p)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(p._id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>

            {/* ✏️ edit mode */}
            {editingId === p._id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  className="w-full border rounded-lg p-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input
                  className="w-full border rounded-lg p-2"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => saveEdit(p._id)}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 border rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-3">{p.content}</p>

                {!!p.tags?.length && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {p.tags.map((t, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded border">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
