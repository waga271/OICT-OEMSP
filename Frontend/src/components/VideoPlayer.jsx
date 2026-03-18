function VideoPlayer({ url }) {
  // Helper to extract video ID from YT/Vimeo
  const getEmbedUrl = (videoUrl) => {
    if (!videoUrl) return null;

    // YouTube
    const ytMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

    // Vimeo
    const vimeoMatch = videoUrl.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(.+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

    return null;
  };

  const embedUrl = getEmbedUrl(url);

  if (!embedUrl) {
    return (
        <div className="aspect-video bg-[var(--social-bg)] rounded-3xl flex items-center justify-center text-[var(--text)] border-2 border-dashed border-[var(--border)] group transition-all duration-500">
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-[var(--bg)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[var(--accent)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <p className="text-xs font-black uppercase tracking-widest text-[var(--text-h)] opacity-60">Unsupported Video Source</p>
                <p className="text-[10px] opacity-30 mt-2 font-mono break-all max-w-xs mx-auto italic">{url || 'No URL provided'}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-[var(--border)] relative group transition-colors duration-300">
      <iframe
        className="w-full h-full"
        src={embedUrl}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5 rounded-3xl"></div>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
    </div>
  );
}

export default VideoPlayer;
