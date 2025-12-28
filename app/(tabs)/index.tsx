import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Svg, { Circle, Line, Text as SvgText, G, Rect, Path } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
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
  const progressPercent = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0;

  // Calculate today's progress
  const today = new Date().toDateString();
  const todayAnswered = progress ? Object.values(progress.questionsProgress).filter(
    q => q.lastAttemptDate && new Date(q.lastAttemptDate).toDateString() === today
  ).length : 0;

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
            <Text className="text-2xl font-bold text-foreground mt-2">{attemptedQuestions - masteredQuestions}</Text>
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
                width: `${Math.min(100, (todayAnswered / recommendedDaily) * 100)}%`,
                backgroundColor: colors.primary 
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
            The NYS exam includes 20 questions on Eastern Medicine concepts like meridians and Yin/Yang theory. 
            Don't neglect this section - it's unique to New York!
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
          stroke={colors.primary}
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
        <Text style={{ fontSize: 36, fontWeight: 'bold', color: colors.foreground }}>
          {percent}%
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted }}>Complete</Text>
      </View>
    </View>
  );
}

// Timeline Graphic Component
function TimelineGraphic({ 
  daysUntilExam, 
  progressPercent,
  colors 
}: { 
  daysUntilExam: number; 
  progressPercent: number;
  colors: any;
}) {
  const width = SCREEN_WIDTH - 70;
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
