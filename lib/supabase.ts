import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = "https://ekklokrukxmqlahtonnc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ";

// Custom storage adapter for React Native
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignore errors
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS === "web" ? undefined : ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
  },
});

// Helper to get the redirect URL for OAuth
export function getOAuthRedirectUrl(): string {
  if (Platform.OS === "web") {
    // For web, use the current origin
    if (typeof window !== "undefined") {
      return `${window.location.origin}/oauth/callback`;
    }
    return "https://nysmassageexam.com/oauth/callback";
  }
  // For native apps, use the deep link scheme
  return "manus20251227170214://oauth/callback";
}
