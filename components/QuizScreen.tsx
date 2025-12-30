import React, { useState, useEffect, useCallback } from 'react';
import { Question } from '../types';

interface QuizScreenProps {
  questions: Question[];
  onFinish: (history: any[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  // New State for Hints
  const [hintsLeft, setHintsLeft] = useState(3);
  const [currentDisabledOptions, setCurrentDisabledOptions] = useState<number[]>([]); 
  const [hintUsedForCurrent, setHintUsedForCurrent] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleUseHint = () => {
    if (hintsLeft <= 0 || hintUsedForCurrent || isTransitioning) return;

    const correctIdx = currentQuestion.correctAnswerIndex;
    const incorrectIndices = currentQuestion.options
        .map((_, idx) => idx)
        .filter(idx => idx !== correctIdx);
    
    const shuffled = incorrectIndices.sort(() => 0.5 - Math.random());
    const toDisable = shuffled.slice(0, 2);

    setCurrentDisabledOptions(toDisable);
    setHintsLeft(prev => prev - 1);
    setHintUsedForCurrent(true);
  };

  const handleAnswer = useCallback((optionIdx: number | null) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx !== null && optionIdx === currentQuestion.correctAnswerIndex;
    
    let userAnswerText = "BRAK ODPOWIEDZI";
    if (optionIdx !== null) {
        userAnswerText = currentQuestion.options[optionIdx];
    } else {
        userAnswerText = "CZAS MINĄŁ";
    }

    let points = 0;
    if (isCorrect) {
        points = hintUsedForCurrent ? 1 : 3;
    }

    const record = {
      question: currentQuestion.questionText,
      userAnswer: userAnswerText,
      correctAnswer: currentQuestion.options[currentQuestion.correctAnswerIndex],
      isCorrect,
      points,
      usedHint: hintUsedForCurrent
    };

    // Wait 1.5 seconds to show color feedback
    setTimeout(() => {
      const newHistory = [...history, record];
      setHistory(newHistory);
      
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
        setTimeLeft(30); 
        
        setCurrentDisabledOptions([]);
        setHintUsedForCurrent(false);
      } else {
        onFinish(newHistory);
      }
    }, 1500); // Increased slightly so user can enjoy the green/red colors
  }, [currentIdx, currentQuestion, history, isTransitioning, questions.length, onFinish, hintUsedForCurrent]);

  // Timer logic
  useEffect(() => {
    if (isTransitioning) return;

    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isTransitioning, handleAnswer]);

  const progressPercentage = ((currentIdx + 1) / questions.length) * 100;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto p-6 md:p-8">
      
      {/* Header: Info & Timer */}
      <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/10 mb-8 backdrop-blur-sm shadow-lg">
        <div className="flex flex-col">
            <span className="text-xs font-bold text-neon-blue uppercase tracking-widest mb-1">Pytanie</span>
            <span className="text-2xl font-black text-white">{currentIdx + 1} <span className="text-slate-500 text-lg font-medium">/ {questions.length}</span></span>
        </div>

        <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-neon-blue uppercase tracking-widest mb-1">Czas</span>
            <div className={`text-3xl font-mono font-bold transition-all duration-300 ${timeLeft <= 10 ? 'text-red-500 scale-110' : 'text-white'}`}>
                {formatTime(timeLeft)}
            </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-900 rounded-full mb-10 overflow-hidden border border-white/10 shadow-inner">
         <div 
             className="h-full bg-gradient-to-r from-neon-blue to-purple-500 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-500 ease-out" 
             style={{ width: `${progressPercentage}%` }}
         />
      </div>

