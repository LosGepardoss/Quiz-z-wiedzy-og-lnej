import React, { useState, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import { GameState, Question, QuizResult } from './types';
import { fetchQuizQuestions } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  const startGame = useCallback(async (difficulty: number) => {
    setGameState(GameState.LOADING);
    try {
      const fetchedQuestions = await fetchQuizQuestions(difficulty);
      setQuestions(fetchedQuestions);
      setGameState(GameState.QUIZ);
    } catch (error) {
      console.error("Failed to load quiz", error);
      setGameState(GameState.START); 
      alert("Błąd połączenia z bazą danych (API). Spróbuj ponownie.");
    }
  }, []);

  const finishGame = useCallback((history: any[]) => {
    // Calculate total score based on points tracked in history
    const totalPoints = history.reduce((sum, item) => sum + item.points, 0);
    // Max score is 3 points per question
    const maxPossibleScore = history.length * 3;

    setResult({
      score: totalPoints,
      maxScore: maxPossibleScore,
      totalQuestions: history.length,
      history: history
    });
    setGameState(GameState.RESULT);
  }, []);

  const restartGame = useCallback(() => {
    setGameState(GameState.START);
    setResult(null);
    setQuestions([]);
  }, []);

  return (
    // Updated background to vibrant gradient
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans selection:bg-neon-gold selection:text-black overflow-x-hidden">
      {gameState === GameState.START && (
        <StartScreen onStart={startGame} />
      )}

      {gameState === GameState.LOADING && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="glass-panel p-8 rounded-2xl flex flex-col items-center shadow-[0_0_40px_rgba(139,92,246,0.3)]">
                <div className="font-bold text-2xl animate-pulse flex items-center gap-3 text-neon-gold tracking-wider">
                    PRZYGOTOWYWANIE STUDIA...
                </div>
                <div className="mt-4 flex gap-2">
                    <span className="w-3 h-3 bg-neon-blue rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-neon-blue rounded-full animate-bounce delay-100"></span>
                    <span className="w-3 h-3 bg-neon-blue rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        </div>
      )}

      {gameState === GameState.QUIZ && questions.length > 0 && (
        <QuizScreen 
            questions={questions} 
            onFinish={finishGame} 
        />
      )}

      {gameState === GameState.RESULT && result && (
        <ResultScreen 
            result={result} 
            onRestart={restartGame} 
        />
      )}
    </div>
  );
};

export default App;