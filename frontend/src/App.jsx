import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import PokemonSearch from './components/PokemonSearch';

export default function App() {
  // Application view states: 'login' | 'signup' | 'search'
  const [view, setView] = useState('login');
  
  // Track authenticated user session (stores username)
  const [user, setUser] = useState(() => {
    return localStorage.getItem('poke_user') || null;
  });

  // Keep view aligned with session (if logged in, go to search; if not, force login/signup)
  useEffect(() => {
    if (user) {
      setView('search');
    } else if (view === 'search') {
      setView('login');
    }
  }, [user]);

  // Handle successful login
  const handleLoginSuccess = (username) => {
    localStorage.setItem('poke_user', username);
    setUser(username);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('poke_user');
    setUser(null);
    setView('login');
  };

  return (
    <div className="min-h-screen w-full relative bg-[#060813] text-slate-100 flex flex-col">
      
      {/* Visual Background Elements - Atmospheric Glowing Blobs */}
      <div className="absolute top-[10%] left-[15%] w-[450px] h-[450px] rounded-full bg-indigo-500/10 glow-blob" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full bg-pink-500/5 glow-blob" />
      
      {/* Main Grid Overlay */}
      <div className="absolute inset-0 bg-grid pointer-events-none" />

      {/* Navigation Header */}
      <Navbar currentView={view} setView={setView} user={user} onLogout={handleLogout} />

      {/* Core Page Render */}
      <main className="flex-grow flex flex-col justify-center relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        
        {view === 'login' && (
          <Login setView={setView} onLoginSuccess={handleLoginSuccess} />
        )}

        {view === 'signup' && (
          <Signup setView={setView} />
        )}

        {view === 'search' && (
          user ? (
            <PokemonSearch />
          ) : (
            <Login setView={setView} onLoginSuccess={handleLoginSuccess} />
          )
        )}

      </main>

      {/* Modern Footer */}
      <footer className="relative z-10 border-t border-white/5 py-6 bg-slate-950/40 text-center text-xs text-slate-500">
        <p>© 2026 PokePortal. Connected securely to local FastAPI server. Powered by Tailwind CSS.</p>
      </footer>

    </div>
  );
}
