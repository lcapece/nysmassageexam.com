import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Dimensions, Platform, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Svg, { Circle, Line, Text as SvgText, G, Defs, LinearGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
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
  hasPurchased,
} from "@/lib/study-store";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [daysUntilExam, setDaysUntilExam] = useState<number>(0);
  const [recommendedDaily, setRecommendedDaily] = useState<number>(20);
  const [isPurchased, setIsPurchased] = useState(true);

  const loadData = useCallback(async () => {
    const [prog, exam, purchased] = await Promise.all([
      getProgress(),
      getSelectedExamDate(),
      hasPurchased(),
    ]);
    setProgress(prog);
    setExamDate(exam);
    setIsPurchased(purchased);

    if (exam) {
      setDaysUntilExam(calculateDaysUntilExam(exam));
      setRecommendedDaily(calculateRecommendedDailyQuestions(exam, prog));
    }
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
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.background }}
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <Container>
            {/* Desktop Header */}
            <View style={{ paddingTop: 32, paddingBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View>
                  <Text style={{ fontSize: 32, fontWeight: '700', color: colors.foreground }}>
                    Study Dashboard
                  </Text>
                  <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>
                    Track your progress and prepare for your NYS Massage Therapy exam
                  </Text>
                </View>
                {examDate && (
                  <CountdownBadge days={daysUntilExam} />
                )}
              </View>
            </View>

            {/* Trial Mode Banner */}
            {!isPurchased && (
              <Pressable
                onPress={() => handlePress("/upgrade")}
                style={({ pressed, hovered }: any) => ({
                  marginBottom: 24,
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: pressed ? 0.95 : 1,
                  transform: [{ scale: pressed ? 0.995 : 1 }],
                })}
              >
                <View
                  style={{
                    backgroundColor: colors.primary,
                    padding: 24,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <Badge variant="warning" size="sm">TRIAL MODE</Badge>
                    </View>
                    <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700' }}>
                      Unlock All 287 Questions
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 }}>
                      One-time payment • Lifetime access • No subscription
                    </Text>
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 36, fontWeight: '800' }}>$37</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>one-time</Text>
                  </View>
                </View>
              </Pressable>
            )}

            {/* Main Stats Row */}
            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 24 }}>
              {/* Progress Ring Card */}
              <Card style={{ flex: 1, padding: 32, alignItems: 'center', justifyContent: 'center' }}>
                <ProgressRing
                  percent={progressPercent}
                  size={180}
                  strokeWidth={14}
                  colors={colors}
                />
                <Text style={{ fontSize: 14, color: colors.muted, marginTop: 16, textAlign: 'center' }}>
                  {masteredQuestions} of {totalQuestions} questions mastered
                </Text>
              </Card>

              {/* Stats Grid */}
              <View style={{ flex: 1, gap: 16 }}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <StatCard
                    label="Mastered"
                    value={masteredQuestions}
                    icon={<MaterialIcons name="check-circle" size={24} color={colors.success} />}
                    color="success"
                    className="flex-1"
                  />
                  <StatCard
                    label="Needs Review"
                    value={needsReview}
                    icon={<MaterialIcons name="refresh" size={24} color={colors.warning} />}
                    color="warning"
                    className="flex-1"
                  />
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <StatCard
                    label="Not Started"
                    value={notStarted}
                    icon={<MaterialIcons name="radio-button-unchecked" size={24} color={colors.muted} />}
                    color="default"
                    className="flex-1"
                  />
                  <StatCard
                    label="Day Streak"
                    value={progress?.streakDays || 0}
                    icon={<MaterialIcons name="local-fire-department" size={24} color={colors.error} />}
                    color="error"
                    className="flex-1"
                  />
                </View>
              </View>
            </View>

            {/* Daily Goal & Timeline Row */}
            <View style={{ flexDirection: 'row', gap: 20, marginBottom: 24 }}>
              {/* Daily Goal Card */}
              <Card style={{ flex: 1, padding: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: colors.primaryMuted,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MaterialIcons name="flag" size={24} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
                        Today's Goal
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.muted }}>
                        {recommendedDaily} questions recommended
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 28, fontWeight: '700', color: colors.foreground }}>
                      {todayAnswered}
                    </Text>
                    <Text style={{ fontSize: 13, color: colors.muted }}>
                      of {recommendedDaily}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={{ height: 12, backgroundColor: colors.border, borderRadius: 6, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${dailyGoalPercent}%`,
                      backgroundColor: dailyGoalPercent >= 100 ? colors.success : colors.primary,
                      borderRadius: 6,
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: colors.muted }}>
                    {dailyGoalPercent}% complete
                  </Text>
                  {dailyGoalPercent >= 100 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MaterialIcons name="emoji-events" size={14} color={colors.success} />
                      <Text style={{ fontSize: 12, color: colors.success, fontWeight: '600' }}>
                        Goal reached!
                      </Text>
                    </View>
                  )}
                </View>
              </Card>

              {/* Exam Timeline Card */}
              {examDate && (
                <Card style={{ flex: 1, padding: 24 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <View style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: colors.warningMuted,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MaterialIcons name="event" size={24} color={colors.warning} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
                        Exam Timeline
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.muted }}>
                        {EXAM_DATES.find(e => e.date === examDate)?.label || examDate}
                      </Text>
                    </View>
                    <Badge
                      variant={daysUntilExam <= 30 ? 'error' : daysUntilExam <= 60 ? 'warning' : 'primary'}
                    >
                      {daysUntilExam} days
                    </Badge>
                  </View>

                  <TimelineGraphic
                    daysUntilExam={daysUntilExam}
                    progressPercent={progressPercent}
                    colors={colors}
                    width={Math.min(400, width - 200)}
                  />
                </Card>
              )}
            </View>

            {/* Action Buttons & Tips Row */}
            <View style={{ flexDirection: 'row', gap: 20 }}>
              {/* Quick Actions */}
              <Card style={{ flex: 2, padding: 24 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 16 }}>
                  Quick Actions
                </Text>
                <View style={{ gap: 12 }}>
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={<MaterialIcons name="play-arrow" size={24} color="#FFFFFF" />}
                    onPress={() => handlePress("/quiz")}
                  >
                    Start Quiz Session
                  </Button>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Button
                      variant="secondary"
                      size="md"
                      fullWidth
                      icon={<MaterialIcons name="menu-book" size={20} color={colors.foreground} />}
                      onPress={() => handlePress("/study")}
                    >
                      Study Mode
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      fullWidth
                      icon={<MaterialIcons name="bookmark" size={20} color={colors.foreground} />}
                      onPress={() => handlePress("/study?filter=bookmarked")}
                    >
                      Bookmarked
                    </Button>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <Button
                      variant="ghost"
                      size="md"
                      fullWidth
                      icon={<MaterialIcons name="info-outline" size={20} color={colors.foreground} />}
                      onPress={() => handlePress("/exam-info")}
                    >
                      Exam Info
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      fullWidth
                      icon={<MaterialIcons name="bar-chart" size={20} color={colors.foreground} />}
                      onPress={() => handlePress("/progress")}
                    >
                      Full Progress
                    </Button>
                  </View>
                </View>
              </Card>

              {/* Study Tip */}
              <Card style={{ flex: 1, padding: 24 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                  <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                  <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
                    Study Tip
                  </Text>
                </View>
                <View style={{
                  padding: 16,
                  backgroundColor: colors.warningMuted,
                  borderRadius: 12,
                  borderLeftWidth: 4,
                  borderLeftColor: colors.warning,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <MaterialIcons name={currentTip.icon} size={18} color={colors.warning} />
                    <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground }}>
                      {currentTip.title}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>
                    {currentTip.tip}
                  </Text>
                </View>

                {/* Mini Category Breakdown */}
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 12 }}>
                    Focus Areas
                  </Text>
                  <View style={{ gap: 8 }}>
                    {[
                      { name: "Anatomy", percent: 35, color: colors.primary },
                      { name: "Eastern Med", percent: 20, color: colors.success },
                      { name: "Ethics", percent: 15, color: colors.warning },
                    ].map((cat, i) => (
                      <View key={i}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 12, color: colors.muted }}>{cat.name}</Text>
                          <Text style={{ fontSize: 12, color: colors.muted }}>{cat.percent}%</Text>
                        </View>
                        <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2 }}>
                          <View style={{ height: '100%', width: `${cat.percent}%`, backgroundColor: cat.color, borderRadius: 2 }} />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </Card>
            </View>
          </Container>
        </ScrollView>
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
          <Text className="text-3xl font-bold text-foreground">NYS Massage Exam</Text>
          <Text className="text-base text-muted mt-1">Study Dashboard</Text>
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
