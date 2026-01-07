/**
 * Leaderboard and Progress Syncing Service
 * Handles syncing local study progress to the server for leaderboard tracking
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProgress, StudyProgress } from './study-store';

const SUPABASE_URL = 'https://ekklokrukxmqlahtonnc.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ';
const LEADERBOARD_URL = `${SUPABASE_URL}/functions/v1/nys-massage-leaderboard`;
const VALIDATE_URL = `${SUPABASE_URL}/functions/v1/nys-massage-validate-display-name`;

const STORAGE_KEYS = {
  USER_EMAIL: 'leaderboard_user_email',
  DISPLAY_NAME: 'leaderboard_display_name',
  SHOW_ON_LEADERBOARD: 'leaderboard_show_on_leaderboard',
  LAST_SYNC: 'leaderboard_last_sync',
  DAILY_STUDY_START: 'daily_study_start_time',
};

export type Period = 'weekly' | 'monthly' | 'alltime';

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
  questionsAttempted: number;
  accuracyPercent: number;
  studyMinutes: number;
  daysStudied: number;
  isCurrentUser?: boolean;
}

export interface LeaderboardData {
  period: Period;
  topTen: LeaderboardEntry[];
  currentUserRank?: number;
  currentUserEntry?: LeaderboardEntry;
  totalParticipants: number;
}

export interface UserProfile {
  email: string;
  displayName: string;
  showOnLeaderboard: boolean;
}

// Session tracking
let sessionStartTime: Date | null = null;
let sessionQuestionsAttempted = 0;
let sessionQuestionsCorrect = 0;
let sessionCategoriesStudied: Set<string> = new Set();

/**
 * Initialize a study session
 */
export function startStudySession(): void {
  sessionStartTime = new Date();
  sessionQuestionsAttempted = 0;
  sessionQuestionsCorrect = 0;
  sessionCategoriesStudied = new Set();
}

/**
 * Record a question answer in the current session
 */
export function recordSessionAnswer(isCorrect: boolean, category: string): void {
  sessionQuestionsAttempted++;
  if (isCorrect) sessionQuestionsCorrect++;
  sessionCategoriesStudied.add(category);
}

/**
 * Get current session duration in minutes
 */
export function getSessionMinutes(): number {
  if (!sessionStartTime) return 0;
  return Math.round((Date.now() - sessionStartTime.getTime()) / 60000);
}

/**
 * Get stored user profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const [email, displayName, showOnLeaderboard] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.USER_EMAIL),
      AsyncStorage.getItem(STORAGE_KEYS.DISPLAY_NAME),
      AsyncStorage.getItem(STORAGE_KEYS.SHOW_ON_LEADERBOARD),
    ]);

    if (!email) return null;

    return {
      email,
      displayName: displayName || '',
      showOnLeaderboard: showOnLeaderboard !== 'false',
    };
  } catch {
    return null;
  }
}

/**
 * Save user profile locally
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.USER_EMAIL, profile.email),
    AsyncStorage.setItem(STORAGE_KEYS.DISPLAY_NAME, profile.displayName),
    AsyncStorage.setItem(STORAGE_KEYS.SHOW_ON_LEADERBOARD, String(profile.showOnLeaderboard)),
  ]);
}

/**
 * Clear user profile (for logout)
 */
export async function clearUserProfile(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.USER_EMAIL,
    STORAGE_KEYS.DISPLAY_NAME,
    STORAGE_KEYS.SHOW_ON_LEADERBOARD,
    STORAGE_KEYS.LAST_SYNC,
  ]);
}

/**
 * Validate a display name using the Anthropic-powered validation
 */
export async function validateDisplayName(displayName: string): Promise<{
  valid: boolean;
  reason?: string;
  suggestion?: string;
}> {
  try {
    const response = await fetch(VALIDATE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ displayName }),
    });

    return await response.json();
  } catch {
    return { valid: false, reason: 'Validation service unavailable' };
  }
}

/**
 * Fetch leaderboard data
 */
export async function fetchLeaderboard(
  period: Period = 'weekly',
  userEmail?: string
): Promise<LeaderboardData> {
  const url = new URL(LEADERBOARD_URL);
  url.searchParams.set('period', period);
  if (userEmail) {
    url.searchParams.set('email', userEmail);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }

  return await response.json();
}

/**
 * Sync today's progress to the server
 */
