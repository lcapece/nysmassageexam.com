import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView, Alert, Switch, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { Card } from '@/components/desktop/card';

const ADMIN_EMAIL = 'lcapece@optonline.net';
const SUPABASE_URL = 'https://ekklokrukxmqlahtonnc.supabase.co';
const MOCK_SIMULATION_URL = `${SUPABASE_URL}/functions/v1/nys-massage-mock-simulation`;
const LEADERBOARD_URL = `${SUPABASE_URL}/functions/v1/nys-massage-leaderboard`;

interface MockUser {
  id: string;
  user_email: string;
  display_name: string;
  location: string;
  is_mock: boolean;
  show_on_leaderboard: boolean;
  last_active_at: string;
  config?: {
    activity_profile: string;
    is_active: boolean;
    min_questions_per_session: number;
    max_questions_per_session: number;
    accuracy_min: number;
    accuracy_max: number;
  };
}

interface AdminPanelProps {
  userEmail: string;
  onClose: () => void;
}

export function AdminPanel({ userEmail, onClose }: AdminPanelProps) {
  const colors = useColors();
  const [mockUsers, setMockUsers] = useState<MockUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [lastSimulationResult, setLastSimulationResult] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<MockUser | null>(null);

  const isAdmin = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const fetchMockUsers = useCallback(async () => {
    if (!isAdmin) return;

    setLoading(true);
    try {
      // Fetch from Supabase directly using REST API
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/nys_massage_students?is_mock=eq.true&select=*,nys_massage_mock_config(*)`,
        {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch mock users');

      const data = await response.json();
      const users: MockUser[] = data.map((user: any) => ({
        ...user,
        config: user.nys_massage_mock_config?.[0] || null,
      }));

      setMockUsers(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchMockUsers();
  }, [fetchMockUsers]);

  const runSimulation = async () => {
    setSimulationRunning(true);
    setLastSimulationResult(null);

    try {
      const response = await fetch(MOCK_SIMULATION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: userEmail,
          action: 'simulate',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setLastSimulationResult(`Simulated ${result.usersSimulated} users with ${result.totalProgress} questions`);
        fetchMockUsers(); // Refresh the list
      } else {
        setLastSimulationResult(`Error: ${result.error || 'Simulation failed'}`);
      }
    } catch (err) {
      setLastSimulationResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSimulationRunning(false);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const response = await fetch(LEADERBOARD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminEmail: userEmail,
          action: 'refresh',
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Leaderboard cache refreshed');
      } else {
        Alert.alert('Error', result.error || 'Failed to refresh');
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const toggleUserActive = async (user: MockUser) => {
    if (!user.config) return;

    try {
      const newStatus = !user.config.is_active;

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/nys_massage_mock_config?student_id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ is_active: newStatus }),
        }
      );

      if (response.ok) {
        fetchMockUsers();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  const toggleLeaderboardVisibility = async (user: MockUser) => {
    try {
      const newStatus = !user.show_on_leaderboard;

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/nys_massage_students?id=eq.${user.id}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ show_on_leaderboard: newStatus }),
        }
      );

      if (response.ok) {
        fetchMockUsers();
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update user');
    }
  };

  if (!isAdmin) {
    return (
      <Card className="p-6">
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Ionicons name="lock-closed" size={48} color={colors.error} />
          <Text style={{ color: colors.error, marginTop: 12, fontSize: 16, fontWeight: '600' }}>
            Access Denied
          </Text>
          <Text style={{ color: colors.muted, marginTop: 8, textAlign: 'center' }}>
            Admin panel is only accessible to authorized administrators.
          </Text>
          <Pressable
            onPress={onClose}
            style={{
              marginTop: 20,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Go Back</Text>
          </Pressable>
        </View>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.error + '10',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="shield-checkmark" size={24} color={colors.error} />
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground }}>
              Admin Panel
            </Text>
          </View>
          <Pressable onPress={onClose}>
            <Ionicons name="close" size={24} color={colors.muted} />
          </Pressable>
        </View>
        <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
          Mock User Management - {mockUsers.length} mock users
        </Text>
      </View>

      {/* Actions */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          flexDirection: 'row',
          gap: 12,
        }}
      >
        <Pressable
          onPress={runSimulation}
          disabled={simulationRunning}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: simulationRunning ? colors.surfaceHover : colors.primary,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {simulationRunning ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="play" size={18} color="#fff" />
          )}
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {simulationRunning ? 'Running...' : 'Run Simulation'}
          </Text>
        </Pressable>

        <Pressable
          onPress={refreshLeaderboard}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: colors.surfaceHover,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="refresh" size={18} color={colors.foreground} />
          <Text style={{ color: colors.foreground, fontWeight: '600' }}>Refresh Cache</Text>
        </Pressable>
      </View>

      {/* Simulation Result */}
      {lastSimulationResult && (
        <View
          style={{
            padding: 12,
            backgroundColor: lastSimulationResult.startsWith('Error') ? colors.errorMuted : colors.successMuted,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Text
            style={{
              color: lastSimulationResult.startsWith('Error') ? colors.error : colors.success,
              fontWeight: '500',
            }}
          >
            {lastSimulationResult}
          </Text>
        </View>
      )}

      {/* Content */}
      <ScrollView style={{ maxHeight: 400 }}>
        {loading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ color: colors.error }}>{error}</Text>
          </View>
        ) : (
          <View style={{ padding: 16 }}>
            {/* Stats Summary */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
              <View
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: colors.surfaceHover,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                  {mockUsers.filter(u => u.config?.is_active).length}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Active</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: colors.surfaceHover,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.success }}>
                  {mockUsers.filter(u => u.show_on_leaderboard).length}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>On Leaderboard</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  padding: 12,
                  backgroundColor: colors.surfaceHover,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.warning }}>
                  {mockUsers.length}
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>Total</Text>
              </View>
            </View>

            {/* User List */}
            {mockUsers.map((user) => (
              <View
                key={user.id}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                      {user.display_name}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {user.location} | {user.config?.activity_profile || 'No profile'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{ alignItems: 'center' }}>
                      <Switch
                        value={user.config?.is_active ?? false}
                        onValueChange={() => toggleUserActive(user)}
                        trackColor={{ false: colors.border, true: colors.success }}
                      />
                      <Text style={{ fontSize: 10, color: colors.muted }}>Active</Text>
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Switch
                        value={user.show_on_leaderboard}
                        onValueChange={() => toggleLeaderboardVisibility(user)}
                        trackColor={{ false: colors.border, true: colors.primary }}
                      />
                      <Text style={{ fontSize: 10, color: colors.muted }}>Visible</Text>
                    </View>
                  </View>
                </View>

                {user.config && (
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <View
                      style={{
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        backgroundColor: colors.primaryMuted,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: colors.primary }}>
                        Q: {user.config.min_questions_per_session}-{user.config.max_questions_per_session}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingVertical: 2,
                        paddingHorizontal: 8,
                        backgroundColor: colors.successMuted,
                        borderRadius: 4,
                      }}
                    >
                      <Text style={{ fontSize: 10, color: colors.success }}>
                        Acc: {user.config.accuracy_min}-{user.config.accuracy_max}%
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Card>
  );
}

export default AdminPanel;
