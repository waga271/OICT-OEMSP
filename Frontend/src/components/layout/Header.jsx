import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 dark:bg-[#0f1115] dark:border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <span className="text-white text-xl">🎓</span>
            </div>
            <div className="flex items-center">
                <span className="text-2xl font-black text-blue-600 tracking-tighter">EduMERN</span>
            </div>
          </Link>

          {/* Centered Pill Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <nav className="flex items-center bg-[#f8fafc] dark:bg-white/5 px-2 py-1.5 rounded-full border border-gray-100 dark:border-white/10 shadow-sm">
                <Link to="/" className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all rounded-full hover:bg-white dark:hover:bg-white/10">
                    Home
                </Link>
                <Link to="/courses" className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-all rounded-full hover:bg-white dark:hover:bg-white/10">
                    Courses
                </Link>
                <Link to="/" className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-all">About</Link>
                <Link to="/" className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-all">Faculty</Link>
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-blue-600 transition-all">Sign In</Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-full shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all text-[10px] font-black uppercase tracking-[0.2em]"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-500/20 hover:border-blue-300 transition-all overflow-hidden group">
                    <span className="text-[10px] font-black group-hover:scale-110 transition-transform text-blue-600 dark:text-blue-400">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </Link>
                <div className="h-8 w-px bg-gray-100 dark:bg-white/10 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-900 text-white dark:bg-white dark:text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all"
                >
                  Exit
                </button>
              </div>
            )}
            <div className="pl-4 border-l border-gray-100 dark:border-white/10">
                <ThemeToggle />
            </div>
          </div>

          {/* Mobile UI */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border border-gray-100 dark:border-white/10 transition-all"
            >
              {isOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden transition-all duration-500 ease-in-out bg-white dark:bg-[#0f1115] border-t border-gray-100 dark:border-white/5`}>
        <div className="p-8 space-y-6">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-2xl font-black uppercase italic tracking-tighter text-blue-600">
            Home
          </Link>
          <Link to="/courses" onClick={() => setIsOpen(false)} className="block text-2xl font-black uppercase italic tracking-tighter text-blue-600">
            Courses
          </Link>
          <div className="h-px bg-gray-100 dark:bg-white/5 my-6"></div>
          {isAuthenticated ? (
            <div className="space-y-4">
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block text-sm font-bold text-gray-500 uppercase tracking-widest">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full text-left py-4 text-red-500 font-black uppercase tracking-[0.3em] text-xs border-t border-gray-50 mt-4 h-auto"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-6 pt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-sm font-black uppercase tracking-[0.3em] text-gray-400">
                Sign In
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="w-full text-center bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