export async function syncProgressToServer(): Promise<boolean> {
  try {
    const profile = await getUserProfile();
    if (!profile?.email || !profile.showOnLeaderboard) {
      return false;
    }

    const progress = await getProgress();
    const today = new Date().toISOString().split('T')[0];

    // Get today's stats from progress
    let todayAttempted = sessionQuestionsAttempted;
    let todayCorrect = sessionQuestionsCorrect;
    const studyMinutes = getSessionMinutes();
    const categoriesStudied = Array.from(sessionCategoriesStudied);

    // Check if we already have progress for today
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/nys_massage_daily_progress?user_email=eq.${encodeURIComponent(profile.email)}&date=eq.${today}`,
      {
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const existingProgress = await checkResponse.json();

    if (existingProgress.length > 0) {
      // Update existing
      const existing = existingProgress[0];
      await fetch(
        `${SUPABASE_URL}/rest/v1/nys_massage_daily_progress?id=eq.${existing.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            questions_attempted: existing.questions_attempted + todayAttempted,
            questions_correct: existing.questions_correct + todayCorrect,
            study_minutes: existing.study_minutes + studyMinutes,
            categories_studied: [
              ...new Set([...(existing.categories_studied || []), ...categoriesStudied]),
            ],
            streak_days: progress.streakDays,
            updated_at: new Date().toISOString(),
          }),
        }
      );
    } else {
      // Create new
      await fetch(`${SUPABASE_URL}/rest/v1/nys_massage_daily_progress`, {
        method: 'POST',
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_email: profile.email,
          date: today,
          questions_attempted: todayAttempted,
          questions_correct: todayCorrect,
          study_minutes: studyMinutes,
          streak_days: progress.streakDays,
          categories_studied: categoriesStudied,
        }),
      });
    }

    // Update last sync time
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString());

    // Reset session counters (but keep session start time for continued tracking)
    sessionQuestionsAttempted = 0;
    sessionQuestionsCorrect = 0;
    sessionCategoriesStudied = new Set();

    return true;
  } catch (error) {
    console.error('Failed to sync progress:', error);
    return false;
  }
}

/**
 * End study session and sync progress
 */
export async function endStudySession(): Promise<void> {
  await syncProgressToServer();
  sessionStartTime = null;
  sessionQuestionsAttempted = 0;
  sessionQuestionsCorrect = 0;
  sessionCategoriesStudied = new Set();
}

/**
 * Check if user is registered for leaderboard
 */
export async function isRegisteredForLeaderboard(): Promise<boolean> {
  const profile = await getUserProfile();
  if (!profile?.email) return false;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/nys_massage_students?user_email=eq.${encodeURIComponent(profile.email)}&select=id`,
      {
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    return data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Register user for leaderboard
 */
export async function registerForLeaderboard(
  email: string,
  displayName: string,
  showOnLeaderboard: boolean = true
): Promise<boolean> {
  try {
    // First check if user already exists
    const checkResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/nys_massage_students?user_email=eq.${encodeURIComponent(email)}`,
      {
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    const existing = await checkResponse.json();

    if (existing.length > 0) {
      // Update
      await fetch(
        `${SUPABASE_URL}/rest/v1/nys_massage_students?user_email=eq.${encodeURIComponent(email)}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            display_name: displayName,
            show_on_leaderboard: showOnLeaderboard,
            display_name_validated: true,
          }),
        }
      );
    } else {
      // Create student record
      await fetch(`${SUPABASE_URL}/rest/v1/nys_massage_students`, {
        method: 'POST',
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_email: email,
          display_name: displayName,
          show_on_leaderboard: showOnLeaderboard,
          display_name_validated: true,
          is_mock: false,
        }),
      });

      // Create SMS settings entry (required for FK constraint)
      await fetch(`${SUPABASE_URL}/rest/v1/nys_massage_sms_settings`, {
        method: 'POST',
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          user_email: email,
          sms_enabled: false,
          phone_number: '',
        }),
      });
    }

    // Save profile locally
    await saveUserProfile({ email, displayName, showOnLeaderboard });

    return true;
  } catch (error) {
    console.error('Failed to register for leaderboard:', error);
    return false;
  }
}

/**
 * Update leaderboard visibility preference
 */
export async function updateLeaderboardVisibility(
  email: string,
  showOnLeaderboard: boolean
): Promise<boolean> {
  try {
    await fetch(
      `${SUPABASE_URL}/rest/v1/nys_massage_students?user_email=eq.${encodeURIComponent(email)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': ANON_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ show_on_leaderboard: showOnLeaderboard }),
      }
    );

    // Update local storage
    await AsyncStorage.setItem(STORAGE_KEYS.SHOW_ON_LEADERBOARD, String(showOnLeaderboard));

    return true;
  } catch {
    return false;
  }
}

// Admin users configuration
export const ADMIN_USERS = [
  { email: 'lcapece@optonline.net', nickname: 'Louis C (admin)', role: 'super_admin' },
] as const;

export const ADMIN_EMAIL = 'lcapece@optonline.net'; // Primary admin for backwards compatibility

export function isAdmin(email: string): boolean {
  return ADMIN_USERS.some(admin => admin.email.toLowerCase() === email.toLowerCase());
}

export function getAdminNickname(email: string): string | null {
  const admin = ADMIN_USERS.find(a => a.email.toLowerCase() === email.toLowerCase());
  return admin?.nickname || null;
}
