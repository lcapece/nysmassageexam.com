import AsyncStorage from '@react-native-async-storage/async-storage';
import { questions } from '@/data/questions';
import { Question } from '@/data/types';

// Storage keys
const STORAGE_KEYS = {
  PROGRESS: 'study_progress',
  BOOKMARKS: 'bookmarks',
  SETTINGS: 'settings',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  EXAM_DATE: 'selected_exam_date',
  STUDY_START_DATE: 'study_start_date',
};

// Types
export interface QuestionProgress {
  questionId: number;
  answered: boolean;
  correct: boolean;
  attempts: number;
  lastAttemptDate: string;
}

export interface StudyProgress {
  questionsProgress: Record<number, QuestionProgress>;
  totalCorrect: number;
  totalAttempted: number;
  streakDays: number;
  lastStudyDate: string;
  quizHistory: QuizSession[];
}

export interface QuizSession {
  id: string;
  date: string;
  category: string | null;
  totalQuestions: number;
  correctAnswers: number;
  duration: number; // in seconds
}

export interface Settings {
  darkMode: boolean;
  hapticFeedback: boolean;
  showMnemonics: boolean;
  dailyGoal: number;
}

// Default values
const defaultProgress: StudyProgress = {
  questionsProgress: {},
  totalCorrect: 0,
  totalAttempted: 0,
  streakDays: 0,
  lastStudyDate: '',
  quizHistory: [],
};

const defaultSettings: Settings = {
  darkMode: false,
  hapticFeedback: true,
  showMnemonics: true,
  dailyGoal: 20,
};

// Exam dates
export const EXAM_DATES = [
  { date: '2026-03-06', label: 'March 6, 2026', applicationDeadline: '2025-11-01' },
  { date: '2026-09-18', label: 'September 18, 2026', applicationDeadline: '2026-06-01' },
];

// Categories
export const CATEGORIES = [
  'Massage Techniques',
  'Anatomy',
  'Physiology',
  'Pathology',
  'Eastern Medicine',
  'Ethics & Law',
  'Kinesiology',
  'Hydrotherapy',
];

// Store functions
export async function getProgress(): Promise<StudyProgress> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(progress: StudyProgress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

export async function recordAnswer(questionId: number, isCorrect: boolean): Promise<StudyProgress> {
  const progress = await getProgress();
  const existing = progress.questionsProgress[questionId];
  
  progress.questionsProgress[questionId] = {
    questionId,
    answered: true,
    correct: isCorrect,
    attempts: (existing?.attempts || 0) + 1,
    lastAttemptDate: new Date().toISOString(),
  };
  
  if (!existing?.answered) {
    progress.totalAttempted++;
  }
  
  if (isCorrect && !existing?.correct) {
    progress.totalCorrect++;
  } else if (!isCorrect && existing?.correct) {
    progress.totalCorrect--;
  }
  
  // Update streak
  const today = new Date().toDateString();
  const lastStudy = progress.lastStudyDate ? new Date(progress.lastStudyDate).toDateString() : '';
  
  if (lastStudy !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastStudy === yesterday.toDateString()) {
      progress.streakDays++;
    } else if (lastStudy !== today) {
      progress.streakDays = 1;
    }
    progress.lastStudyDate = new Date().toISOString();
  }
  
  await saveProgress(progress);
  return progress;
}

export async function saveQuizSession(session: Omit<QuizSession, 'id'>): Promise<void> {
  const progress = await getProgress();
  progress.quizHistory.unshift({
    ...session,
    id: Date.now().toString(),
  });
  // Keep only last 50 sessions
  progress.quizHistory = progress.quizHistory.slice(0, 50);
  await saveProgress(progress);
}

export async function getBookmarks(): Promise<number[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function toggleBookmark(questionId: number): Promise<number[]> {
  const bookmarks = await getBookmarks();
  const index = bookmarks.indexOf(questionId);
  
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(questionId);
  }
  
  await AsyncStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  return bookmarks;
}

export async function getSettings(): Promise<Settings> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return data === 'true';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
}

export async function getSelectedExamDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.EXAM_DATE);
  } catch {
    return null;
  }
}

export async function setSelectedExamDate(date: string): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEYS.EXAM_DATE, date);
  // Also set study start date if not already set
  const startDate = await AsyncStorage.getItem(STORAGE_KEYS.STUDY_START_DATE);
  if (!startDate) {
    await AsyncStorage.setItem(STORAGE_KEYS.STUDY_START_DATE, new Date().toISOString());
  }
}

export async function getStudyStartDate(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.STUDY_START_DATE);
  } catch {
    return null;
  }
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.PROGRESS,
    STORAGE_KEYS.BOOKMARKS,
    STORAGE_KEYS.STUDY_START_DATE,
  ]);
}

// Helper functions
export function getQuestionsByCategory(category: string): Question[] {
  return questions.filter(q => q.category === category);
}

export function getCategoryStats(progress: StudyProgress): Record<string, { total: number; correct: number; attempted: number }> {
  const stats: Record<string, { total: number; correct: number; attempted: number }> = {};
  
  for (const category of CATEGORIES) {
    const categoryQuestions = getQuestionsByCategory(category);
    let correct = 0;
    let attempted = 0;
    
    for (const q of categoryQuestions) {
      const qProgress = progress.questionsProgress[q.id];
      if (qProgress?.answered) {
        attempted++;
        if (qProgress.correct) correct++;
      }
    }
    
    stats[category] = {
      total: categoryQuestions.length,
      correct,
      attempted,
    };
  }
  
  return stats;
}

export function calculateDaysUntilExam(examDate: string): number {
  const exam = new Date(examDate);
  const today = new Date();
  const diffTime = exam.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateRecommendedDailyQuestions(
  examDate: string,
  progress: StudyProgress
): number {
  const daysLeft = calculateDaysUntilExam(examDate);
  if (daysLeft <= 0) return 0;
  
  const questionsRemaining = questions.length - progress.totalCorrect;
  // Aim to master all questions with some buffer for review
  const questionsPerDay = Math.ceil((questionsRemaining * 1.5) / daysLeft);
  return Math.max(10, Math.min(50, questionsPerDay));
}

export { questions };
export type { Question };
