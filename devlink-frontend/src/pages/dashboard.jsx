import { usePosts } from "../store/postsContext";

export default function Dashboard() {
  const { feed, loading, error } = usePosts(); // shared global posts //understand this global posts

  return (
    <div className="flex justify-center px-4 py-6">
      <div className="w-full max-w-xl">
        
        {loading && (
          <p className="text-gray-500">Loading posts...</p>
        )}

        {error && (
          <p className="text-red-600 mb-4">{error}</p>
        )}

        {!loading && feed.length === 0 && (
          <p className="text-gray-500">No posts yet — be the first! 🚀</p>
        )}

        <div className="space-y-4">
          {feed.map((post) => (
            <div
              key={post._id}
              className="card p-4"
            >
              <h2 className="font-semibold">
                {post.author?.name || "Anonymous"}
              </h2>

              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </p>

              <p className="mt-2">{post.content}</p>

              {!!post.tags?.length && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Tags:</strong> {post.tags.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

