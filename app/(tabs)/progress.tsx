import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Svg, { Rect, Text as SvgText, Line, Circle, G, Path } from "react-native-svg";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  getProgress,
  getSelectedExamDate,
  getStudyStartDate,
  calculateDaysUntilExam,
  getCategoryStats,
  StudyProgress,
  CATEGORIES,
  EXAM_DATES,
  questions,
} from "@/lib/study-store";
import { VERSION } from "@/shared/const";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProgressScreen() {
  const colors = useColors();
  
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [examDate, setExamDate] = useState<string | null>(null);
  const [studyStartDate, setStudyStartDate] = useState<string | null>(null);
  const [categoryStats, setCategoryStats] = useState<Record<string, { total: number; correct: number; attempted: number }>>({});

  const loadData = useCallback(async () => {
    const [prog, exam, startDate] = await Promise.all([
      getProgress(),
      getSelectedExamDate(),
      getStudyStartDate(),
    ]);
    setProgress(prog);
    setExamDate(exam);
    setStudyStartDate(startDate);
    
    if (prog) {
      setCategoryStats(getCategoryStats(prog));
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const totalQuestions = questions.length;
  const masteredQuestions = progress?.totalCorrect || 0;
  const attemptedQuestions = progress?.totalAttempted || 0;
  const progressPercent = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0;
  const daysUntilExam = examDate ? calculateDaysUntilExam(examDate) : 0;

  // Calculate study days
  const studyDays = studyStartDate 
    ? Math.ceil((Date.now() - new Date(studyStartDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-5 pt-4 pb-2">
          <Text className="text-3xl font-bold text-foreground">Progress</Text>
          <Text className="text-base text-muted mt-1">Track your exam preparation</Text>
        </View>

        {/* Overall Progress Card */}
        <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">Overall Progress</Text>
          
          <View className="flex-row items-center justify-between">
            <View className="items-center">
              <Text className="text-4xl font-bold" style={{ color: colors.primary }}>
                {progressPercent}%
              </Text>
              <Text className="text-sm text-muted">Mastered</Text>
            </View>
            <View className="items-center">
              <Text className="text-4xl font-bold text-foreground">
                {masteredQuestions}
              </Text>
              <Text className="text-sm text-muted">of {totalQuestions}</Text>
            </View>
            <View className="items-center">
              <Text className="text-4xl font-bold" style={{ color: colors.warning }}>
                {attemptedQuestions - masteredQuestions}
              </Text>
              <Text className="text-sm text-muted">Need Review</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View className="mt-4 h-3 bg-border rounded-full overflow-hidden">
            <View 
              className="h-full rounded-full"
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: colors.primary 
              }}
            />
          </View>
        </View>

        {/* Exam Timeline */}
        {examDate && (
          <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Exam Timeline</Text>
            
            <ExamTimelineChart
              daysUntilExam={daysUntilExam}
              studyDays={studyDays}
              progressPercent={progressPercent}
              colors={colors}
            />

            <View className="flex-row justify-between mt-4">
              <View>
                <Text className="text-sm text-muted">Days Studied</Text>
                <Text className="text-xl font-bold text-foreground">{studyDays}</Text>
              </View>
              <View className="items-center">
                <Text className="text-sm text-muted">Days Left</Text>
                <Text className="text-xl font-bold" style={{ color: daysUntilExam < 30 ? colors.error : colors.primary }}>
                  {daysUntilExam}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-sm text-muted">Exam Date</Text>
                <Text className="text-base font-medium text-foreground">
                  {EXAM_DATES.find(e => e.date === examDate)?.label.split(',')[0] || ''}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Category Breakdown */}
        <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">Category Breakdown</Text>
          
          <CategoryBarChart 
            stats={categoryStats} 
            colors={colors}
          />
        </View>

        {/* Weak Areas */}
        <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
          <View className="flex-row items-center mb-4">
            <MaterialIcons name="warning" size={20} color={colors.warning} />
            <Text className="text-lg font-semibold text-foreground ml-2">Focus Areas</Text>
          </View>
          
          {CATEGORIES
            .map(cat => ({
              name: cat,
              ...categoryStats[cat],
              percent: categoryStats[cat]?.total > 0 
                ? Math.round((categoryStats[cat]?.correct || 0) / categoryStats[cat].total * 100)
                : 0
            }))
            .filter(cat => cat.percent < 70)
            .sort((a, b) => a.percent - b.percent)
            .slice(0, 3)
            .map((cat, index) => (
              <View 
                key={cat.name}
                className="flex-row items-center justify-between py-3"
                style={{ borderTopWidth: index > 0 ? 1 : 0, borderTopColor: colors.border }}
              >
                <View className="flex-row items-center flex-1">
                  <MaterialIcons 
                    name={getCategoryIcon(cat.name)} 
                    size={20} 
                    color={colors.error} 
                  />
                  <Text className="text-base text-foreground ml-2">{cat.name}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base font-medium" style={{ color: colors.error }}>
                    {cat.percent}%
                  </Text>
                  <Text className="text-sm text-muted ml-2">
                    ({cat.correct}/{cat.total})
                  </Text>
                </View>
              </View>
            ))
          }
          
          {CATEGORIES.every(cat => 
            (categoryStats[cat]?.correct || 0) / (categoryStats[cat]?.total || 1) >= 0.7
          ) && (
            <View className="items-center py-4">
              <MaterialIcons name="check-circle" size={40} color={colors.success} />
              <Text className="text-base text-foreground mt-2">Great job! All categories above 70%</Text>
            </View>
          )}
        </View>

        {/* Study Stats */}
        <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
          <Text className="text-lg font-semibold text-foreground mb-4">Study Stats</Text>
          
          <View className="flex-row flex-wrap">
            <View className="w-1/2 mb-4">
              <Text className="text-sm text-muted">Current Streak</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="local-fire-department" size={24} color={colors.error} />
                <Text className="text-2xl font-bold text-foreground ml-1">
                  {progress?.streakDays || 0}
                </Text>
                <Text className="text-sm text-muted ml-1">days</Text>
              </View>
            </View>
            <View className="w-1/2 mb-4">
              <Text className="text-sm text-muted">Total Attempts</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="replay" size={24} color={colors.primary} />
                <Text className="text-2xl font-bold text-foreground ml-1">
                  {Object.values(progress?.questionsProgress || {}).reduce((sum, q) => sum + q.attempts, 0)}
                </Text>
              </View>
            </View>
            <View className="w-1/2">
              <Text className="text-sm text-muted">Quiz Sessions</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="quiz" size={24} color={colors.primary} />
                <Text className="text-2xl font-bold text-foreground ml-1">
                  {progress?.quizHistory.length || 0}
                </Text>
              </View>
            </View>
            <View className="w-1/2">
              <Text className="text-sm text-muted">Avg. Score</Text>
              <View className="flex-row items-center mt-1">
                <MaterialIcons name="trending-up" size={24} color={colors.success} />
                <Text className="text-2xl font-bold text-foreground ml-1">
                  {progress?.quizHistory.length 
                    ? Math.round(
                        progress.quizHistory.reduce((sum, s) => sum + (s.correctAnswers / s.totalQuestions) * 100, 0) 
                        / progress.quizHistory.length
                      )
                    : 0}%
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Quiz History */}
        {progress?.quizHistory && progress.quizHistory.length > 0 && (
          <View className="mx-5 mt-4 bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Recent Quizzes</Text>
            
            {progress.quizHistory.slice(0, 5).map((session, index) => {
              const percent = Math.round((session.correctAnswers / session.totalQuestions) * 100);
              const date = new Date(session.date);
              
              return (
                <View 
                  key={session.id}
                  className="flex-row items-center justify-between py-3"
                  style={{ borderTopWidth: index > 0 ? 1 : 0, borderTopColor: colors.border }}
                >
                  <View>
                    <Text className="text-base text-foreground">
                      {session.category || 'All Categories'}
                    </Text>
                    <Text className="text-sm text-muted">
                      {date.toLocaleDateString()} • {session.totalQuestions} questions
                    </Text>
                  </View>
                  <View 
                    className="px-3 py-1 rounded-full"
                    style={{ 
                      backgroundColor: percent >= 70 ? colors.success + '20' : colors.error + '20' 
                    }}
                  >
                    <Text 
                      className="text-sm font-medium"
                      style={{ color: percent >= 70 ? colors.success : colors.error }}
                    >
                      {percent}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Version Footer */}
        <Text style={{ color: colors.border, fontSize: 9, textAlign: 'center', marginTop: 24, marginBottom: 8 }}>{VERSION}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

// Exam Timeline Chart Component
function ExamTimelineChart({
  daysUntilExam,
  studyDays,
  progressPercent,
  colors,
}: {
  daysUntilExam: number;
  studyDays: number;
  progressPercent: number;
  colors: any;
}) {
  const width = SCREEN_WIDTH - 70;
  const height = 120;
  const padding = { left: 40, right: 20, top: 20, bottom: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate total study period
  const totalDays = studyDays + daysUntilExam;
  const currentPosition = (studyDays / totalDays) * chartWidth;

  // Milestone targets (ideal progress curve)
  const milestones = [
    { day: 0, target: 0 },
    { day: totalDays * 0.25, target: 25 },
    { day: totalDays * 0.5, target: 50 },
    { day: totalDays * 0.75, target: 75 },
    { day: totalDays, target: 100 },
  ];

  // Generate ideal curve path
  const idealPath = milestones.map((m, i) => {
    const x = padding.left + (m.day / totalDays) * chartWidth;
    const y = padding.top + chartHeight - (m.target / 100) * chartHeight;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Current progress point
  const currentX = padding.left + currentPosition;
  const currentY = padding.top + chartHeight - (progressPercent / 100) * chartHeight;

  // Expected progress at this point
  const expectedPercent = (studyDays / totalDays) * 100;
  const isOnTrack = progressPercent >= expectedPercent * 0.8;

  return (
    <Svg width={width} height={height}>
      {/* Grid lines */}
      {[0, 25, 50, 75, 100].map((percent) => {
        const y = padding.top + chartHeight - (percent / 100) * chartHeight;
        return (
          <G key={percent}>
            <Line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4,4"
            />
            <SvgText
              x={padding.left - 5}
              y={y + 4}
              fontSize={10}
              fill={colors.muted}
              textAnchor="end"
            >
              {percent}%
            </SvgText>
          </G>
        );
      })}

      {/* Ideal progress curve */}
      <Path
        d={idealPath}
        stroke={colors.border}
        strokeWidth={2}
        fill="none"
        strokeDasharray="6,4"
      />

      {/* Actual progress line */}
      <Line
        x1={padding.left}
        y1={padding.top + chartHeight}
        x2={currentX}
        y2={currentY}
        stroke={isOnTrack ? colors.success : colors.warning}
        strokeWidth={3}
      />

      {/* Current position marker */}
      <Circle
        cx={currentX}
        cy={currentY}
        r={8}
        fill={isOnTrack ? colors.success : colors.warning}
      />
      <Circle
        cx={currentX}
        cy={currentY}
        r={4}
        fill={colors.background}
      />

      {/* Labels */}
      <SvgText
        x={padding.left}
        y={height - 5}
        fontSize={10}
        fill={colors.muted}
      >
        Start
      </SvgText>
      <SvgText
        x={width - padding.right}
        y={height - 5}
        fontSize={10}
        fill={colors.muted}
        textAnchor="end"
      >
        Exam
      </SvgText>
      <SvgText
        x={currentX}
        y={height - 5}
        fontSize={10}
        fill={colors.foreground}
        textAnchor="middle"
        fontWeight="bold"
      >
        Today
      </SvgText>
    </Svg>
  );
}

// Category Bar Chart Component
function CategoryBarChart({
  stats,
  colors,
}: {
  stats: Record<string, { total: number; correct: number; attempted: number }>;
  colors: any;
}) {
  const barHeight = 24;
  const gap = 8;

  return (
    <View>
      {CATEGORIES.map((category, index) => {
        const stat = stats[category] || { total: 0, correct: 0, attempted: 0 };
        const percent = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
        
        return (
          <View key={category} style={{ marginBottom: index < CATEGORIES.length - 1 ? gap : 0 }}>
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm text-foreground" numberOfLines={1} style={{ flex: 1 }}>
                {category}
              </Text>
              <Text className="text-sm text-muted ml-2">
                {stat.correct}/{stat.total}
              </Text>
            </View>
            <View 
              style={{ height: barHeight }} 
              className="bg-border rounded-full overflow-hidden"
            >
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${percent}%`,
                  backgroundColor: percent >= 70 ? colors.success : percent >= 40 ? colors.warning : colors.error,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function getCategoryIcon(category: string): any {
  const icons: Record<string, any> = {
    "Massage Techniques": "spa",
    "Anatomy": "accessibility-new",
    "Physiology": "favorite",
    "Pathology": "healing",
    "Eastern Medicine": "self-improvement",
    "Ethics & Law": "gavel",
    "Kinesiology": "directions-run",
    "Hydrotherapy": "water-drop",
  };
  return icons[category] || "help";
}
