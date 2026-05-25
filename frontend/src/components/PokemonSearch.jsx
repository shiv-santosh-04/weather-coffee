import React, { useState } from 'react';
import { Search, ShieldAlert, Sparkles, Scale, Ruler, Zap, Heart, Sword, Shield, Brain, FastForward } from 'lucide-react';

// Color map for Pokemon types to render customized theme colors
const TYPE_COLORS = {
  normal: { bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-500/30', glow: 'shadow-slate-500/10', gradient: 'from-slate-600 to-slate-800' },
  fire: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', glow: 'shadow-orange-500/20', gradient: 'from-orange-500 to-red-600' },
  water: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', glow: 'shadow-blue-500/20', gradient: 'from-blue-500 to-cyan-600' },
  grass: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', glow: 'shadow-emerald-500/20', gradient: 'from-emerald-500 to-teal-600' },
  electric: { bg: 'bg-amber-400/20', text: 'text-amber-400', border: 'border-amber-400/30', glow: 'shadow-amber-400/20', gradient: 'from-amber-400 to-yellow-600' },
  ice: { bg: 'bg-cyan-400/20', text: 'text-cyan-400', border: 'border-cyan-400/30', glow: 'shadow-cyan-400/20', gradient: 'from-cyan-400 to-blue-500' },
  fighting: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/10', gradient: 'from-red-600 to-rose-700' },
  poison: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', glow: 'shadow-purple-500/15', gradient: 'from-purple-500 to-fuchsia-600' },
  ground: { bg: 'bg-yellow-700/20', text: 'text-yellow-600', border: 'border-yellow-700/30', glow: 'shadow-yellow-700/10', gradient: 'from-yellow-700 to-amber-800' },
  flying: { bg: 'bg-indigo-400/20', text: 'text-indigo-400', border: 'border-indigo-400/30', glow: 'shadow-indigo-400/10', gradient: 'from-indigo-400 to-violet-500' },
  psychic: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30', glow: 'shadow-pink-500/20', gradient: 'from-pink-500 to-rose-500' },
  bug: { bg: 'bg-lime-500/20', text: 'text-lime-400', border: 'border-lime-500/30', glow: 'shadow-lime-500/10', gradient: 'from-lime-500 to-emerald-600' },
  rock: { bg: 'bg-stone-500/20', text: 'text-stone-300', border: 'border-stone-500/30', glow: 'shadow-stone-500/10', gradient: 'from-stone-600 to-stone-800' },
  ghost: { bg: 'bg-violet-600/20', text: 'text-violet-400', border: 'border-violet-600/30', glow: 'shadow-violet-600/20', gradient: 'from-violet-600 to-purple-800' },
  dragon: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/30', glow: 'shadow-violet-500/25', gradient: 'from-violet-500 to-indigo-700' },
  steel: { bg: 'bg-slate-400/20', text: 'text-slate-300', border: 'border-slate-400/30', glow: 'shadow-slate-400/10', gradient: 'from-slate-400 to-slate-600' },
  fairy: { bg: 'bg-pink-400/20', text: 'text-pink-400', border: 'border-pink-400/30', glow: 'shadow-pink-400/20', gradient: 'from-pink-400 to-pink-600' },
  dark: { bg: 'bg-slate-800/60', text: 'text-slate-400', border: 'border-slate-800/40', glow: 'shadow-slate-900/40', gradient: 'from-slate-800 to-slate-950' },
};

// Map Pokemon stat names to specific icons & styling
const STAT_METADATA = {
  hp: { label: 'HP', icon: Heart, color: 'bg-red-500' },
  attack: { label: 'Attack', icon: Sword, color: 'bg-orange-500' },
  defense: { label: 'Defense', icon: Shield, color: 'bg-blue-500' },
  'special-attack': { label: 'Sp. Atk', icon: Zap, color: 'bg-amber-500' },
  'special-defense': { label: 'Sp. Def', icon: Brain, color: 'bg-teal-500' },
  speed: { label: 'Speed', icon: FastForward, color: 'bg-sky-500' },
};

const SUGGESTED_POKEMON = ['pikachu', 'charizard', 'gengar', 'lucario', 'bulbasaur', 'jigglypuff'];

export default function PokemonSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPokemon = async (name) => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setPokemonData(null);

    const formattedName = name.trim().toLowerCase();

    try {
      const response = await fetch(`http://localhost:8000/pokemon?name=${formattedName}`);
      
      // Let's handle backend error codes and status checks
      if (!response.ok) {
        if (response.status === 404 || response.status === 500) {
          throw new Error('Pokemon not found. Please verify spelling.');
        }
        throw new Error(`Failed to load data (Status: ${response.status})`);
      }

      const data = await response.json();

      // Check if backend returned an error JSON or doesn't look like Pokemon details
      if (data.error || !data.name || !data.sprites) {
        throw new Error(data.error || 'Pokemon not found. Please verify spelling.');
      }

      setPokemonData(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An error occurred while retrieving Pokemon data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPokemon(searchTerm);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    fetchPokemon(name);
  };

  // Determine theme colors based on the Pokemon's primary type
  const primaryType = pokemonData?.types?.[0]?.type?.name || 'normal';
  const typeStyle = TYPE_COLORS[primaryType] || TYPE_COLORS.normal;

  // Get official artwork image or fall back to front_default sprite
  const pokemonImage = 
    pokemonData?.sprites?.other?.['official-artwork']?.front_default ||
    pokemonData?.sprites?.other?.home?.front_default ||
    pokemonData?.sprites?.front_default;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 relative">
      
      {/* Search Input Section */}
      <div className="glass-card rounded-2xl p-6 mb-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 justify-center sm:justify-start">
          <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
          <span>PokePortal Database Search</span>
        </h2>
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name (e.g. charizard, pikachu, gengar)..."
              className="block w-full rounded-xl bg-slate-900/60 border border-slate-700/50 text-white placeholder-slate-500 pl-10 pr-3 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !searchTerm.trim()}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-500/20"
          >
            Search
          </button>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Suggestions:</span>
          {SUGGESTED_POKEMON.map((name) => (
            <button
              key={name}
              onClick={() => handleSuggestionClick(name)}
              disabled={loading}
              className="text-xs rounded-full bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-500/10 px-3 py-1 text-slate-300 hover:text-indigo-400 transition-all cursor-pointer capitalize"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative h-20 w-20">
            {/* Spinning PokeBall animation effect */}
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-indigo-500 animate-spin" />
            <div className="absolute inset-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-pink-500 animate-ping" />
            </div>
          </div>
          <span className="mt-4 text-sm text-slate-400">Querying database...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="glass-card rounded-2xl p-8 border border-red-500/20 bg-red-500/5 text-center flex flex-col items-center gap-3 animate-fadeIn">
          <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/25">
            <ShieldAlert className="h-6 w-6 text-red-400" />
          </div>
          <h3 className="text-lg font-bold text-red-200">Search Failed</h3>
          <p className="text-sm text-slate-400 max-w-md">{error}</p>
        </div>
      )}

      {/* Pokemon Data Card */}
      {pokemonData && !loading && (
        <div className={`glass-card rounded-3xl overflow-hidden shadow-2xl animate-fadeIn shadow-2xl ${typeStyle.glow}`}>
          
          {/* Header Banner - Colorful Gradient */}
          <div className={`bg-gradient-to-r ${typeStyle.gradient} px-6 py-12 relative overflow-hidden flex flex-col items-center sm:flex-row sm:justify-between`}>
            {/* Ambient pattern decorations */}
            <div className="absolute inset-0 bg-grid opacity-10" />
            
            {/* Pokemon Basic Details */}
            <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
              <span className="text-sm font-bold uppercase tracking-widest text-white/70">
                #{String(pokemonData.id).padStart(3, '0')}
              </span>
              <h1 className="text-4xl font-extrabold text-white capitalize tracking-wide mt-1">
                {pokemonData.name}
              </h1>
              
              {/* Type Pills */}
              <div className="mt-3 flex justify-center sm:justify-start gap-2">
                {pokemonData.types.map((t) => {
                  const tagColors = TYPE_COLORS[t.type.name] || TYPE_COLORS.normal;
                  return (
                    <span
                      key={t.type.name}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border uppercase tracking-wider ${tagColors.bg} ${tagColors.text} ${tagColors.border}`}
                    >
                      {t.type.name}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Pokemon Art display */}
            <div className="relative z-10 shrink-0 h-44 w-44 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl scale-75" />
              {pokemonImage ? (
                <img
                  src={pokemonImage}
                  alt={pokemonData.name}
                  className="h-full w-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transform hover:scale-110 transition-transform duration-300 z-10"
                />
              ) : (
                <div className="text-white text-xs border border-white/20 p-2 rounded">No Sprite Available</div>
              )}
            </div>
          </div>

          {/* Detailed Stats & Physical attributes */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950/40">
            
            {/* Stats section */}
            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2">
                Base Stats
              </h3>
              
              <div className="space-y-3.5">
                {pokemonData.stats.map((s) => {
                  const meta = STAT_METADATA[s.stat.name] || { label: s.stat.name, icon: Zap, color: 'bg-indigo-500' };
                  const StatIcon = meta.icon;
                  // Max out stats relative to 255 (highest possible stat value)
                  const percentage = Math.min((s.base_stat / 180) * 100, 100);
                  
                  return (
                    <div key={s.stat.name} className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 w-24 shrink-0">
                        <StatIcon className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="text-xs font-semibold text-slate-400 truncate">{meta.label}</span>
                      </div>
                      <span className="text-xs font-bold text-slate-200 w-8 text-right shrink-0">{s.base_stat}</span>
                      <div className="flex-grow h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${meta.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Profile & Abilities */}
            <div className="space-y-6">
              
              {/* Measurements */}
              <div>
                <h3 className="text-md font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2 mb-4">
                  Profile
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-white/5 p-3">
                    <Ruler className="h-5 w-5 text-indigo-400" />
                    <div>
                      <div className="text-xxs text-slate-500 uppercase font-bold">Height</div>
                      <div className="text-sm font-bold text-slate-200">
                        {pokemonData.height / 10} m <span className="text-slate-500 font-normal">({Math.round(pokemonData.height * 3.28084) / 10}')</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-white/5 p-3">
                    <Scale className="h-5 w-5 text-pink-400" />
                    <div>
                      <div className="text-xxs text-slate-500 uppercase font-bold">Weight</div>
                      <div className="text-sm font-bold text-slate-200">
                        {pokemonData.weight / 10} kg <span className="text-slate-500 font-normal">({Math.round(pokemonData.weight * 2.20462) / 10} lbs)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Abilities */}
              <div>
                <h3 className="text-md font-bold text-slate-300 uppercase tracking-wider border-b border-white/5 pb-2 mb-3">
                  Abilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {pokemonData.abilities.map((a) => (
                    <span
                      key={a.ability.name}
                      className="text-xs font-medium bg-slate-900 border border-white/10 hover:border-white/20 rounded-lg px-3.5 py-1.5 capitalize text-slate-300"
                    >
                      {a.ability.name.replace('-', ' ')}
                      {a.is_hidden && <span className="text-xxs text-pink-400 font-bold ml-1.5 uppercase">Hidden</span>}
                    </span>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
