import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-1000">
      <h1 className="text-9xl font-black text-[var(--accent)] italic mb-4 opacity-20">404</h1>
      <h2 className="text-4xl font-black text-[var(--text-h)] uppercase tracking-tighter mb-6">Sector Not Found</h2>
      <p className="text-[var(--text)] opacity-60 max-w-md mb-12 font-medium">
        The learning module or page you are looking for has been moved, deleted, or never existed in this sector.
      </p>
      <Link 
        to="/" 
        className="px-8 py-4 bg-[var(--text-h)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl"
      >
        Return to Command Center
      </Link>
    </div>
  );
}

export default NotFound;
