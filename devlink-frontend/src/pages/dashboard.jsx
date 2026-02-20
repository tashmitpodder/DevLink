import { usePosts } from "../store/postsContext";

function Initials({ name }) {
  const letters = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return <span className="avatar w-9 h-9 text-sm shrink-0">{letters}</span>;
}

function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3 animate-pulse">
      <div className="flex gap-3 items-start">
        <div className="skeleton w-9 h-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-3.5 w-32 rounded" />
          <div className="skeleton h-2.5 w-24 rounded" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
      </div>
    </div>
  );
}

function PostCard({ post }) {
  return (
    <article className="card p-5 hover:-translate-y-0.5 transition-transform duration-200 animate-fade-in">
      <div className="flex gap-3 items-start">
        <Initials name={post.author?.name} />
        <div className="min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-white leading-none">
            {post.author?.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{post.content}</p>

      {!!post.tags?.length && (
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map((t, i) => (
            <span key={i} className="tag-chip">#{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Dashboard() {
  const { feed, loading, error } = usePosts();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-surface">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="section-title">Community Feed</h1>
          <p className="text-sm text-gray-400 mt-1">See what developers are building and sharing.</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>
        )}

        {!loading && feed.length === 0 && (
          <div className="card p-10 text-center">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">No posts yet</h3>
            <p className="text-sm text-gray-400 mt-1">Be the first to share what you're building!</p>
          </div>
        )}

        {!loading && (
          <div className="space-y-4">
            {feed.map((post) => <PostCard key={post._id} post={post} />)}
          </div>
        )}
      </div>
    </div>
  );
}
