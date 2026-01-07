import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock AsyncStorage
const mockStorage: Record<string, string> = {};

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn((key: string) => Promise.resolve(mockStorage[key] || null)),
    setItem: vi.fn((key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    multiRemove: vi.fn((keys: string[]) => {
      keys.forEach(key => delete mockStorage[key]);
      return Promise.resolve();
    }),
  },
}));

// Import after mocking
import {
  getProgress,
  saveProgress,
  recordAnswer,
  getBookmarks,
  toggleBookmark,
  getSettings,
  saveSettings,
  calculateDaysUntilExam,
  calculateRecommendedDailyQuestions,
  getCategoryStats,
  EXAM_DATES,
  CATEGORIES,
} from '../lib/study-store';
import { questions } from '../data/questions';

describe('Study Store', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  describe('Questions Data', () => {
    it('should have 287 questions loaded', () => {
      expect(questions.length).toBe(287);
    });

    it('should have required fields for each question', () => {
      const sampleQuestion = questions[0];
      expect(sampleQuestion).toHaveProperty('id');
      expect(sampleQuestion).toHaveProperty('question');
      expect(sampleQuestion).toHaveProperty('rewrite_question');
      expect(sampleQuestion).toHaveProperty('options');
      expect(sampleQuestion).toHaveProperty('correct_option');
      expect(sampleQuestion).toHaveProperty('category');
      expect(sampleQuestion).toHaveProperty('topic_explanation');
      expect(sampleQuestion).toHaveProperty('mnemonic');
    });

    it('should have valid categories', () => {
      const questionCategories = [...new Set(questions.map(q => q.category))];
      questionCategories.forEach(cat => {
        expect(CATEGORIES).toContain(cat);
      });
    });
  });

  describe('Progress Management', () => {
    it('should return default progress when no data exists', async () => {
      const progress = await getProgress();
      expect(progress.totalCorrect).toBe(0);
      expect(progress.totalAttempted).toBe(0);
      expect(progress.streakDays).toBe(0);
      expect(progress.quizHistory).toEqual([]);
    });

    it('should save and retrieve progress', async () => {
      const testProgress = {
        questionsProgress: { 1: { questionId: 1, answered: true, correct: true, attempts: 1, lastAttemptDate: new Date().toISOString() } },
        totalCorrect: 1,
        totalAttempted: 1,
        streakDays: 1,
        lastStudyDate: new Date().toISOString(),
        quizHistory: [],
      };
      
      await saveProgress(testProgress);
      const retrieved = await getProgress();
      
      expect(retrieved.totalCorrect).toBe(1);
      expect(retrieved.totalAttempted).toBe(1);
    });

    it('should record correct answer and update progress', async () => {
      const progress = await recordAnswer(1, true);
      
      expect(progress.totalCorrect).toBe(1);
      expect(progress.totalAttempted).toBe(1);
      expect(progress.questionsProgress[1].correct).toBe(true);
    });

    it('should record incorrect answer', async () => {
      const progress = await recordAnswer(2, false);
      
      // totalCorrect stays at 1 from previous test, totalAttempted increases to 2
      expect(progress.totalCorrect).toBe(1);
      expect(progress.totalAttempted).toBe(2);
      expect(progress.questionsProgress[2].correct).toBe(false);
    });
  });

  describe('Bookmarks', () => {
    it('should return empty bookmarks initially', async () => {
      const bookmarks = await getBookmarks();
      expect(bookmarks).toEqual([]);
    });

    it('should add bookmark', async () => {
      const bookmarks = await toggleBookmark(5);
      expect(bookmarks).toContain(5);
    });

    it('should remove bookmark when toggled again', async () => {
      await toggleBookmark(5);
      const bookmarks = await toggleBookmark(5);
      expect(bookmarks).not.toContain(5);
    });
  });

  describe('Settings', () => {
    it('should return default settings', async () => {
      const settings = await getSettings();
      expect(settings.hapticFeedback).toBe(true);
      expect(settings.showMnemonics).toBe(true);
      expect(settings.dailyGoal).toBe(20);
    });

    it('should save and retrieve settings', async () => {
      await saveSettings({
        darkMode: true,
        hapticFeedback: false,
        showMnemonics: true,
        dailyGoal: 30,
      });
      
      const settings = await getSettings();
      expect(settings.hapticFeedback).toBe(false);
      expect(settings.dailyGoal).toBe(30);
    });
  });

  describe('Exam Date Calculations', () => {
    it('should have valid exam dates', () => {
      expect(EXAM_DATES.length).toBeGreaterThan(0);
      EXAM_DATES.forEach(exam => {
        expect(exam).toHaveProperty('date');
        expect(exam).toHaveProperty('label');
        expect(exam).toHaveProperty('applicationDeadline');
      });
    });

    it('should calculate days until exam correctly', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const days = calculateDaysUntilExam(dateStr);
      expect(days).toBeGreaterThanOrEqual(29);
      expect(days).toBeLessThanOrEqual(31);
    });

    it('should calculate recommended daily questions', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 60);
      const dateStr = futureDate.toISOString().split('T')[0];
      
      const defaultProgress = {
        questionsProgress: {},
        totalCorrect: 0,
        totalAttempted: 0,
        streakDays: 0,
        lastStudyDate: '',
        quizHistory: [],
      };
      
      const recommended = calculateRecommendedDailyQuestions(dateStr, defaultProgress);
      expect(recommended).toBeGreaterThanOrEqual(10);
      expect(recommended).toBeLessThanOrEqual(50);
    });
  });

  describe('Category Stats', () => {
    it('should calculate category stats correctly', () => {
      const testProgress = {
        questionsProgress: {
          1: { questionId: 1, answered: true, correct: true, attempts: 1, lastAttemptDate: '' },
          2: { questionId: 2, answered: true, correct: false, attempts: 1, lastAttemptDate: '' },
        },
        totalCorrect: 1,
        totalAttempted: 2,
        streakDays: 0,
        lastStudyDate: '',
        quizHistory: [],
      };
      
      const stats = getCategoryStats(testProgress);
      
      // Should have stats for all categories
      CATEGORIES.forEach(cat => {
        expect(stats[cat]).toBeDefined();
        expect(stats[cat]).toHaveProperty('total');
        expect(stats[cat]).toHaveProperty('correct');
        expect(stats[cat]).toHaveProperty('attempted');
      });
    });
  });
});
