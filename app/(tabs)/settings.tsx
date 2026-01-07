import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Alert, Switch, Linking, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import {
  getSettings,
  saveSettings,
  getSelectedExamDate,
  setSelectedExamDate,
  resetProgress,
  Settings,
  EXAM_DATES,
} from "@/lib/study-store";
import { getUserProfile, saveUserProfile, isAdmin, ADMIN_EMAIL, UserProfile } from "@/lib/leaderboard-service";
import { ProfileSettings } from "@/components/profile-settings";
import { AdminPanel } from "@/components/admin-panel";

export default function SettingsScreen() {
  const router = useRouter();
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [showExamPicker, setShowExamPicker] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const loadData = useCallback(async () => {
    const [s, exam, profile] = await Promise.all([
      getSettings(),
      getSelectedExamDate(),
      getUserProfile(),
    ]);
    setSettings(s);
    setExamDate(exam);
    setUserProfile(profile);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const updateSetting = async (key: keyof Settings, value: any) => {
    if (!settings) return;
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleThemeToggle = (isDark: boolean) => {
    setColorScheme(isDark ? "dark" : "light");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleExamDateSelect = async (date: string) => {
    await setSelectedExamDate(date);
    setExamDate(date);
    setShowExamPicker(false);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleResetProgress = () => {
    Alert.alert(
      "Reset Progress",
      "Are you sure you want to reset all your progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetProgress();
            loadData();
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        },
      ]
    );
  };

  const handleProfileSave = async (displayName: string, showOnLeaderboard: boolean) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, displayName, showOnLeaderboard };
      await saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    }
    setShowProfileSettings(false);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // Admin Panel Modal
  if (showAdminPanel && userProfile?.email) {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-4">
            <AdminPanel
              userEmail={userProfile.email}
              onClose={() => setShowAdminPanel(false)}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Profile Settings Modal
  if (showProfileSettings && userProfile?.email) {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-4 flex-row items-center mb-4">
            <Pressable onPress={() => setShowProfileSettings(false)}>
              <MaterialIcons name="arrow-back" size={28} color={colors.foreground} />
            </Pressable>
            <Text className="text-xl font-bold text-foreground ml-4">
              Leaderboard Profile
            </Text>
          </View>
          <View className="px-5">
            <ProfileSettings
              userEmail={userProfile.email}
              initialDisplayName={userProfile.displayName}
              initialShowOnLeaderboard={userProfile.showOnLeaderboard}
              onSave={handleProfileSave}
            />
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Subscription Modal
  if (showSubscription) {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View className="px-5 pt-4 flex-row items-center">
            <Pressable onPress={() => setShowSubscription(false)}>
              <MaterialIcons name="close" size={28} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Premium Banner */}
          <View className="items-center px-5 mt-4">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <MaterialIcons name="star" size={40} color={colors.primary} />
            </View>
            <Text className="text-2xl font-bold text-foreground mt-4">
              NYS Massage Exam Pro
            </Text>
            <Text className="text-base text-muted text-center mt-2">
              Unlock all features and maximize your exam preparation
            </Text>
          </View>

          {/* Pricing */}
          <View className="mx-5 mt-6 bg-surface rounded-2xl p-5 border-2" style={{ borderColor: colors.primary }}>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-semibold text-foreground">Lifetime Access</Text>
                <Text className="text-sm text-muted">One-time purchase</Text>
              </View>
              <View className="items-end">
                <Text className="text-3xl font-bold" style={{ color: colors.primary }}>$37</Text>
                <Text className="text-sm text-muted">forever</Text>
              </View>
            </View>

            <View
              className="mt-4 px-3 py-2 rounded-lg self-start"
              style={{ backgroundColor: colors.success + '20' }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.success }}>
                No subscription required
              </Text>
            </View>
          </View>

          {/* Features */}
          <View className="mx-5 mt-6">
            <Text className="text-lg font-semibold text-foreground mb-4">What's Included</Text>
            
            {[
              { icon: "check-circle", text: "All 287 exam questions" },
              { icon: "lightbulb", text: "Clever mnemonics for every question" },
              { icon: "school", text: "Detailed explanations" },
              { icon: "bar-chart", text: "Progress tracking & analytics" },
              { icon: "schedule", text: "Exam countdown & timeline" },
              { icon: "bookmark", text: "Bookmark & review system" },
              { icon: "offline-bolt", text: "Offline access" },
              { icon: "update", text: "Regular content updates" },
            ].map((feature, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <MaterialIcons name={feature.icon as any} size={24} color={colors.success} />
                <Text className="text-base text-foreground ml-3">{feature.text}</Text>
              </View>
            ))}
          </View>

          {/* CTA Button */}
          <View className="px-5 mt-6">
            <Pressable
              onPress={() => {
                Linking.openURL("https://square.link/u/hJT8Zc0x");
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="rounded-xl p-4 items-center"
            >
              <Text className="text-lg font-semibold" style={{ color: colors.background }}>
                Buy Now - $37
              </Text>
            </Pressable>

            <Text className="text-xs text-muted text-center mt-3">
              One-time purchase. Instant access to all features forever.
            </Text>
          </View>

          {/* Comparison */}
          <View className="mx-5 mt-8 bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Free vs Pro</Text>
            
            <View className="flex-row mb-3">
              <View className="flex-1" />
              <Text className="w-16 text-center text-sm font-medium text-muted">Free</Text>
              <Text className="w-16 text-center text-sm font-medium" style={{ color: colors.primary }}>Pro</Text>
            </View>
            
            {[
              { feature: "Sample Questions", free: "20", pro: "287" },
              { feature: "Mnemonics", free: false, pro: true },
              { feature: "Explanations", free: false, pro: true },
              { feature: "Progress Tracking", free: "Basic", pro: "Full" },
              { feature: "Exam Timeline", free: false, pro: true },
              { feature: "Offline Access", free: false, pro: true },
            ].map((row, index) => (
              <View 
                key={index} 
                className="flex-row items-center py-2"
                style={{ borderTopWidth: 1, borderTopColor: colors.border }}
              >
                <Text className="flex-1 text-sm text-foreground">{row.feature}</Text>
                <View className="w-16 items-center">
                  {typeof row.free === 'boolean' ? (
                    <MaterialIcons 
                      name={row.free ? "check" : "close"} 
                      size={20} 
                      color={row.free ? colors.success : colors.muted} 
                    />
                  ) : (
                    <Text className="text-sm text-muted">{row.free}</Text>
                  )}
                </View>
                <View className="w-16 items-center">
                  {typeof row.pro === 'boolean' ? (
                    <MaterialIcons 
                      name={row.pro ? "check" : "close"} 
                      size={20} 
                      color={row.pro ? colors.success : colors.muted} 
                    />
                  ) : (
                    <Text className="text-sm" style={{ color: colors.primary }}>{row.pro}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">More</Text>
        </View>

        {/* Premium Banner */}
        <Pressable
onPress={() => setShowSubscription(true)}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.9 : 1,
                backgroundColor: colors.primary,
                marginHorizontal: 20,
                marginTop: 16,
                borderRadius: 16,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)' }}
          >
            <MaterialIcons name="star" size={24} color={colorScheme === 'dark' ? colors.foreground : '#FFFFFF'} />
          </View>
          <View className="flex-1 ml-4">
            <Text className="text-lg font-semibold" style={{ color: '#FFFFFF' }}>
              Upgrade to Pro
            </Text>
            <Text className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              One-time purchase • $37
            </Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#FFFFFF" />
        </Pressable>

        {/* Exam Date Selection */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Exam Date</Text>
          
          <Pressable
            onPress={() => setShowExamPicker(!showExamPicker)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <MaterialIcons name="event" size={24} color={colors.primary} />
              <Text className="text-base text-foreground ml-3">
                {examDate 
                  ? EXAM_DATES.find(e => e.date === examDate)?.label || examDate
                  : "Select your exam date"
                }
              </Text>
            </View>
            <MaterialIcons 
              name={showExamPicker ? "expand-less" : "expand-more"} 
              size={24} 
              color={colors.muted} 
            />
          </Pressable>

          {showExamPicker && (
            <View className="mt-2 bg-surface rounded-xl border border-border overflow-hidden">
              {EXAM_DATES.map((exam, index) => (
                <Pressable
                  key={exam.date}
                  onPress={() => handleExamDateSelect(exam.date)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: examDate === exam.date ? colors.primary + '20' : 'transparent',
                      opacity: pressed ? 0.8 : 1,
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderTopColor: colors.border,
                    },
                  ]}
                  className="p-4 flex-row items-center justify-between"
                >
                  <View>
                    <Text className="text-base text-foreground">{exam.label}</Text>
                    <Text className="text-sm text-muted">
                      Apply by: {new Date(exam.applicationDeadline).toLocaleDateString()}
                    </Text>
                  </View>
                  {examDate === exam.date && (
                    <MaterialIcons name="check" size={24} color={colors.primary} />
                  )}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Exam Resources - Quick Study Links */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Exam Resources</Text>

          <Pressable
            onPress={() => router.push("/paper-test" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: '#1a5f2a' + '15',
                borderWidth: 1,
                borderColor: '#1a5f2a',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center flex-1">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#1a5f2a' + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="description" size={22} color="#1a5f2a" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-foreground">Paper Test Mode</Text>
                <Text className="text-sm text-muted">Realistic scantron practice exam</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/exam-info" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center flex-1">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#0D9373' + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="school" size={22} color="#0D9373" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-foreground">NYS Exam Overview</Text>
                <Text className="text-sm text-muted">Exam format, passing scores & what to expect</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/study?category=eastern" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center flex-1">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#F97316' + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="self-improvement" size={22} color="#F97316" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-foreground">Eastern Medicine Tips</Text>
                <Text className="text-sm text-muted">Master meridians & Yin/Yang theory</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/study?category=anatomy" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center flex-1">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#4F46E5' + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="accessibility-new" size={22} color="#4F46E5" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-foreground">Anatomy Essentials</Text>
                <Text className="text-sm text-muted">Key muscles, bones & body systems</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/study?category=ethics" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center flex-1">
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: '#059669' + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons name="gavel" size={22} color="#059669" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-base font-semibold text-foreground">Ethics & Business</Text>
                <Text className="text-sm text-muted">Professional standards & NY regulations</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>
        </View>

        {/* Quick Links */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Resources</Text>

          <Pressable
            onPress={() => router.push("/guarantee" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center">
              <MaterialIcons name="verified" size={24} color={colors.success} />
              <Text className="text-base text-foreground ml-3">Money-Back Guarantee</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL('https://www.op.nysed.gov/professions/massage-therapy')}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <MaterialIcons name="open-in-new" size={24} color={colors.primary} />
              <Text className="text-base text-foreground ml-3">Official NYS Website</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>
        </View>

        {/* Settings */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Settings</Text>

          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Dark Mode Toggle */}
            <View className="p-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialIcons
                  name={colorScheme === "dark" ? "dark-mode" : "light-mode"}
                  size={24}
                  color={colors.muted}
                />
                <Text className="text-base text-foreground ml-3">Dark Mode</Text>
              </View>
              <Switch
                value={colorScheme === "dark"}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View
              className="p-4 flex-row items-center justify-between"
              style={{ borderTopWidth: 1, borderTopColor: colors.border }}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="vibration" size={24} color={colors.muted} />
                <Text className="text-base text-foreground ml-3">Haptic Feedback</Text>
              </View>
              <Switch
                value={settings?.hapticFeedback ?? true}
                onValueChange={(value) => updateSetting('hapticFeedback', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>

            <View
              className="p-4 flex-row items-center justify-between"
              style={{ borderTopWidth: 1, borderTopColor: colors.border }}
            >
              <View className="flex-row items-center">
                <MaterialIcons name="lightbulb" size={24} color={colors.muted} />
                <Text className="text-base text-foreground ml-3">Show Mnemonics</Text>
              </View>
              <Switch
                value={settings?.showMnemonics ?? true}
                onValueChange={(value) => updateSetting('showMnemonics', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Leaderboard Profile */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Leaderboard</Text>

          <Pressable
            onPress={() => setShowProfileSettings(true)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between mb-2"
          >
            <View className="flex-row items-center flex-1">
              <MaterialIcons name="leaderboard" size={24} color={colors.warning} />
              <View className="ml-3 flex-1">
                <Text className="text-base text-foreground">Leaderboard Profile</Text>
                <Text className="text-sm text-muted">
                  {userProfile?.displayName
                    ? `Display name: ${userProfile.displayName}`
                    : 'Set up your display name'}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
          </Pressable>

          {/* Admin Panel - only visible to admin */}
          {userProfile?.email && isAdmin(userProfile.email) && (
            <Pressable
              onPress={() => setShowAdminPanel(true)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.error + '10',
                  borderWidth: 1,
                  borderColor: colors.error,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <MaterialIcons name="admin-panel-settings" size={24} color={colors.error} />
                <Text className="text-base ml-3" style={{ color: colors.error }}>
                  Admin Panel
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.error} />
            </Pressable>
          )}
        </View>

        {/* Danger Zone */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-foreground mb-3">Data</Text>

          <Pressable
            onPress={handleResetProgress}
            style={({ pressed }) => [
              {
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.error,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <MaterialIcons name="delete-outline" size={24} color={colors.error} />
              <Text className="text-base ml-3" style={{ color: colors.error }}>Reset Progress</Text>
            </View>
          </Pressable>
        </View>

        {/* App Info */}
        <View className="mx-5 mt-6 items-center">
          <Text className="text-sm text-muted">NYS Massage Exam Study</Text>
          <Text className="text-xs text-muted mt-1">Version 1.0.0</Text>
          <Text className="text-xs text-muted mt-4">Created by DataAutomation.ai</Text>
          <Text className="text-xs text-muted mt-1">© 2026 All Rights Reserved</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
