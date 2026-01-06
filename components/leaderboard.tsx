import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { Card } from '@/components/desktop/card';

const LEADERBOARD_URL = 'https://ekklokrukxmqlahtonnc.supabase.co/functions/v1/nys-massage-leaderboard';

type Period = 'weekly' | 'monthly' | 'alltime';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  score: number;
  questionsAttempted: number;
  accuracyPercent: number;
  studyMinutes: number;
  daysStudied: number;
  isCurrentUser?: boolean;
}

interface LeaderboardData {
  period: Period;
  topTen: LeaderboardEntry[];
  currentUserRank?: number;
  currentUserEntry?: LeaderboardEntry;
  totalParticipants: number;
}

interface LeaderboardProps {
  currentUserEmail?: string;
  compact?: boolean;
}

const PERIOD_LABELS: Record<Period, string> = {
  weekly: 'This Week',
  monthly: 'This Month',
  alltime: 'All Time',
};

export function Leaderboard({ currentUserEmail, compact = false }: LeaderboardProps) {
  const colors = useColors();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('weekly');
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async (period: Period) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(LEADERBOARD_URL);
      url.searchParams.set('period', period);
      if (currentUserEmail) {
        url.searchParams.set('email', currentUserEmail);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch leaderboard');
      }

      const result: LeaderboardData = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail]);

  useEffect(() => {
    fetchLeaderboard(selectedPeriod);
  }, [selectedPeriod, fetchLeaderboard]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Text style={{ fontSize: 20 }}>🥇</Text>;
      case 2:
        return <Text style={{ fontSize: 20 }}>🥈</Text>;
      case 3:
        return <Text style={{ fontSize: 20 }}>🥉</Text>;
      default:
        return (
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: colors.surfaceHover,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.muted, fontWeight: '600', fontSize: 12 }}>
              {rank}
            </Text>
          </View>
        );
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="trophy" size={24} color={colors.warning} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground }}>
              Leaderboard
            </Text>
          </View>
          <Text style={{ fontSize: 12, color: colors.muted }}>
            {data?.totalParticipants || 0} students
          </Text>
        </View>

        {/* Period Tabs */}
        <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
          {(['weekly', 'monthly', 'alltime'] as Period[]).map((period) => (
            <Pressable
              key={period}
              onPress={() => handlePeriodChange(period)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: selectedPeriod === period ? colors.primary : colors.surfaceHover,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: selectedPeriod === period ? '#fff' : colors.muted,
                }}
              >
                {PERIOD_LABELS[period]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={{ padding: 16, minHeight: compact ? 300 : 400 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.muted, marginTop: 12 }}>Loading rankings...</Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Ionicons name="alert-circle" size={48} color={colors.error} />
            <Text style={{ color: colors.error, marginTop: 12 }}>{error}</Text>
            <Pressable
              onPress={() => fetchLeaderboard(selectedPeriod)}
              style={{
                marginTop: 16,
                paddingVertical: 8,
                paddingHorizontal: 16,
                backgroundColor: colors.primary,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '600' }}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Top 10 List */}
            {data?.topTen.map((entry, index) => (
              <View
                key={`${entry.rank}-${entry.displayName}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  marginBottom: 8,
                  borderRadius: 12,
                  backgroundColor: entry.isCurrentUser
                    ? colors.primaryMuted
                    : index % 2 === 0
                    ? colors.surfaceHover
                    : 'transparent',
                  borderWidth: entry.isCurrentUser ? 2 : 0,
                  borderColor: entry.isCurrentUser ? colors.primary : 'transparent',
                }}
              >
                {/* Rank */}
                <View style={{ width: 40, alignItems: 'center' }}>
                  {getRankIcon(entry.rank)}
                </View>

                {/* User Info */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: entry.isCurrentUser ? '700' : '600',
                      color: colors.foreground,
                    }}
                  >
                    {entry.displayName}
                    {entry.isCurrentUser && (
                      <Text style={{ color: colors.primary }}> (You)</Text>
                    )}
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {entry.accuracyPercent.toFixed(0)}% accuracy
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {formatTime(entry.studyMinutes)}
                    </Text>
                  </View>
                </View>

                {/* Score */}
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: '700',
                      color: entry.rank <= 3 ? colors.warning : colors.foreground,
                    }}
                  >
                    {entry.score.toFixed(0)}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted }}>pts</Text>
                </View>
              </View>
            ))}

            {/* Current user if not in top 10 */}
            {data?.currentUserEntry && !data.topTen.some((e) => e.isCurrentUser) && (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                  <Text style={{ paddingHorizontal: 12, color: colors.muted, fontSize: 12 }}>
                    Your Ranking
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.border,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 12,
                    borderRadius: 12,
                    backgroundColor: colors.primaryMuted,
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }}
                >
                  <View style={{ width: 40, alignItems: 'center' }}>
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>
                        {data.currentUserEntry.rank}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.foreground }}>
                      {data.currentUserEntry.displayName}
                      <Text style={{ color: colors.primary }}> (You)</Text>
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
                      <Text style={{ fontSize: 12, color: colors.muted }}>
                        {data.currentUserEntry.accuracyPercent.toFixed(0)}% accuracy
                      </Text>
                      <Text style={{ fontSize: 12, color: colors.muted }}>
                        {formatTime(data.currentUserEntry.studyMinutes)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground }}>
                      {data.currentUserEntry.score.toFixed(0)}
                    </Text>
                    <Text style={{ fontSize: 11, color: colors.muted }}>pts</Text>
                  </View>
                </View>
              </>
            )}

            {/* Empty state */}
            {data?.topTen.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                <Ionicons name="people-outline" size={48} color={colors.muted} />
                <Text style={{ color: colors.muted, marginTop: 12, textAlign: 'center' }}>
                  No rankings yet for this period.{'\n'}Start studying to join the leaderboard!
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Footer */}
      <View
        style={{
          padding: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <Text style={{ fontSize: 11, color: colors.muted, textAlign: 'center' }}>
          Score = 60% accuracy + 30% study time + 10% consistency
        </Text>
      </View>
    </Card>
  );
}

export default Leaderboard;
