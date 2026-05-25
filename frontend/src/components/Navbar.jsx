import React from 'react';
import { Search, LogOut, LogIn, UserPlus, Flame } from 'lucide-react';

/**
 * Navbar Component
 * Renders the top navigation bar with user session awareness.
 * 
 * Props:
 * - currentView: string ('login' | 'signup' | 'search')
 * - setView: function to change current view
 * - user: string (logged in username, or null)
 * - onLogout: function to log out the user
 */
export default function Navbar({ currentView, setView, user, onLogout }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView(user ? 'search' : 'login')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 shadow-lg shadow-indigo-500/30">
              <Flame className="h-6 w-6 text-white animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
              Poke<span className="text-indigo-400">Portal</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {user ? (
              // Navigation state when logged in
              <div className="flex items-center gap-4">
                <span className="hidden text-sm text-slate-400 sm:inline-block">
                  Welcome, <strong className="text-slate-200">{user}</strong>!
                </span>
                
                <button
                  onClick={() => setView('search')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    currentView === 'search'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </button>

                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/10 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              // Navigation state when logged out
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setView('login')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                    currentView === 'login'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => setView('signup')}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer ${
                    currentView === 'signup'
                      ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Signup</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
