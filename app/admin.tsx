import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';

import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { Card } from '@/components/desktop/card';
import { Container, useIsDesktop } from '@/components/desktop/container';
import { AppShell } from '@/components/desktop/nav';
import { getUserProfile, isAdmin, getAdminNickname, UserProfile } from '@/lib/leaderboard-service';

const SUPABASE_URL = 'https://ekklokrukxmqlahtonnc.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ';

interface DashboardStats {
  realUsers: number;
  mockUsers: number;
  leaderboardVisible: number;
  totalPurchases: number;
  activeUsers7d: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  totalStudyMinutes: number;
  recentUsers: RecentUser[];
  topPerformers: TopPerformer[];
  recentPurchases: RecentPurchase[];
}

interface RecentUser {
  email: string;
  displayName: string;
  createdAt: string;
  isMock: boolean;
}

interface TopPerformer {
  displayName: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyPercent: number;
}

interface RecentPurchase {
  email: string;
  amountCents: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const colors = useColors();
  const isDesktop = useIsDesktop();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      // Fetch main stats
      const statsResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/get_admin_dashboard_stats`,
        {
          method: 'POST',
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      // If RPC doesn't exist, fetch manually
      if (!statsResponse.ok) {
        // Fetch students
        const studentsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/nys_massage_students?select=*&order=created_at.desc`,
          { headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' } }
        );
        const students = await studentsRes.json();

        // Fetch daily progress
        const progressRes = await fetch(
          `${SUPABASE_URL}/rest/v1/nys_massage_daily_progress?select=*`,
          { headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' } }
        );
        const progress = await progressRes.json();

        // Fetch purchases
        const purchasesRes = await fetch(
          `${SUPABASE_URL}/rest/v1/nys_massage_purchases?select=*&order=created_at.desc&limit=10`,
          { headers: { 'apikey': ANON_KEY, 'Content-Type': 'application/json' } }
        );
        const purchases = await purchasesRes.json();

        // Calculate stats
        const realUsers = students.filter((s: any) => !s.is_mock);
        const mockUsers = students.filter((s: any) => s.is_mock);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const activeEmails = new Set(
          progress
            .filter((p: any) => new Date(p.date) >= sevenDaysAgo)
            .map((p: any) => p.user_email)
        );

        const totalQuestionsAttempted = progress.reduce((sum: number, p: any) => sum + (p.questions_attempted || 0), 0);
        const totalQuestionsCorrect = progress.reduce((sum: number, p: any) => sum + (p.questions_correct || 0), 0);
        const totalStudyMinutes = progress.reduce((sum: number, p: any) => sum + (p.study_minutes || 0), 0);

        // Calculate top performers
        const userStats: Record<string, { attempted: number; correct: number; displayName: string }> = {};
        for (const p of progress) {
          if (!userStats[p.user_email]) {
            const student = students.find((s: any) => s.user_email === p.user_email);
            userStats[p.user_email] = {
              attempted: 0,
              correct: 0,
              displayName: student?.display_name || p.user_email.split('@')[0],
            };
          }
          userStats[p.user_email].attempted += p.questions_attempted || 0;
          userStats[p.user_email].correct += p.questions_correct || 0;
        }

        const topPerformers = Object.entries(userStats)
          .map(([email, data]) => ({
            displayName: data.displayName,
            questionsAttempted: data.attempted,
            questionsCorrect: data.correct,
            accuracyPercent: data.attempted > 0 ? Math.round((data.correct / data.attempted) * 100) : 0,
          }))
          .sort((a, b) => b.questionsAttempted - a.questionsAttempted)
          .slice(0, 10);

        setStats({
          realUsers: realUsers.length,
          mockUsers: mockUsers.length,
          leaderboardVisible: students.filter((s: any) => s.show_on_leaderboard).length,
          totalPurchases: purchases.length,
          activeUsers7d: activeEmails.size,
          totalQuestionsAttempted,
          totalQuestionsCorrect,
          totalStudyMinutes,
          recentUsers: realUsers.slice(0, 5).map((s: any) => ({
            email: s.user_email,
            displayName: s.display_name || s.user_email.split('@')[0],
            createdAt: s.created_at,
            isMock: s.is_mock,
          })),
          topPerformers,
          recentPurchases: purchases.map((p: any) => ({
            email: p.email,
            amountCents: p.amount_cents,
            status: p.status,
            createdAt: p.created_at,
          })),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const profile = await getUserProfile();
    setUserProfile(profile);

    if (profile?.email && isAdmin(profile.email)) {
      await fetchStats();
    }
    setLoading(false);
  }, [fetchStats]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  // Access denied view
  if (!loading && (!userProfile?.email || !isAdmin(userProfile.email))) {
    const content = (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.errorMuted,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <MaterialIcons name="lock" size={40} color={colors.error} />
        </View>
        <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
          Access Denied
        </Text>
        <Text style={{ fontSize: 16, color: colors.muted, textAlign: 'center', marginBottom: 24 }}>
          This page is restricted to administrators only.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
        </Pressable>
      </View>
    );

    return isDesktop ? <AppShell>{content}</AppShell> : <ScreenContainer>{content}</ScreenContainer>;
  }

  // Loading view
  if (loading) {
    const content = (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.muted }}>Loading admin dashboard...</Text>
      </View>
    );

    return isDesktop ? <AppShell>{content}</AppShell> : <ScreenContainer>{content}</ScreenContainer>;
  }

