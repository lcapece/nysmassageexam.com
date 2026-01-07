import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Dimensions, Platform, useWindowDimensions, Image } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Svg, { Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { Container, useIsDesktop } from "@/components/desktop/container";
import { Card, StatCard } from "@/components/desktop/card";
import { Button } from "@/components/desktop/button";
import { Badge, CountdownBadge } from "@/components/desktop/badge";
import { AppShell } from "@/components/desktop/nav";
import {
  getProgress,
  getSelectedExamDate,
  calculateDaysUntilExam,
  calculateRecommendedDailyQuestions,
  StudyProgress,
  EXAM_DATES,
  questions,
} from "@/lib/study-store";
import { Leaderboard } from "@/components/leaderboard";
import { getUserProfile, isAdmin } from "@/lib/leaderboard-service";
import { useAuthContext } from "@/lib/auth-context";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [daysUntilExam, setDaysUntilExam] = useState<number>(0);
  const [recommendedDaily, setRecommendedDaily] = useState<number>(20);
  const [isBannerExpanded, setIsBannerExpanded] = useState(false); // Collapsed by default
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  // Use auth context for authoritative purchase status
  const { hasPurchased: isPurchased, purchaseLoading } = useAuthContext();

  const toggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Default to March 6, 2026 exam if no exam date is set
  const DEFAULT_EXAM_DATE = '2026-03-06';

  const loadData = useCallback(async () => {
    const [prog, exam, profile] = await Promise.all([
      getProgress(),
      getSelectedExamDate(),
      getUserProfile(),
    ]);
    setProgress(prog);
    // Use default exam date if none is set
    const effectiveExamDate = exam || DEFAULT_EXAM_DATE;
    setExamDate(effectiveExamDate);
    setUserEmail(profile?.email);

    setDaysUntilExam(calculateDaysUntilExam(effectiveExamDate));
    setRecommendedDaily(calculateRecommendedDailyQuestions(effectiveExamDate, prog));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handlePress = (route: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push(route as any);
  };

  const totalQuestions = questions.length;
  const masteredQuestions = progress?.totalCorrect || 0;
  const attemptedQuestions = progress?.totalAttempted || 0;
  const needsReview = attemptedQuestions - masteredQuestions;
  const notStarted = totalQuestions - attemptedQuestions;
  const progressPercent = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0;

  // Calculate today's progress
  const today = new Date().toDateString();
  const todayAnswered = progress ? Object.values(progress.questionsProgress).filter(
    q => q.lastAttemptDate && new Date(q.lastAttemptDate).toDateString() === today
  ).length : 0;
  const dailyGoalPercent = Math.min(100, Math.round((todayAnswered / recommendedDaily) * 100));

  // Study tips
  const studyTips = [
    {
      icon: "psychology" as const,
      title: "Eastern Medicine Focus",
      tip: "The NYS exam includes 20 questions on meridians and Yin/Yang theory - unique to New York!"
    },
    {
      icon: "timer" as const,
      title: "Spaced Repetition",
      tip: "Review missed questions after 1 day, 3 days, and 7 days for maximum retention."
    },
    {
      icon: "trending-up" as const,
      title: "Consistent Practice",
      tip: "20-30 questions daily is more effective than cramming before the exam."
    }
  ];
  const [currentTip] = useState(() => studyTips[Math.floor(Math.random() * studyTips.length)]);

  if (isDesktop) {
    return (
      <AppShell>
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 24 }}>
          {/* Compact Header Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                Study Dashboard
              </Text>
              {/* Theme Toggle */}
              <Pressable
                onPress={toggleTheme}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons
                  name={colorScheme === 'dark' ? 'light-mode' : 'dark-mode'}
                  size={20}
                  color={colors.foreground}
                />
              </Pressable>
            </View>
            {examDate && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                backgroundColor: daysUntilExam <= 30 ? colors.errorMuted : daysUntilExam <= 60 ? colors.warningMuted : colors.primaryMuted,
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}>
                <MaterialIcons name="event" size={18} color={daysUntilExam <= 30 ? colors.error : daysUntilExam <= 60 ? colors.warning : colors.primary} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: daysUntilExam <= 30 ? colors.error : daysUntilExam <= 60 ? colors.warning : colors.primary }}>
                  {daysUntilExam} days
                </Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>until exam</Text>
              </View>
            )}
          </View>

          {/* Trial Mode Banner - Compact */}
          {!isPurchased && (
            <Pressable
              onPress={() => handlePress("/upgrade")}
              style={{ marginBottom: 16, borderRadius: 12, overflow: 'hidden' }}
            >
              <View style={{ backgroundColor: colors.primary, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Badge variant="warning" size="sm">TRIAL</Badge>
                  <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '600' }}>Unlock All 287 Questions</Text>
                </View>
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800' }}>$37</Text>
              </View>
            </Pressable>
          )}

          {/* Main Content - Single Row */}
          <View style={{ flexDirection: 'row', gap: 16, flex: 1 }}>
            {/* Left Column - Progress & Stats */}
            <View style={{ width: 280, gap: 12 }}>
              {/* Progress Ring - Compact */}
              <Card style={{ padding: 16, alignItems: 'center' }}>
                <ProgressRing percent={progressPercent} size={120} strokeWidth={10} colors={colors} />
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                  {masteredQuestions}/{totalQuestions} mastered
                </Text>
              </Card>

              {/* Stats - Compact Grid */}
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Card style={{ flex: 1, padding: 12, alignItems: 'center' }}>
                  <MaterialIcons name="check-circle" size={20} color={colors.success} />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground, marginTop: 4 }}>{masteredQuestions}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>Mastered</Text>
                </Card>
                <Card style={{ flex: 1, padding: 12, alignItems: 'center' }}>
                  <MaterialIcons name="refresh" size={20} color={colors.warning} />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground, marginTop: 4 }}>{needsReview}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>Review</Text>
                </Card>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Card style={{ flex: 1, padding: 12, alignItems: 'center' }}>
                  <MaterialIcons name="radio-button-unchecked" size={20} color={colors.muted} />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground, marginTop: 4 }}>{notStarted}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>Not Started</Text>
                </Card>
                <Card style={{ flex: 1, padding: 12, alignItems: 'center' }}>
                  <MaterialIcons name="local-fire-department" size={20} color={colors.error} />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground, marginTop: 4 }}>{progress?.streakDays || 0}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>Streak</Text>
                </Card>
              </View>

              {/* Daily Goal - Compact */}
              <Card style={{ padding: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <MaterialIcons name="flag" size={16} color={colors.primary} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.foreground }}>Today</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.foreground }}>{todayAnswered}/{recommendedDaily}</Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${dailyGoalPercent}%`, backgroundColor: dailyGoalPercent >= 100 ? colors.success : colors.primary, borderRadius: 3 }} />
                </View>
              </Card>
            </View>

            {/* Middle Column - Quick Actions */}
            <Card style={{ flex: 1, padding: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>Quick Actions</Text>
              <View style={{ gap: 10 }}>
                <Button variant="primary" size="md" fullWidth icon={<MaterialIcons name="play-arrow" size={20} color="#FFFFFF" />} onPress={() => handlePress("/quiz")}>
                  Start Quiz
                </Button>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button variant="secondary" size="sm" fullWidth icon={<MaterialIcons name="menu-book" size={18} color={colors.foreground} />} onPress={() => handlePress("/study")}>
                    Study
                  </Button>
                  <Button variant="secondary" size="sm" fullWidth icon={<MaterialIcons name="bookmark" size={18} color={colors.foreground} />} onPress={() => handlePress("/study?filter=bookmarked")}>
                    Bookmarked
                  </Button>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button variant="ghost" size="sm" fullWidth icon={<MaterialIcons name="info-outline" size={18} color={colors.foreground} />} onPress={() => handlePress("/exam-info")}>
                    Exam Info
                  </Button>
                  <Button variant="ghost" size="sm" fullWidth icon={<MaterialIcons name="bar-chart" size={18} color={colors.foreground} />} onPress={() => handlePress("/progress")}>
                    Progress
                  </Button>
                </View>
              </View>

              {/* Timeline - Compact */}
              {examDate && (
                <View style={{ marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name="timeline" size={16} color={colors.warning} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: colors.foreground }}>Exam Timeline</Text>
                    <Text style={{ fontSize: 11, color: colors.muted, marginLeft: 'auto' }}>{EXAM_DATES.find(e => e.date === examDate)?.label}</Text>
                  </View>
                  <TimelineGraphic daysUntilExam={daysUntilExam} progressPercent={progressPercent} colors={colors} width={300} />
                </View>
              )}
            </Card>

            {/* Right Column - Leaderboard */}
            <View style={{ width: 320 }}>
              <Leaderboard currentUserEmail={userEmail} compact />
            </View>
          </View>
        </View>
      </AppShell>
    );
  }

  // Mobile Layout
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-2">
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Image
                source={require('../../assets/images/logo.png')}
                style={{ width: 180, height: 45 }}
                resizeMode="contain"
              />
              <Text className="text-base text-muted mt-1">Study Dashboard</Text>
            </View>
            {/* Theme Toggle */}
            <Pressable
              onPress={toggleTheme}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialIcons
                name={colorScheme === 'dark' ? 'light-mode' : 'dark-mode'}
                size={22}
                color={colors.foreground}
              />
            </Pressable>
          </View>
        </View>

        {/* Trial Mode Banner */}
        {!isPurchased && (
          <Pressable
            onPress={() => handlePress("/upgrade")}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            className="mx-5 mt-4 bg-primary rounded-xl p-4"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white font-bold text-lg">Unlock Full Access</Text>
                <Text className="text-white/80 text-sm">Get all 287 questions for only $37</Text>
              </View>
              <View className="bg-white/20 rounded-full px-3 py-1">
                <Text className="text-white font-semibold">$37</Text>
              </View>
            </View>
          </Pressable>
        )}

        {/* Exam Countdown Card */}
        {examDate && (
          <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-muted uppercase tracking-wide">Exam Date</Text>
                <Text className="text-lg font-semibold text-foreground mt-1">
                  {EXAM_DATES.find(e => e.date === examDate)?.label || examDate}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl font-bold" style={{ color: colors.primary }}>
                  {daysUntilExam}
                </Text>
                <Text className="text-sm text-muted">days left</Text>
              </View>
            </View>

            {/* Mini Timeline */}
            <View className="mt-4">
              <TimelineGraphic
                daysUntilExam={daysUntilExam}
                progressPercent={progressPercent}
                colors={colors}
                width={width - 70}
              />
            </View>
          </View>
        )}

        {/* Progress Ring */}
        <View className="items-center mt-6">
          <ProgressRing
            percent={progressPercent}
            size={160}
            strokeWidth={12}
            colors={colors}
          />
          <Text className="text-base text-muted mt-3">
            {masteredQuestions} of {totalQuestions} questions mastered
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="flex-row px-5 mt-6 gap-3">
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <MaterialIcons name="check-circle" size={24} color={colors.success} />
            <Text className="text-2xl font-bold text-foreground mt-2">{masteredQuestions}</Text>
            <Text className="text-sm text-muted">Mastered</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <MaterialIcons name="pending" size={24} color={colors.warning} />
            <Text className="text-2xl font-bold text-foreground mt-2">{needsReview}</Text>
            <Text className="text-sm text-muted">Needs Review</Text>
          </View>
          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <MaterialIcons name="local-fire-department" size={24} color={colors.error} />
            <Text className="text-2xl font-bold text-foreground mt-2">{progress?.streakDays || 0}</Text>
            <Text className="text-sm text-muted">Day Streak</Text>
          </View>
        </View>

        {/* Daily Goal */}
        <View className="mx-5 mt-4 bg-surface rounded-xl p-4 border border-border">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <MaterialIcons name="flag" size={20} color={colors.primary} />
              <Text className="text-base font-medium text-foreground ml-2">Today's Goal</Text>
            </View>
            <Text className="text-base text-muted">
              {todayAnswered} / {recommendedDaily}
            </Text>
          </View>
          <View className="mt-3 h-2 bg-border rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${dailyGoalPercent}%`,
                backgroundColor: dailyGoalPercent >= 100 ? colors.success : colors.primary
              }}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-5 mt-6 gap-3">
          <Pressable
            onPress={() => handlePress("/quiz")}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-center"
          >
            <MaterialIcons name="play-arrow" size={24} color={colors.background} />
            <Text className="text-lg font-semibold ml-2" style={{ color: colors.background }}>
              Start Quiz
            </Text>
          </Pressable>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => handlePress("/study")}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="rounded-xl p-4 flex-row items-center justify-center"
            >
              <MaterialIcons name="menu-book" size={20} color={colors.foreground} />
              <Text className="text-base font-medium text-foreground ml-2">Study</Text>
            </Pressable>

            <Pressable
              onPress={() => handlePress("/exam-info")}
              style={({ pressed }) => [
                {
                  flex: 1,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="rounded-xl p-4 flex-row items-center justify-center"
            >
              <MaterialIcons name="info" size={20} color={colors.foreground} />
              <Text className="text-base font-medium text-foreground ml-2">Exam Info</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Tips */}
        <View className="mx-5 mt-6 bg-surface rounded-xl p-4 border border-border">
          <View className="flex-row items-center mb-3">
            <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
            <Text className="text-base font-medium text-foreground ml-2">Study Tip</Text>
          </View>
          <Text className="text-sm text-muted leading-5">
            {currentTip.tip}
          </Text>
        </View>

        {/* Leaderboard */}
        <View className="mx-5 mt-6">
          <Leaderboard currentUserEmail={userEmail} />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

// Progress Ring Component
function ProgressRing({
  percent,
  size,
  strokeWidth,
  colors
}: {
  percent: number;
  size: number;
  strokeWidth: number;
  colors: any;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.primary} />
            <Stop offset="100%" stopColor={colors.primaryHover || colors.primary} />
          </LinearGradient>
        </Defs>
        {/* Background circle */}
        <Circle
          stroke={colors.border}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          stroke="url(#progressGradient)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: size * 0.22, fontWeight: 'bold', color: colors.foreground }}>
          {percent}%
        </Text>
        <Text style={{ fontSize: size * 0.085, color: colors.muted, marginTop: 2 }}>Complete</Text>
      </View>
    </View>
  );
}

// Timeline Graphic Component
function TimelineGraphic({
  daysUntilExam,
  progressPercent,
  colors,
  width: propWidth
}: {
  daysUntilExam: number;
  progressPercent: number;
  colors: any;
  width?: number;
}) {
  const width = propWidth || 300;
  const height = 60;

  // Calculate position on timeline (assume 120 day study period)
  const totalDays = 120;
  const daysStudied = Math.max(0, totalDays - daysUntilExam);
  const timelineProgress = Math.min(100, (daysStudied / totalDays) * 100);

  // Milestone zones
  const milestones = [
    { day: 30, target: 25, label: "25%" },
    { day: 60, target: 50, label: "50%" },
    { day: 90, target: 75, label: "75%" },
    { day: 120, target: 100, label: "100%" },
  ];

  // Determine status color
  const getStatusColor = () => {
    const expectedProgress = (daysStudied / totalDays) * 100;
    if (progressPercent >= expectedProgress) return colors.success;
    if (progressPercent >= expectedProgress * 0.7) return colors.warning;
    return colors.error;
  };

  return (
    <Svg width={width} height={height}>
      {/* Background line */}
      <Line
        x1={10}
        y1={30}
        x2={width - 10}
        y2={30}
        stroke={colors.border}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Progress line */}
      <Line
        x1={10}
        y1={30}
        x2={10 + ((width - 20) * timelineProgress) / 100}
        y2={30}
        stroke={getStatusColor()}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Milestone markers */}
      {milestones.map((m, i) => {
        const x = 10 + ((width - 20) * (m.day / totalDays));
        return (
          <G key={i}>
            <Circle
              cx={x}
              cy={30}
              r={6}
              fill={daysStudied >= m.day ? colors.primary : colors.border}
            />
            <SvgText
              x={x}
              y={50}
              fontSize={10}
              fill={colors.muted}
              textAnchor="middle"
            >
              {m.label}
            </SvgText>
          </G>
        );
      })}

      {/* Current position marker */}
      <G>
        <Circle
          cx={10 + ((width - 20) * timelineProgress) / 100}
          cy={30}
          r={8}
          fill={getStatusColor()}
        />
        <SvgText
          x={10 + ((width - 20) * timelineProgress) / 100}
          y={15}
          fontSize={10}
          fill={colors.foreground}
          textAnchor="middle"
          fontWeight="bold"
        >
          You
        </SvgText>
      </G>
    </Svg>
  );
}
