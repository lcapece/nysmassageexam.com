import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { setPurchased as setLocalPurchased, hasPurchased as getLocalPurchased } from './study-store';

export interface AuthUser {
  id: string;
  email: string | undefined;
  name: string | undefined;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  hasPurchased: boolean;
  purchaseLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshPurchaseStatus: () => Promise<boolean>;
  linkPurchaseToUser: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(true);

  // Check purchase status from database
  const checkPurchaseStatus = useCallback(async (email: string | undefined, userId: string | undefined): Promise<boolean> => {
    if (!email && !userId) {
      // Not logged in - check local storage only
      const localPurchased = await getLocalPurchased();
      return localPurchased;
    }

    try {
      // Check database for purchase
      let query = supabase
        .from('nys_massage_subscribers')
        .select('id, purchased_at, user_id')
        .not('purchased_at', 'is', null);

      if (userId) {
        query = query.or(`user_id.eq.${userId},email.ilike.${email}`);
      } else if (email) {
        query = query.ilike('email', email);
      }

      const { data, error } = await query.limit(1);

      if (error) {
        console.error('[AuthContext] Error checking purchase status:', error);
        // Fall back to local storage
        return await getLocalPurchased();
      }

      const purchased = data && data.length > 0 && data[0].purchased_at !== null;

      // Sync with local storage
      await setLocalPurchased(purchased);

      return purchased;
    } catch (err) {
      console.error('[AuthContext] Error checking purchase status:', err);
      return await getLocalPurchased();
    }
  }, []);

  // Refresh purchase status
  const refreshPurchaseStatus = useCallback(async (): Promise<boolean> => {
    setPurchaseLoading(true);
    try {
      const purchased = await checkPurchaseStatus(user?.email, user?.id);
      setHasPurchased(purchased);
      return purchased;
    } finally {
      setPurchaseLoading(false);
    }
  }, [user, checkPurchaseStatus]);

  // Link existing purchase to newly logged-in user
  const linkPurchaseToUser = useCallback(async (): Promise<boolean> => {
    if (!user?.email || !user?.id) return false;

    try {
      // Find any existing purchase by email and link it to this user
      const { error } = await supabase
        .from('nys_massage_subscribers')
        .update({ user_id: user.id })
        .ilike('email', user.email)
        .is('user_id', null);

      if (error) {
        console.error('[AuthContext] Error linking purchase to user:', error);
        return false;
      }

      // Refresh purchase status
      return await refreshPurchaseStatus();
    } catch (err) {
      console.error('[AuthContext] Error linking purchase:', err);
      return false;
    }
  }, [user, refreshPurchaseStatus]);

  // Convert Supabase user to AuthUser
  const convertUser = (supabaseUser: User | null): AuthUser | null => {
    if (!supabaseUser) return null;
    return {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name,
    };
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      const authUser = convertUser(session?.user ?? null);
      setUser(authUser);
      setLoading(false);

      // Check purchase status
      const purchased = await checkPurchaseStatus(authUser?.email, authUser?.id);
      setHasPurchased(purchased);
      setPurchaseLoading(false);

      // If user just logged in, try to link any existing purchase
      if (authUser?.email) {
        await linkPurchaseToUser();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      const authUser = convertUser(session?.user ?? null);
      setUser(authUser);
      setLoading(false);

      // Check purchase status on auth change
      const purchased = await checkPurchaseStatus(authUser?.email, authUser?.id);
      setHasPurchased(purchased);
      setPurchaseLoading(false);

      // If user just logged in, try to link any existing purchase
      if (_event === 'SIGNED_IN' && authUser?.email) {
        await linkPurchaseToUser();
      }
    });

    return () => subscription.unsubscribe();
  }, [checkPurchaseStatus, linkPurchaseToUser]);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/oauth/callback`
          : undefined,
      },
    });
    if (error) throw error;
  }, []);

  // Sign in with Apple
  const signInWithApple = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/oauth/callback`
          : undefined,
      },
    });
    if (error) throw error;
  }, []);

  // Sign in with email (magic link)
  const signInWithEmail = useCallback(async (email: string): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}/oauth/callback`
          : undefined,
      },
    });
    return { error: error ? new Error(error.message) : null };
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    // Don't clear purchase status on sign out - they can still use in trial mode
  }, []);

  const value: AuthContextType = {
    user,
    session,
    loading,
    hasPurchased,
    purchaseLoading,
    signInWithGoogle,
    signInWithApple,
    signInWithEmail,
    signOut,
    refreshPurchaseStatus,
    linkPurchaseToUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