  const adminNickname = userProfile?.email ? getAdminNickname(userProfile.email) : null;
  const accuracyPercent = stats && stats.totalQuestionsAttempted > 0
    ? Math.round((stats.totalQuestionsCorrect / stats.totalQuestionsAttempted) * 100)
    : 0;
  const totalStudyHours = stats ? Math.round(stats.totalStudyMinutes / 60) : 0;

  const dashboardContent = (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: 100 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <Container>
        {/* Header */}
        <View style={{ paddingTop: isDesktop ? 32 : 16, paddingBottom: 24, paddingHorizontal: isDesktop ? 0 : 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: colors.error + '20',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <MaterialIcons name="admin-panel-settings" size={28} color={colors.error} />
            </View>
            <View>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                Admin Dashboard
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted }}>
                Welcome, {adminNickname || userProfile?.email}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <View style={{ paddingHorizontal: isDesktop ? 0 : 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
            Overview
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {/* Real Users */}
            <View style={{ flex: 1, minWidth: isDesktop ? 180 : '45%' }}>
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: colors.primaryMuted,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <MaterialIcons name="person" size={24} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                      {stats?.realUsers || 0}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>Real Users</Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Active Users (7d) */}
            <View style={{ flex: 1, minWidth: isDesktop ? 180 : '45%' }}>
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: colors.successMuted,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <MaterialIcons name="trending-up" size={24} color={colors.success} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                      {stats?.activeUsers7d || 0}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>Active (7 days)</Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Total Purchases */}
            <View style={{ flex: 1, minWidth: isDesktop ? 180 : '45%' }}>
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: colors.warningMuted,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <MaterialIcons name="shopping-cart" size={24} color={colors.warning} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                      {stats?.totalPurchases || 0}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>Purchases</Text>
                  </View>
                </View>
              </Card>
            </View>

            {/* Mock Users */}
            <View style={{ flex: 1, minWidth: isDesktop ? 180 : '45%' }}>
              <Card style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: colors.border,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <MaterialIcons name="smart-toy" size={24} color={colors.muted} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                      {stats?.mockUsers || 0}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>Mock Users</Text>
                  </View>
                </View>
              </Card>
            </View>
          </View>
        </View>

        {/* Study Metrics */}
        <View style={{ paddingHorizontal: isDesktop ? 0 : 20, marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
            Platform Activity
          </Text>
          <Card style={{ padding: 20 }}>
            <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 20 }}>
              {/* Questions Attempted */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Questions
                </Text>
                <Text style={{ fontSize: 32, fontWeight: '700', color: colors.primary, marginTop: 4 }}>
                  {stats?.totalQuestionsAttempted?.toLocaleString() || 0}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <MaterialIcons name="check-circle" size={16} color={colors.success} />
                  <Text style={{ fontSize: 14, color: colors.success }}>
                    {stats?.totalQuestionsCorrect?.toLocaleString() || 0} correct ({accuracyPercent}%)
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{
                width: isDesktop ? 1 : '100%',
                height: isDesktop ? 'auto' : 1,
                backgroundColor: colors.border,
              }} />

              {/* Study Time */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Total Study Time
                </Text>
                <Text style={{ fontSize: 32, fontWeight: '700', color: colors.warning, marginTop: 4 }}>
                  {totalStudyHours.toLocaleString()} hrs
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <MaterialIcons name="schedule" size={16} color={colors.muted} />
                  <Text style={{ fontSize: 14, color: colors.muted }}>
                    {stats?.totalStudyMinutes?.toLocaleString() || 0} minutes total
                  </Text>
                </View>
              </View>

              {/* Divider */}
              <View style={{
                width: isDesktop ? 1 : '100%',
                height: isDesktop ? 'auto' : 1,
                backgroundColor: colors.border,
              }} />

              {/* Leaderboard */}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Leaderboard Visible
                </Text>
                <Text style={{ fontSize: 32, fontWeight: '700', color: colors.foreground, marginTop: 4 }}>
                  {stats?.leaderboardVisible || 0}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <MaterialIcons name="leaderboard" size={16} color={colors.muted} />
                  <Text style={{ fontSize: 14, color: colors.muted }}>
                    users on leaderboard
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Top Performers */}
        <View style={{ paddingHorizontal: isDesktop ? 0 : 20, marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
            Top Performers
          </Text>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {stats?.topPerformers?.slice(0, 5).map((performer, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: index < 4 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: index === 0 ? colors.warning : index === 1 ? colors.muted : index === 2 ? '#CD7F32' : colors.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: index < 3 ? '#fff' : colors.foreground }}>
                    {index + 1}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                    {performer.displayName}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.muted }}>
                    {performer.questionsAttempted} questions
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.success }}>
                    {performer.accuracyPercent}%
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>accuracy</Text>
                </View>
              </View>
            ))}
            {(!stats?.topPerformers || stats.topPerformers.length === 0) && (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: colors.muted }}>No data available</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Recent Purchases */}
        <View style={{ paddingHorizontal: isDesktop ? 0 : 20, marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
            Recent Purchases
          </Text>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {stats?.recentPurchases?.slice(0, 5).map((purchase, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 16,
                  borderBottomWidth: index < Math.min(stats.recentPurchases.length - 1, 4) ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.successMuted,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <MaterialIcons name="receipt" size={20} color={colors.success} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: colors.foreground }}>
                    {purchase.email}
                  </Text>
                  <Text style={{ fontSize: 13, color: colors.muted }}>
                    {new Date(purchase.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: colors.success }}>
                    ${(purchase.amountCents / 100).toFixed(0)}
                  </Text>
                  <View style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 4,
                    backgroundColor: purchase.status === 'succeeded' ? colors.successMuted : colors.warningMuted,
                  }}>
                    <Text style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: purchase.status === 'succeeded' ? colors.success : colors.warning,
                      textTransform: 'uppercase',
                    }}>
                      {purchase.status}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
            {(!stats?.recentPurchases || stats.recentPurchases.length === 0) && (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: colors.muted }}>No purchases yet</Text>
              </View>
            )}
          </Card>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: isDesktop ? 0 : 20, marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
            Quick Actions
          </Text>
          <View style={{ flexDirection: isDesktop ? 'row' : 'column', gap: 12 }}>
            <Pressable
              onPress={() => router.push('/(tabs)/settings')}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.primaryMuted,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <MaterialIcons name="smart-toy" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                  Mock User Panel
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted }}>
                  Manage simulated users
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/(tabs)/progress')}
              style={({ pressed }) => ({
                flex: 1,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: colors.successMuted,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <MaterialIcons name="analytics" size={22} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                  View Progress
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted }}>
                  Check study analytics
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: isDesktop ? 0 : 20, marginTop: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            NYS Massage Exam Admin Dashboard
          </Text>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 4 }}>
            Last refreshed: {new Date().toLocaleTimeString()}
          </Text>
        </View>
      </Container>
    </ScrollView>
  );

  return isDesktop ? <AppShell>{dashboardContent}</AppShell> : <ScreenContainer>{dashboardContent}</ScreenContainer>;
}
