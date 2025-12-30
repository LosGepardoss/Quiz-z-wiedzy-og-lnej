export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
}

export enum GameState {
  START = 'START',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface QuizResult {
  score: number; // Total points
  maxScore: number; // Max possible points
  totalQuestions: number;
  history: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    points: number;
    usedHint: boolean;
  }[];
}