      {/* Question Card */}
      <div className="flex-grow flex flex-col justify-center animate-fade-in-up">
        <div className="glass-panel p-8 md:p-10 rounded-2xl mb-8 shadow-xl text-center relative overflow-hidden">
             {/* Decor line */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-gold to-transparent opacity-50"></div>
            
            <h2 className="text-2xl md:text-4xl font-sans font-bold leading-snug text-white drop-shadow-md">
                {currentQuestion.questionText}
            </h2>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => {
            const isDisabled = currentDisabledOptions.includes(idx);
            
            // --- LOGIKA KOLORÓW ---
            let buttonClass = "bg-white/5 border-white/20 text-slate-200 hover:bg-white/10 hover:border-white/40"; // Default
            let markerClass = "bg-slate-800 text-slate-400 border-slate-600";
            
            if (isTransitioning) {
                // Faza wyniku (po kliknięciu)
                if (idx === currentQuestion.correctAnswerIndex) {
                    // To jest poprawna odpowiedź -> ZIELONY
                    buttonClass = "bg-green-600 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] scale-[1.02]";
                    markerClass = "bg-green-800 text-white border-green-400";
                } else if (selectedOption === idx) {
                    // To jest odpowiedź użytkownika, ale jest BŁĘDNA -> CZERWONY
                    buttonClass = "bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]";
                    markerClass = "bg-red-800 text-white border-red-400";
                } else {
                     // Inne opcje podczas wyniku
                     buttonClass = "bg-black/40 border-transparent text-slate-600 opacity-50";
                     markerClass = "bg-slate-900 text-slate-700 border-slate-800";
                }
            } else if (selectedOption === idx) {
                // Wybrane (ale jeszcze nie transitioning - rzadki stan w tym kodzie, bo isTransitioning idzie od razu)
                buttonClass = "bg-neon-gold border-neon-gold text-black";
                markerClass = "bg-black text-neon-gold border-black";
            } else if (isDisabled) {
                // Wyłączone przez podpowiedź
                buttonClass = "bg-black/20 border-white/5 text-slate-600 opacity-40 cursor-not-allowed";
                markerClass = "bg-slate-900 text-slate-700 border-slate-800";
            }

            return (
                <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isTransitioning || isDisabled}
                className={`
                    w-full text-left p-4 md:p-5 border-2 rounded-xl transition-all duration-200 group relative
                    flex items-center
                    ${buttonClass}
                `}
                >
                    <span className={`
                        font-mono font-bold text-lg mr-5 w-10 h-10 flex-shrink-0 flex items-center justify-center border-2 rounded-lg transition-colors
                        ${markerClass}
                    `}>
                        {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="font-sans font-semibold text-lg md:text-xl">
                         {option}
                    </span>
                    
                    {/* Ikona poprawności/błędu (opcjonalna) */}
                    {isTransitioning && idx === currentQuestion.correctAnswerIndex && (
                        <div className="absolute right-4 text-white text-2xl">✓</div>
                    )}
                     {isTransitioning && selectedOption === idx && idx !== currentQuestion.correctAnswerIndex && (
                        <div className="absolute right-4 text-white text-2xl">✕</div>
                    )}
                </button>
            );
          })}
        </div>

        {/* Hint Button & Footer */}
        <div className="mt-8 flex justify-between items-center">
             <div className="text-slate-400 text-sm font-mono">
                Poziom trudności: 5/10
             </div>

             <button 
                onClick={handleUseHint}
                disabled={hintsLeft === 0 || hintUsedForCurrent || isTransitioning}
                className={`
                    flex items-center gap-3 px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 shadow-lg
                    ${hintsLeft > 0 && !hintUsedForCurrent && !isTransitioning
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-105 hover:shadow-purple-500/50' 
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'}
                `}
             >
                <span>💡 Koło Ratunkowe (50:50)</span>
                <span className="bg-white text-indigo-900 px-2 py-0.5 rounded-md font-black">{hintsLeft}</span>
             </button>
        </div>

        {/* Timeout Indicator */}
        {isTransitioning && selectedOption === null && (
            <div className="mt-6 text-center bg-red-600/20 border border-red-500/50 p-3 rounded-xl animate-pulse">
                <p className="text-red-400 font-bold tracking-widest uppercase">
                    Czas minął!
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;