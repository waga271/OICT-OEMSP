import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-[var(--bg)] min-h-screen text-[var(--text)] transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 opacity-[0.03] rounded-full blur-[100px] -ml-48 -mb-48"></div>

        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-[var(--accent-bg)] border border-[var(--accent-border)] px-4 py-2 rounded-full mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] italic">Next-Gen Intelligence Platform</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-[var(--text-h)] mb-8 tracking-tighter italic leading-[0.9] animate-in slide-in-from-bottom-8 duration-1000 uppercase">
            Educational <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-blue-500 bg-clip-text text-transparent">Platform.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-[var(--text)] opacity-60 font-medium mb-12 animate-in slide-in-from-bottom-10 duration-1000">
            Learn and teach with our MERN stack platform. Build amazing digital products today.
          </p>

          <form onSubmit={onSearchSubmit} className="max-w-xl mx-auto mb-12 animate-in slide-in-from-bottom-11 duration-1000">
            <div className="relative group">
                <input 
                    type="text" 
                    placeholder="Search intelligence sectors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[var(--social-bg)]/50 backdrop-blur-xl border-2 border-[var(--border)] rounded-2xl py-6 px-8 text-lg font-bold outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10 transition-all text-[var(--text-h)] placeholder:text-gray-500 shadow-2xl"
                />
                <button 
                  type="submit" 
                  className="absolute right-4 top-3 bg-[var(--accent)] text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[var(--accent)]/20"
                >
                  Search
                </button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-in slide-in-from-bottom-12 duration-1000">
            <Link 
              to={isAuthenticated ? "/dashboard" : "/register"} 
              className="group relative px-10 py-5 bg-[var(--text-h)] text-[var(--bg)] rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <span className="relative z-10">{isAuthenticated ? "Go to Dashboard" : "Initialize Journey"}</span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
            
            <Link 
              to="/courses" 
              className="px-10 py-5 border-2 border-[var(--border)] italic font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-[var(--social-bg)] transition-all active:scale-95"
            >
              Explore Modules
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-[var(--accent-border)] hover:bg-[var(--social-bg)]/20 transition-all">
              <div className="w-16 h-16 bg-[var(--accent-bg)] rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-sm">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-black text-[var(--text-h)] mb-4 tracking-tight uppercase italic underline decoration-[var(--accent)] underline-offset-4 decoration-4">Verified Intel</h3>
              <p className="text-[var(--text)] opacity-50 text-sm leading-relaxed font-medium">Earn cryptographically verified certificates upon completing 100% of your chosen learning sector.</p>
            </div>

            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-[var(--accent-border)] hover:bg-[var(--social-bg)]/20 transition-all scale-105 shadow-xl bg-[var(--bg)]">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:-rotate-12 transition-transform shadow-sm">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-xl font-black text-[var(--text-h)] mb-4 tracking-tight uppercase italic underline decoration-blue-500 underline-offset-4 decoration-4">Advanced Analytics</h3>
              <p className="text-[var(--text)] opacity-50 text-sm leading-relaxed font-medium">Real-time performance tracking for both operators and instructors. Data-driven mastery visualization.</p>
            </div>

            <div className="group p-8 rounded-3xl border border-[var(--border)] hover:border-[var(--accent-border)] hover:bg-[var(--social-bg)]/20 transition-all">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform shadow-sm">
                <span className="text-3xl">💳</span>
              </div>
              <h3 className="text-xl font-black text-[var(--text-h)] mb-4 tracking-tight uppercase italic underline decoration-purple-500 underline-offset-4 decoration-4">Stripe Verified</h3>
              <p className="text-[var(--text)] opacity-50 text-sm leading-relaxed font-medium">Seamless, military-grade secure payments for premium modules. Immediate sector access upon purchase.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-24 bg-[var(--social-bg)]/30 backdrop-blur-sm border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-12 md:space-y-0">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-[var(--text-h)] tracking-tighter italic uppercase italic decoration-[var(--accent)] underline underline-offset-8 decoration-4 mb-2">Global Operations</h2>
            <p className="text-[var(--text)] opacity-40 font-bold uppercase tracking-widest text-xs">A world-class academy for digital warfare.</p>
          </div>
          <div className="flex space-x-12">
            <div className="text-center">
                <div className="text-4xl font-black text-[var(--accent)] italic tracking-tighter mb-1">2.4k+</div>
                <div className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">Operators</div>
            </div>
            <div className="text-center border-x border-[var(--border)] px-12">
                <div className="text-4xl font-black text-[var(--text-h)] italic tracking-tighter mb-1">150+</div>
                <div className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">Modules</div>
            </div>
            <div className="text-center">
                <div className="text-4xl font-black text-blue-500 italic tracking-tighter mb-1">99.8%</div>
                <div className="text-[10px] font-black text-[var(--text)] opacity-40 uppercase tracking-widest">Mastery Rate</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;