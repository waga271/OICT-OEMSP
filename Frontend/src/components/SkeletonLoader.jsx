function SkeletonLoader({ type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="bg-[var(--bg)] p-6 rounded-2xl shadow-sm border border-[var(--border)] animate-pulse">
        <div className="h-6 bg-[var(--social-bg)] rounded-full w-3/4 mb-4"></div>
        <div className="h-4 bg-[var(--social-bg)] rounded-full w-full mb-2 opacity-50"></div>
        <div className="h-4 bg-[var(--social-bg)] rounded-full w-full mb-2 opacity-50"></div>
        <div className="h-4 bg-[var(--social-bg)] rounded-full w-2/3 mb-6 opacity-50"></div>
        <div className="flex justify-between items-center mb-6 pt-4 border-t border-[var(--border)]">
          <div className="h-8 bg-[var(--accent-bg)] rounded-lg w-16"></div>
          <div className="h-4 bg-[var(--social-bg)] rounded-full w-24"></div>
        </div>
        <div className="h-12 bg-[var(--social-bg)] rounded-xl w-full"></div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-[var(--social-bg)] rounded-xl w-full border border-[var(--border)]"></div>
        ))}
      </div>
    );
  }

  return null;
}

export default SkeletonLoader;
