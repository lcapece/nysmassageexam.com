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
    removeItem: vi.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    multiRemove: vi.fn((keys: string[]) => {
      keys.forEach(key => delete mockStorage[key]);
      return Promise.resolve();
    }),
  },
}));

import {
  TRIAL_QUESTION_IDS,
  getTrialQuestionIds,
  isTrialQuestion,
  hasPurchased,
  setPurchased,
  CATEGORIES,
} from '../lib/study-store';

describe('Trial Mode', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  });

  describe('TRIAL_QUESTION_IDS', () => {
    it('should have 3 questions per category', () => {
      for (const category of CATEGORIES) {
        const trialIds = TRIAL_QUESTION_IDS[category];
        expect(trialIds).toBeDefined();
        expect(trialIds.length).toBe(3);
      }
    });

    it('should have unique question IDs across all categories', () => {
      const allIds = getTrialQuestionIds();
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });
  });

  describe('getTrialQuestionIds', () => {
    it('should return 24 total trial questions (3 per 8 categories)', () => {
      const trialIds = getTrialQuestionIds();
      expect(trialIds.length).toBe(24);
    });

    it('should return an array of numbers', () => {
      const trialIds = getTrialQuestionIds();
      trialIds.forEach(id => {
        expect(typeof id).toBe('number');
      });
    });
  });

  describe('isTrialQuestion', () => {
    it('should return true for trial question IDs', () => {
      const trialIds = getTrialQuestionIds();
      trialIds.forEach(id => {
        expect(isTrialQuestion(id)).toBe(true);
      });
    });

    it('should return false for non-trial question IDs', () => {
      // Use a very high ID that's unlikely to be in trial
      expect(isTrialQuestion(99999)).toBe(false);
    });
  });

  describe('hasPurchased', () => {
    it('should return false by default (no purchase)', async () => {
      const purchased = await hasPurchased();
      expect(purchased).toBe(false);
    });

    it('should return true after purchase is set', async () => {
      await setPurchased(true);
      const purchased = await hasPurchased();
      expect(purchased).toBe(true);
    });

    it('should return false after purchase is revoked', async () => {
      await setPurchased(true);
      await setPurchased(false);
      const purchased = await hasPurchased();
      expect(purchased).toBe(false);
    });
  });

  describe('setPurchased', () => {
    it('should persist purchase status', async () => {
      await setPurchased(true);
      expect(mockStorage['has_purchased']).toBe('true');
    });

    it('should allow revoking purchase', async () => {
      await setPurchased(true);
      await setPurchased(false);
      expect(mockStorage['has_purchased']).toBe('false');
    });
  });
});
