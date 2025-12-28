import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  questions,
  Question,
  recordAnswer,
  saveQuizSession,
  getProgress,
  getBookmarks,
  toggleBookmark,
  CATEGORIES,
  hasPurchased,
  isTrialQuestion,
  TRIAL_QUESTION_IDS,
} from "@/lib/study-store";

type QuizState = "setup" | "question" | "feedback" | "complete";

export default function QuizScreen() {
  const router = useRouter();
  const colors = useColors();
  
  const [quizState, setQuizState] = useState<QuizState>("setup");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [isPurchased, setIsPurchased] = useState(true); // Default to true, will check on mount

  useEffect(() => {
    loadBookmarks();
    checkPurchaseStatus();
  }, []);

  const checkPurchaseStatus = async () => {
    const purchased = await hasPurchased();
    setIsPurchased(purchased);
  };

  const loadBookmarks = async () => {
    const bm = await getBookmarks();
    setBookmarks(bm);
  };

  const startQuiz = async (category: string | null, count: number = 10) => {
    const purchased = await hasPurchased();
    setIsPurchased(purchased);
    
    let availableQuestions: Question[];
    
    if (purchased) {
      // Full access - use all questions
      availableQuestions = category 
        ? questions.filter(q => q.category === category)
        : [...questions];
    } else {
      // Trial mode - only use trial questions
      if (category) {
        const trialIds = TRIAL_QUESTION_IDS[category] || [];
        availableQuestions = questions.filter(q => trialIds.includes(q.id));
      } else {
        // All trial questions across categories
        availableQuestions = questions.filter(q => isTrialQuestion(q.id));
      }
    }
    
    // Shuffle and take requested count
    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    const maxCount = purchased ? count : Math.min(count, availableQuestions.length);
    const selected = shuffled.slice(0, Math.min(maxCount, shuffled.length));
    
    setQuizQuestions(selected);
    setSelectedCategory(category);
    setCurrentIndex(0);
    setScore(0);
    setStartTime(Date.now());
    setQuizState("question");
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowMnemonic(false);
  };

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer) return; // Already answered
    
    const question = quizQuestions[currentIndex];
    const correct = answer === question.correct_option;
    
    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setQuizState("feedback");
    
    if (correct) {
      setScore(s => s + 1);
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
    
    // Record progress
    await recordAnswer(question.id, correct);
  };

  const nextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuizState("question");
      setShowMnemonic(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    await saveQuizSession({
      date: new Date().toISOString(),
      category: selectedCategory,
      totalQuestions: quizQuestions.length,
      correctAnswers: score,
      duration,
    });
    setQuizState("complete");
  };

  const handleBookmark = async () => {
    const question = quizQuestions[currentIndex];
    const newBookmarks = await toggleBookmark(question.id);
    setBookmarks(newBookmarks);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const resetQuiz = () => {
    setQuizState("setup");
    setQuizQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  // Setup Screen
  if (quizState === "setup") {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-4 pb-2">
            <Text className="text-3xl font-bold text-foreground">Quiz Mode</Text>
            <Text className="text-base text-muted mt-1">Test your knowledge</Text>
          </View>

          {/* Trial Mode Banner */}
          {!isPurchased && (
            <Pressable
              onPress={() => router.push("/upgrade")}
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
              className="mx-5 mt-4 bg-warning/10 border border-warning/30 rounded-xl p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-foreground font-semibold">Free Trial Mode</Text>
                  <Text className="text-muted text-sm">3 questions per category • Tap to unlock all 287</Text>
                </View>
                <MaterialIcons name="lock-open" size={24} color={colors.warning} />
              </View>
            </Pressable>
          )}

          {/* Quick Start */}
          <View className="px-5 mt-4">
            <Pressable
              onPress={() => startQuiz(null, 10)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              className="rounded-xl p-5 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-lg font-semibold" style={{ color: colors.background }}>
                  Quick Quiz
                </Text>
                <Text className="text-sm opacity-80" style={{ color: colors.background }}>
                  10 random questions
                </Text>
              </View>
              <MaterialIcons name="play-arrow" size={32} color={colors.background} />
            </Pressable>
          </View>

          {/* Full Exam Practice */}
          <View className="px-5 mt-3">
            <Pressable
              onPress={() => startQuiz(null, 140)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="rounded-xl p-5 flex-row items-center justify-between"
            >
              <View>
                <Text className="text-lg font-semibold text-foreground">
                  Full Exam Practice
                </Text>
                <Text className="text-sm text-muted">
                  140 questions (like the real exam)
                </Text>
              </View>
              <MaterialIcons name="assignment" size={28} color={colors.primary} />
            </Pressable>
          </View>

          {/* By Category */}
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-foreground mb-3">By Category</Text>
            {CATEGORIES.map((category) => {
              const count = questions.filter(q => q.category === category).length;
              return (
                <Pressable
                  key={category}
                  onPress={() => startQuiz(category, 10)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="rounded-xl p-4 mb-2 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <MaterialIcons 
                      name={getCategoryIcon(category)} 
                      size={24} 
                      color={colors.primary} 
                    />
                    <Text className="text-base text-foreground ml-3">{category}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-sm text-muted mr-2">{count} Q</Text>
                    <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Complete Screen
  if (quizState === "complete") {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const isPassing = percentage >= 70;
    
    return (
      <ScreenContainer>
        <View className="flex-1 items-center justify-center px-5">
          <MaterialIcons 
            name={isPassing ? "celebration" : "sentiment-dissatisfied"} 
            size={80} 
            color={isPassing ? colors.success : colors.warning} 
          />
          <Text className="text-3xl font-bold text-foreground mt-4">
            {isPassing ? "Great Job!" : "Keep Practicing!"}
          </Text>
          <Text className="text-5xl font-bold mt-4" style={{ color: isPassing ? colors.success : colors.warning }}>
            {percentage}%
          </Text>
          <Text className="text-lg text-muted mt-2">
            {score} out of {quizQuestions.length} correct
          </Text>
          
          <View className="w-full mt-8 gap-3">
            <Pressable
              onPress={resetQuiz}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="rounded-xl p-4 items-center"
            >
              <Text className="text-lg font-semibold" style={{ color: colors.background }}>
                New Quiz
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push("/progress")}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="rounded-xl p-4 items-center"
            >
              <Text className="text-base text-foreground">View Progress</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  // Question/Feedback Screen
  const question = quizQuestions[currentIndex];
  const isBookmarked = bookmarks.includes(question.id);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-4 flex-row items-center justify-between">
          <Pressable onPress={resetQuiz}>
            <MaterialIcons name="close" size={28} color={colors.muted} />
          </Pressable>
          <Text className="text-base font-medium text-foreground">
            {currentIndex + 1} / {quizQuestions.length}
          </Text>
          <Pressable onPress={handleBookmark}>
            <MaterialIcons 
              name={isBookmarked ? "bookmark" : "bookmark-border"} 
              size={28} 
              color={isBookmarked ? colors.primary : colors.muted} 
            />
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View className="mx-5 mt-3 h-2 bg-border rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full"
            style={{ 
              width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
              backgroundColor: colors.primary 
            }}
          />
        </View>

        {/* Category Badge */}
        <View className="px-5 mt-4">
          <View 
            className="self-start px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.primary + '20' }}
          >
            <Text className="text-sm font-medium" style={{ color: colors.primary }}>
              {question.category}
            </Text>
          </View>
        </View>

        {/* Question */}
        <View className="px-5 mt-4">
          <Text className="text-xl font-semibold text-foreground leading-7">
            {question.paraphrased_question}
          </Text>
        </View>

        {/* Answer Options */}
        <View className="px-5 mt-6 gap-3">
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = selectedAnswer === key;
            const isCorrectAnswer = key === question.correct_option;
            const showResult = quizState === "feedback";
            
            let bgColor = colors.surface;
            let borderColor = colors.border;
            let textColor = colors.foreground;
            
            if (showResult) {
              if (isCorrectAnswer) {
                bgColor = colors.success + '20';
                borderColor = colors.success;
                textColor = colors.success;
              } else if (isSelected && !isCorrectAnswer) {
                bgColor = colors.error + '20';
                borderColor = colors.error;
                textColor = colors.error;
              }
            } else if (isSelected) {
              bgColor = colors.primary + '20';
              borderColor = colors.primary;
            }
            
            return (
              <Pressable
                key={key}
                onPress={() => handleAnswer(key)}
                disabled={quizState === "feedback"}
                style={({ pressed }) => [
                  {
                    backgroundColor: bgColor,
                    borderWidth: 2,
                    borderColor: borderColor,
                    opacity: pressed && quizState !== "feedback" ? 0.8 : 1,
                  },
                ]}
                className="rounded-xl p-4 flex-row items-center"
              >
                <View 
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ 
                    backgroundColor: showResult && isCorrectAnswer ? colors.success : colors.border,
                  }}
                >
                  <Text 
                    className="text-sm font-bold"
                    style={{ color: showResult && isCorrectAnswer ? colors.background : colors.foreground }}
                  >
                    {key.toUpperCase()}
                  </Text>
                </View>
                <Text 
                  className="flex-1 text-base"
                  style={{ color: textColor }}
                >
                  {value}
                </Text>
                {showResult && isCorrectAnswer && (
                  <MaterialIcons name="check-circle" size={24} color={colors.success} />
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <MaterialIcons name="cancel" size={24} color={colors.error} />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Feedback Section */}
        {quizState === "feedback" && (
          <View className="px-5 mt-6">
            {/* Explanation */}
            <View 
              className="rounded-xl p-4 border"
              style={{ 
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="info" size={20} color={colors.primary} />
                <Text className="text-base font-semibold text-foreground ml-2">Explanation</Text>
              </View>
              <Text className="text-sm text-muted leading-5">
                {question.explanation}
              </Text>
            </View>

            {/* Mnemonic */}
            <Pressable
              onPress={() => setShowMnemonic(!showMnemonic)}
              style={{ marginTop: 12 }}
            >
              <View 
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: colors.warning + '15',
                  borderLeftWidth: 4,
                  borderLeftColor: colors.warning,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                    <Text className="text-base font-semibold text-foreground ml-2">
                      Memory Tip
                    </Text>
                  </View>
                  <MaterialIcons 
                    name={showMnemonic ? "expand-less" : "expand-more"} 
                    size={24} 
                    color={colors.muted} 
                  />
                </View>
                {showMnemonic && (
                  <Text className="text-sm text-foreground mt-2 italic leading-5">
                    {question.mnemonic}
                  </Text>
                )}
              </View>
            </Pressable>

            {/* Next Button */}
            <Pressable
              onPress={nextQuestion}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  marginTop: 16,
                },
              ]}
              className="rounded-xl p-4 flex-row items-center justify-center"
            >
              <Text className="text-lg font-semibold" style={{ color: colors.background }}>
                {currentIndex < quizQuestions.length - 1 ? "Next Question" : "See Results"}
              </Text>
              <MaterialIcons 
                name="arrow-forward" 
                size={24} 
                color={colors.background} 
                style={{ marginLeft: 8 }}
              />
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
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
