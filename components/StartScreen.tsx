import React, { useState } from 'react';

interface StartScreenProps {
  onStart: (difficulty: number) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [difficulty, setDifficulty] = useState(5);

  const getDifficultyLabel = (val: number) => {
    if (val <= 3) return "Początkujący";
    if (val <= 6) return "Średni";
    if (val <= 8) return "Trudny";
    return "Ekspert";
  };

  const getDifficultyColor = (val: number) => {
    if (val <= 3) return "text-green-400";
    if (val <= 6) return "text-neon-gold";
    if (val <= 8) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center max-w-4xl mx-auto animate-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="glass-panel p-10 md:p-16 rounded-3xl shadow-2xl border-t border-white/20 w-full">
        <div className="mb-6">
             <span className="inline-block px-3 py-1 rounded-full bg-neon-gold/20 text-neon-gold text-xs font-bold tracking-widest border border-neon-gold/50">
                SEZON 2024
             </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-slate-300 mb-6 drop-shadow-lg leading-tight">
          TEST WIEDZY<br/>
          <span className="text-neon-gold drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">OGÓLNEJ</span>
        </h1>
        
        <p className="text-lg md:text-xl text-blue-100 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
          Czy jesteś gotowy podjąć wyzwanie i sprawdzić swoją inteligencję? Czeka na Ciebie 30 pytań.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-10 text-sm">
             <div className="bg-black/30 p-3 rounded-lg border border-white/10 flex flex-col items-center">
                <span className="text-neon-gold font-bold text-xl">30</span>
                <span className="text-slate-400 uppercase text-xs tracking-wider">Pytań</span>
             </div>
             <div className="bg-black/30 p-3 rounded-lg border border-white/10 flex flex-col items-center">
                <span className="text-neon-blue font-bold text-xl">30s</span>
                <span className="text-slate-400 uppercase text-xs tracking-wider">Czasu</span>
             </div>
             <div className="bg-black/30 p-3 rounded-lg border border-white/10 flex flex-col items-center">
                <span className="text-green-400 font-bold text-xl">3</span>
                <span className="text-slate-400 uppercase text-xs tracking-wider">Punkty MAX</span>
             </div>
             <div className="bg-black/30 p-3 rounded-lg border border-white/10 flex flex-col items-center">
                <span className="text-purple-400 font-bold text-xl">3x</span>
                <span className="text-slate-400 uppercase text-xs tracking-wider">Koła</span>
             </div>
        </div>

        {/* Difficulty Slider */}
        <div className="max-w-md mx-auto mb-12 bg-black/20 p-6 rounded-xl border border-white/10">
          <div className="flex justify-between items-end mb-4">
             <label htmlFor="difficulty" className="text-slate-400 uppercase text-xs font-bold tracking-widest">
               Poziom Trudności
             </label>
             <div className={`font-mono font-bold text-xl ${getDifficultyColor(difficulty)} drop-shadow-md`}>
                {difficulty}/10 <span className="text-sm font-sans uppercase tracking-normal opacity-80">({getDifficultyLabel(difficulty)})</span>
             </div>
          </div>
          
          <input
            id="difficulty"
            type="range"
            min="1"
            max="10"
            step="1"
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value))}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neon-gold focus:outline-none focus:ring-2 focus:ring-neon-gold/50 hover:accent-yellow-300 transition-all"
          />
          <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-mono uppercase">
            <span>Łatwy</span>
            <span>Ekspert</span>
          </div>
        </div>

        <button
          onClick={() => onStart(difficulty)}
          className="relative px-10 py-5 bg-gradient-to-r from-neon-gold to-yellow-500 text-black font-black text-xl uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-105 transition-all duration-300 transform active:scale-95 group"
        >
          <span className="relative z-10">Rozpocznij Test</span>
          <div className="absolute inset-0 bg-white/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
  );
};

export default StartScreen;