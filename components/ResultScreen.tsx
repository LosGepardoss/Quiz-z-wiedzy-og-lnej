import React from 'react';
import { QuizResult } from '../types';

interface ResultScreenProps {
  result: QuizResult;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  const percentage = Math.round((result.score / result.maxScore) * 100);
  
  let verdictTitle = "";
  let verdictDesc = "";
  let colorClass = "";

  if (percentage >= 90) {
    verdictTitle = "MISTRZ WIEDZY";
    verdictDesc = "Absolutna dominacja! Twój wynik jest legendarny.";
    colorClass = "text-green-400";
  } else if (percentage >= 60) {
    verdictTitle = "ZAAWANSOWANY GRACZ";
    verdictDesc = "Bardzo dobry wynik, choć kilka pytań sprawiło trudność.";
    colorClass = "text-neon-gold";
  } else {
    verdictTitle = "POCZĄTKUJĄCY";
    verdictDesc = "Nie poddawaj się! Trening czyni mistrza.";
    colorClass = "text-slate-300";
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 max-w-5xl mx-auto animate-fade-in pb-20">
      
      <div className="w-full text-center py-8">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase tracking-widest">
            Koniec Gry
        </h1>
      </div>

      <div className="glass-panel w-full max-w-3xl p-10 rounded-3xl shadow-2xl flex flex-col items-center mb-10 relative overflow-hidden border-t border-white/20">
         {/* Background glow */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] -z-10 opacity-40"></div>

        <div className={`text-xl md:text-3xl font-black uppercase tracking-[0.2em] mb-4 ${colorClass} drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}>
            {verdictTitle}
        </div>

        <div className="flex flex-col items-center justify-center relative mb-8">
            <div className="text-8xl md:text-9xl font-black text-white drop-shadow-xl relative z-10">
                {result.score}
            </div>
            <div className="text-2xl font-bold text-slate-400 uppercase tracking-widest">
                na {result.maxScore} pkt
            </div>
        </div>
        
        <p className="text-lg text-blue-100 text-center max-w-lg font-medium leading-relaxed">
            {verdictDesc}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
           <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col items-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Poprawne</span>
                <span className="text-2xl font-bold text-green-400">
                    {result.history.filter(h => h.isCorrect).length} / {result.totalQuestions}
                </span>
           </div>
           <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col items-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Skuteczność</span>
                <span className="text-2xl font-bold text-neon-blue">
                    {percentage}%
                </span>
           </div>
           <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col items-center">
                <span className="text-slate-400 text-xs uppercase tracking-wider mb-1">Wykorzystane Koła</span>
                <span className="text-2xl font-bold text-purple-400">
                    {result.history.filter(h => h.usedHint).length}
                </span>
           </div>
      </div>

      <button
        onClick={onRestart}
        className="px-12 py-5 bg-gradient-to-r from-neon-gold to-orange-500 text-black font-black text-xl uppercase tracking-widest rounded-full shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_40px_rgba(251,191,36,0.6)] hover:scale-105 transition-all duration-300"
      >
        Stwórz Nowy Quiz
      </button>

      {/* Answer Review Section */}
      <div className="w-full max-w-3xl mt-16">
        <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest mb-6">
            Analiza Rozgrywki
        </h3>
        
        <div className="space-y-3">
            {result.history.map((item, idx) => (
                <div key={idx} className={`relative p-5 rounded-xl border-l-4 overflow-hidden ${item.isCorrect ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'}`}>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-xs font-bold text-slate-500 uppercase">Pytanie {idx + 1}</span>
                        <div className="flex items-center gap-2">
                             {item.usedHint && <span className="text-[10px] font-bold bg-purple-900 text-purple-200 px-2 py-0.5 rounded uppercase">Koło Ratunkowe</span>}
                            <span className={`font-mono font-bold ${item.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                +{item.points}
                            </span>
                        </div>
                    </div>
                    <p className="text-white font-semibold mb-3 relative z-10">{item.question}</p>
                    
                    {!item.isCorrect && (
                        <div className="bg-black/20 p-3 rounded-lg relative z-10 text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                            <div className="text-red-300">
                                <span className="block text-xs text-red-500/70 uppercase font-bold">Twoja odpowiedź</span>
                                {item.userAnswer}
                            </div>
                            <div className="text-green-300">
                                <span className="block text-xs text-green-500/70 uppercase font-bold">Poprawna odpowiedź</span>
                                {item.correctAnswer}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;