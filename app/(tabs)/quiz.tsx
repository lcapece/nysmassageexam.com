import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, Alert, Platform, useWindowDimensions, Image, Modal } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import Svg, { Circle } from "react-native-svg";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Container, useIsDesktop } from "@/components/desktop/container";
import { Card, StatCard } from "@/components/desktop/card";
import { Button } from "@/components/desktop/button";
import { Badge } from "@/components/desktop/badge";
import { AppShell } from "@/components/desktop/nav";
import {
  questions,
  Question,
  recordAnswer,
  saveQuizSession,
  getProgress,
  getBookmarks,
  toggleBookmark,
  CATEGORIES,
  isTrialQuestion,
  TRIAL_QUESTION_IDS,
} from "@/lib/study-store";
import {
  startStudySession,
  recordSessionAnswer,
  syncProgressToServer,
} from "@/lib/leaderboard-service";
import { useAuthContext } from "@/lib/auth-context";

// Enhanced markdown text renderer - renders bold, line breaks, and styled sections
const MarkdownText = ({ text, style, colors }: { text: string; style?: any; colors?: any }) => {
  if (!text) return null;

  // Split by double newlines for paragraphs
  const paragraphs = text.split(/\n\n+/);

  const renderLine = (line: string, key: string, isLastLine: boolean, isLastPara: boolean, baseStyle: any) => {
    // Check if line starts with an emoji (common section marker)
    const emojiMatch = line.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}])/u);
    const hasEmoji = emojiMatch !== null;

    // Parse **bold** text
    const parts = line.split(/(\*\*[^*]+\*\*)/g);

    // Determine if this is a "header-like" line (starts with emoji and has bold)
    const isSectionHeader = hasEmoji && line.includes('**');

    return (
      <Text
        key={key}
        style={[
          baseStyle,
          !isLastLine || !isLastPara ? { marginBottom: isSectionHeader ? 8 : 6 } : {},
          isSectionHeader ? { marginTop: 4 } : {}
        ]}
      >
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text
                key={i}
                style={{
                  fontWeight: '700',
                  color: colors?.foreground || baseStyle?.color
                }}
              >
                {part.slice(2, -2)}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  };

  return (
    <View style={{ gap: 2 }}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split(/\n/);
        const isLastPara = pIdx === paragraphs.length - 1;

        return (
          <View key={pIdx} style={{ marginBottom: isLastPara ? 0 : 8 }}>
            {lines.map((line, lIdx) => {
              const isLastLine = lIdx === lines.length - 1;
              return renderLine(line, `${pIdx}-${lIdx}`, isLastLine, isLastPara, style);
            })}
          </View>
        );
      })}
    </View>
  );
};

type QuizState = "setup" | "question" | "feedback" | "complete";

export default function QuizScreen() {
  const router = useRouter();
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();

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
  const [showIncorrectExplanations, setShowIncorrectExplanations] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  // Use auth context for authoritative purchase status
  const { hasPurchased: isPurchased } = useAuthContext();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    const bm = await getBookmarks();
    setBookmarks(bm);
  };

  const startQuiz = (category: string | null, count: number = 10) => {
    let availableQuestions: Question[];

    if (isPurchased) {
      availableQuestions = category
        ? questions.filter(q => q.category === category)
        : [...questions];
    } else {
      if (category) {
        const trialIds = TRIAL_QUESTION_IDS[category] || [];
        availableQuestions = questions.filter(q => trialIds.includes(q.id));
      } else {
        availableQuestions = questions.filter(q => isTrialQuestion(q.id));
      }
    }

    const shuffled = availableQuestions.sort(() => Math.random() - 0.5);
    const maxCount = isPurchased ? count : Math.min(count, availableQuestions.length);
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

    // Start tracking study session for SMS progress sync and leaderboard
    startStudySession();
  };

  const handleAnswer = async (answer: string) => {
    if (selectedAnswer) return;

    const question = quizQuestions[currentIndex];
    // Handle both correct_option and correct_answer_text (which starts with letter like "c. ...")
    const correctKey = question.correct_option ||
      (question.correct_answer_text?.charAt(0).toLowerCase());
    const correct = answer === correctKey;

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

    await recordAnswer(question.id, correct);

    // Record for leaderboard tracking
    recordSessionAnswer(correct, question.category);
  };

  const nextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuizState("question");
      setShowMnemonic(false);
      setShowIncorrectExplanations(false);
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

    // Sync progress to server for SMS reminders and leaderboard (non-blocking)
    syncProgressToServer().catch(() => {});
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

  // DESKTOP SETUP SCREEN
  if (quizState === "setup" && isDesktop) {
    return (
      <AppShell>
        <ScrollView
          style={{ flex: 1, backgroundColor: colors.background }}
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <Container>
            {/* Header */}
            <View style={{ paddingTop: 32, paddingBottom: 24 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>
                Quiz Mode
              </Text>
              <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>
                Test your knowledge with practice questions
              </Text>
            </View>

            {/* Trial Mode Banner */}
            {!isPurchased && (
              <Pressable
                onPress={() => router.push("/upgrade")}
                style={({ pressed }: any) => ({
                  marginBottom: 16,
                  opacity: pressed ? 0.95 : 1,
                })}
              >
                <Card style={{ padding: 16, borderLeftWidth: 4, borderLeftColor: colors.warning }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Badge variant="warning">FREE TRIAL</Badge>
                      </View>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                        You're in trial mode
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted, marginTop: 2 }}>
                        3 questions per category • Unlock all 287 for just $37
                      </Text>
                    </View>
                    <MaterialIcons name="lock-open" size={32} color={colors.warning} />
                  </View>
                </Card>
              </Pressable>
            )}

            {/* Quick Start Options */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <Pressable
                onPress={() => startQuiz(null, 10)}
                style={({ pressed, hovered }: any) => ({ flex: 1, opacity: pressed ? 0.95 : 1 })}
              >
                {({ hovered }: any) => (
                  <View
                    style={{
                      backgroundColor: colors.primary,
                      padding: 20,
                      borderRadius: 16,
                      transform: [{ scale: hovered ? 1.02 : 1 }],
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 18,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}>
                      <MaterialIcons name="play-arrow" size={28} color="#FFFFFF" />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#FFFFFF' }}>
                      Quick Quiz
                    </Text>
                    <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
                      10 random questions to warm up
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>
                        Start now
                      </Text>
                      <MaterialIcons name="arrow-forward" size={28} color="#FFFFFF" style={{ marginLeft: 6 }} />
                    </View>
                  </View>
                )}
              </Pressable>

              <Pressable
                onPress={() => startQuiz(null, 140)}
                style={({ pressed }: any) => ({ flex: 1, opacity: pressed ? 0.95 : 1 })}
              >
                {({ hovered }: any) => (
                  <Card
                    style={{
                      padding: 20,
                      borderWidth: 2,
                      borderColor: colors.primary,
                      transform: [{ scale: hovered ? 1.02 : 1 }],
                    }}
                  >
                    <View style={{
                      width: 48,
                      height: 48,
                      borderRadius: 18,
                      backgroundColor: colors.primaryMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12,
                    }}>
                      <MaterialIcons name="assignment" size={28} color={colors.primary} />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>
                      {isPurchased ? 'Full Exam Practice' : 'Demo Exam Practice'}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                      {isPurchased ? '140 questions like the real NYS exam' : '25 questions (free trial)'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primary }}>
                        Start exam
                      </Text>
                      <MaterialIcons name="arrow-forward" size={28} color={colors.primary} style={{ marginLeft: 6 }} />
                    </View>
                  </Card>
                )}
              </Pressable>
            </View>

            {/* Categories Grid */}
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginBottom: 16 }}>
                Practice by Category
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {CATEGORIES.map((category) => {
                  const count = questions.filter(q => q.category === category).length;
                  const icon = getCategoryIcon(category);
                  return (
                    <Pressable
                      key={category}
                      onPress={() => startQuiz(category, 10)}
                      style={{ width: 'calc(25% - 15px)' } as any}
                    >
                      {({ hovered, pressed }: any) => (
                        <Card
                          style={{
                            padding: 16,
                            backgroundColor: hovered ? colors.surfaceHover : colors.surface,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                          }}
                        >
                          <View style={{
                            width: 44,
                            height: 44,
                            borderRadius: 16,
                            backgroundColor: colors.primaryMuted,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                          }}>
                            <MaterialIcons name={icon} size={24} color={colors.primary} />
                          </View>
                          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                            {category}
                          </Text>
                          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 6 }}>
                            {count} questions
                          </Text>
                        </Card>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </Container>
        </ScrollView>
      </AppShell>
    );
  }

  // DESKTOP COMPLETE SCREEN
  if (quizState === "complete" && isDesktop) {
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const isPassing = percentage >= 70;
    const duration = Math.round((Date.now() - startTime) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return (
      <AppShell>
        <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Card style={{ padding: 24, maxWidth: 600, width: '100%', alignItems: 'center' }}>
            {/* Result Icon */}
            <View style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: isPassing ? colors.successMuted : colors.warningMuted,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <MaterialIcons
                name={isPassing ? "celebration" : "sentiment-dissatisfied"}
                size={24}
                color={isPassing ? colors.success : colors.warning}
              />
            </View>

            {/* Title */}
            <Text style={{ fontSize: 32, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
              {isPassing ? "Excellent Work!" : "Keep Practicing!"}
            </Text>
            <Text style={{ fontSize: 16, color: colors.muted, textAlign: 'center', marginBottom: 12 }}>
              {isPassing
                ? "You're on track to pass the NYS exam!"
                : "Review the material and try again. You've got this!"}
            </Text>

            {/* Score Ring */}
            <View style={{ marginBottom: 12 }}>
              <ScoreRing
                percent={percentage}
                size={160}
                strokeWidth={12}
                color={isPassing ? colors.success : colors.warning}
                bgColor={colors.border}
              />
            </View>

            {/* Stats Row */}
            <View style={{ flexDirection: 'row', gap: 16, marginBottom: 12 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>{score}</Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>Correct</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>{quizQuestions.length - score}</Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>Incorrect</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </Text>
                <Text style={{ fontSize: 14, color: colors.muted }}>Time</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                icon={<MaterialIcons name="refresh" size={20} color="#FFFFFF" />}
                onPress={resetQuiz}
              >
                New Quiz
              </Button>
              <Button
                variant="secondary"
                size="lg"
                fullWidth
                icon={<MaterialIcons name="bar-chart" size={20} color={colors.foreground} />}
                onPress={() => router.push("/progress")}
              >
                View Progress
              </Button>
            </View>
          </Card>
        </View>
      </AppShell>
    );
  }

  // DESKTOP QUESTION/FEEDBACK SCREEN
  if ((quizState === "question" || quizState === "feedback") && isDesktop) {
    const question = quizQuestions[currentIndex];
    const isBookmarked = bookmarks.includes(question.id);
    const progressPercent = ((currentIndex + 1) / quizQuestions.length) * 100;

    return (
      <AppShell>
        <View style={{ flex: 1, backgroundColor: colors.background, flexDirection: 'column' }}>
          {/* Top Bar */}
          <Container>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 20,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}>
              <Pressable
                onPress={resetQuiz}
                style={({ hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: hovered ? colors.surfaceHover : 'transparent',
                })}
              >
                <MaterialIcons name="close" size={24} color={colors.muted} />
                <Text style={{ fontSize: 14, color: colors.muted }}>Exit Quiz</Text>
              </Pressable>

              <View style={{ flex: 1, maxWidth: 400, marginHorizontal: 32 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground }}>
                    Question {currentIndex + 1} of {quizQuestions.length}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.muted }}>
                    Score: {score}/{currentIndex + (quizState === 'feedback' ? 1 : 0)}
                  </Text>
                </View>
                <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                  <View
                    style={{
                      height: '100%',
                      width: `${progressPercent}%`,
                      backgroundColor: colors.primary,
                      borderRadius: 3,
                    }}
                  />
                </View>
              </View>

              <Pressable
                onPress={handleBookmark}
                style={({ hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: hovered ? colors.surfaceHover : 'transparent',
                })}
              >
                <MaterialIcons
                  name={isBookmarked ? "bookmark" : "bookmark-border"}
                  size={24}
                  color={isBookmarked ? colors.primary : colors.muted}
                />
                <Text style={{ fontSize: 14, color: isBookmarked ? colors.primary : colors.muted }}>
                  {isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </Text>
              </Pressable>
            </View>
          </Container>

          {/* Main Content Area */}
          <View style={{ flex: 1, overflow: 'hidden' }}>
            <Container style={{ flex: 1, paddingHorizontal: 0 }}>
              <View style={{ flex: 1, flexDirection: 'row', gap: 24, paddingTop: 24, paddingHorizontal: 32 }}>
                {/* Question Panel */}
                <View style={{ flex: 5, display: 'flex', flexDirection: 'column' }}>
                  <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                  >
                    <Card style={{ padding: 20, height: '100%' }}>
                      {/* Category Badge */}
                      <Badge variant="primary" size="md">{question.category}</Badge>

                      {/* Question Text */}
                      <Text style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.foreground,
                        lineHeight: 38,
                        marginTop: 24,
                        marginBottom: 12,
                      }}>
                        {question.rewrite_question}
                      </Text>

                      {/* Answer Options */}
                      <View style={{ gap: 16 }}>
                        {Object.entries(question.options).map(([key, value]) => {
                          const isSelected = selectedAnswer === key;
                          // Handle both correct_option and correct_answer_text (which starts with letter like "c. ...")
                          const correctKey = question.correct_option ||
                            (question.correct_answer_text?.charAt(0).toLowerCase());
                          const isCorrectAnswer = key === correctKey;
                          const showResult = quizState === "feedback";

                          let bgColor = colors.surface;
                          let borderColor = colors.border;
                          let textColor = colors.foreground;

                          if (showResult) {
                            if (isCorrectAnswer) {
                              bgColor = colors.successMuted;
                              borderColor = colors.success;
                              textColor = colors.success;
                            } else if (isSelected && !isCorrectAnswer) {
                              bgColor = colors.errorMuted;
                              borderColor = colors.error;
                              textColor = colors.error;
                            }
                          } else if (isSelected) {
                            bgColor = colors.primaryMuted;
                            borderColor = colors.primary;
                          }

                          return (
                            <Pressable
                              key={key}
                              onPress={() => handleAnswer(key)}
                              disabled={quizState === "feedback"}
                            >
                              {({ hovered, pressed }: any) => (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    padding: 20,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: borderColor,
                                    backgroundColor: hovered && quizState !== 'feedback' ? colors.surfaceHover : bgColor,
                                    transform: [{ scale: pressed ? 0.98 : hovered ? 1.01 : 1 }],
                                    shadowColor: '#000',
                                    shadowOffset: hovered ? { width: 0, height: 4 } : { width: 0, height: 0 },
                                    shadowOpacity: hovered ? 0.1 : 0,
                                    shadowRadius: hovered ? 8 : 0,
                                  }}
                                >
                                  <View
                                    style={{
                                      width: 44,
                                      height: 44,
                                      borderRadius: 22,
                                      backgroundColor: showResult && isCorrectAnswer ? colors.success : colors.border,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      marginRight: 20,
                                    }}
                                  >
                                    <Text style={{
                                      fontSize: 16,
                                      fontWeight: '700',
                                      color: showResult && isCorrectAnswer ? '#FFFFFF' : colors.foreground,
                                    }}>
                                      {key.toUpperCase()}
                                    </Text>
                                  </View>
                                  <Text style={{ flex: 1, fontSize: 18, lineHeight: 26, color: textColor }}>
                                    {value}
                                  </Text>
                                  {showResult && isCorrectAnswer && (
                                    <MaterialIcons name="check-circle" size={28} color={colors.success} />
                                  )}
                                  {showResult && isSelected && !isCorrectAnswer && (
                                    <MaterialIcons name="cancel" size={28} color={colors.error} />
                                  )}
                                </View>
                              )}
                            </Pressable>
                          );
                        })}
                      </View>
                </Card>
                </ScrollView>
                </View>

                                {/* Side Panel - Shows during feedback - 525px width with inline explanation */}
                {quizState === "feedback" && (
                  <View style={{ width: 525, flexShrink: 0 }}>
                    {/* Compact Result Header */}
                    <Card
                      style={{
                        padding: 12,
                        marginBottom: 8,
                        backgroundColor: isCorrect ? colors.successMuted : colors.errorMuted,
                        borderWidth: 0,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialIcons
                          name={isCorrect ? "check-circle" : "cancel"}
                          size={20}
                          color={isCorrect ? colors.success : colors.error}
                        />
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: isCorrect ? colors.success : colors.error,
                        }}>
                          {isCorrect ? "Correct!" : `Incorrect - Answer: ${question.correct_option?.toUpperCase() || ''}`}
                        </Text>
                      </View>
                    </Card>

                    {/* Next Button */}
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      icon={<MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />}
                      iconPosition="right"
                      onPress={nextQuestion}
                      style={{ marginBottom: 12 }}
                    >
                      {currentIndex < quizQuestions.length - 1 ? "Next" : "Results"}
                    </Button>

                    {/* Explanation Content - Inline in side panel */}
                    <Card style={{ flex: 1, padding: 0, overflow: 'hidden' }}>
                      <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: 16 }}
                        showsVerticalScrollIndicator={true}
                      >
                        {/* Explanation */}
                        <View style={{ marginBottom: 16 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <MaterialIcons name="info" size={18} color={colors.primary} />
                            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
                              Explanation
                            </Text>
                          </View>
                          <MarkdownText
                            text={question.topic_explanation}
                            style={{ fontSize: 14, color: colors.muted, lineHeight: 22 }}
                            colors={colors}
                          />
                        </View>

                        {/* Mnemonic / Memory Tip */}
                        <View style={{
                          padding: 14,
                          backgroundColor: colors.warningMuted,
                          borderRadius: 10,
                          borderLeftWidth: 4,
                          borderLeftColor: colors.warning,
                          marginBottom: 16,
                        }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <MaterialIcons name="lightbulb" size={18} color={colors.warning} />
                            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground }}>
                              Memory Tip
                            </Text>
                          </View>
                          <Text style={{ fontSize: 13, color: colors.foreground, fontStyle: 'italic', lineHeight: 20 }}>
                            {question.mnemonic}
                          </Text>
                        </View>

                        {/* Incorrect Explanations Toggle */}
                        {question.incorrect_explanations && (
                          <View style={{ marginBottom: 16 }}>
                            <Pressable
                              onPress={() => setShowIncorrectExplanations(!showIncorrectExplanations)}
                              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}
                            >
                              <View style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 2,
                                borderColor: colors.primary,
                                backgroundColor: showIncorrectExplanations ? colors.primary : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                {showIncorrectExplanations && (
                                  <MaterialIcons name="check" size={14} color="#FFFFFF" />
                                )}
                              </View>
                              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.foreground }}>
                                Why other answers are wrong
                              </Text>
                            </Pressable>

                            {showIncorrectExplanations && (
                              <View style={{ gap: 10 }}>
                                {Object.entries(question.incorrect_explanations).map(([option, explanation]) => (
                                  <View
                                    key={option}
                                    style={{
                                      padding: 12,
                                      backgroundColor: colors.errorMuted,
                                      borderRadius: 8,
                                      borderLeftWidth: 3,
                                      borderLeftColor: colors.error,
                                    }}
                                  >
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.error, marginBottom: 4 }}>
                                      {option.toUpperCase()}:
                                    </Text>
                                    <Text style={{ fontSize: 12, color: colors.foreground, lineHeight: 18 }}>
                                      {explanation}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            )}
                          </View>
                        )}

                        {/* Visual Diagram */}
                        {question.image_url && (
                          <Pressable onPress={() => setZoomedImageUrl(question.image_url)}>
                            <View style={{
                              borderRadius: 10,
                              overflow: 'hidden',
                              borderWidth: 1,
                              borderColor: colors.border,
                            }}>
                              <Image
                                source={{ uri: question.image_url }}
                                style={{ width: '100%', height: 150 }}
                                resizeMode="cover"
                              />
                            </View>
                          </Pressable>
                        )}
                      </ScrollView>
                    </Card>
                  </View>
                )}
              </View>
            </Container>
          </View>

          {/* Image Zoom Modal */}
          <Modal
            visible={!!zoomedImageUrl}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setZoomedImageUrl(null)}
          >
            <Pressable
              onPress={() => setZoomedImageUrl(null)}
              style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}
            >
              <Pressable onPress={() => setZoomedImageUrl(null)} style={{ position: 'absolute', top: 40, right: 40, zIndex: 10 }}>
                <MaterialIcons name="close" size={24} color="#FFFFFF" />
              </Pressable>
              {zoomedImageUrl && (
                <Image
                  source={{ uri: zoomedImageUrl }}
                  style={{ width: '200%', maxWidth: 1200, aspectRatio: 1 }}
                  resizeMode="contain"
                />
              )}
            </Pressable>
          </Modal>
        </View>
      </AppShell>
    );
  }

  // MOBILE SETUP SCREEN
  if (quizState === "setup") {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-4 pb-2">
            <Text className="text-3xl font-bold text-foreground">Quiz Mode</Text>
            <Text className="text-base text-muted mt-1">Test your knowledge</Text>
          </View>

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
                <Text className="text-lg font-semibold text-foreground">{isPurchased ? 'Full Exam Practice' : 'Demo Exam Practice'}</Text>
                <Text className="text-sm text-muted">{isPurchased ? '140 questions (like the real exam)' : '25 questions (free trial)'}</Text>
              </View>
              <MaterialIcons name="assignment" size={28} color={colors.primary} />
            </Pressable>
          </View>

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
                    <MaterialIcons name={getCategoryIcon(category)} size={24} color={colors.primary} />
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

  // MOBILE COMPLETE SCREEN
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

  // MOBILE QUESTION/FEEDBACK SCREEN
  const question = quizQuestions[currentIndex];
  const isBookmarked = bookmarks.includes(question.id);

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
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

        <View className="mx-5 mt-3 h-2 bg-border rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${((currentIndex + 1) / quizQuestions.length) * 100}%`,
              backgroundColor: colors.primary
            }}
          />
        </View>

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

        <View className="px-5 mt-4">
          <Text className="text-xl font-semibold text-foreground leading-7">
            {question.rewrite_question}
          </Text>
        </View>

        <View className="px-5 mt-6 gap-3">
          {Object.entries(question.options).map(([key, value]) => {
            const isSelected = selectedAnswer === key;
            // Handle both correct_option and correct_answer_text (which starts with letter like "c. ...")
            const correctKey = question.correct_option ||
              (question.correct_answer_text?.charAt(0).toLowerCase());
            const isCorrectAnswer = key === correctKey;
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
                <Text className="flex-1 text-base" style={{ color: textColor }}>
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

        {quizState === "feedback" && (
          <View className="px-5 mt-6">
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
              <MarkdownText
                text={question.topic_explanation}
                style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}
                colors={colors}
              />
            </View>

            <Pressable onPress={() => setShowMnemonic(!showMnemonic)} style={{ marginTop: 12 }}>
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
                    <Text className="text-base font-semibold text-foreground ml-2">Memory Tip</Text>
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

            {/* Incorrect Answer Explanations - Mobile */}
            <View
              className="rounded-xl p-4 border mt-3"
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }}
            >
              <Pressable
                onPress={() => setShowIncorrectExplanations(!showIncorrectExplanations)}
                className="flex-row items-center"
                style={{ gap: 12 }}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: colors.primary,
                  backgroundColor: showIncorrectExplanations ? colors.primary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {showIncorrectExplanations && (
                    <MaterialIcons name="check" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text className="text-sm font-semibold text-foreground">
                  Show explanations for wrong answers
                </Text>
              </Pressable>

              {showIncorrectExplanations && question.incorrect_explanations && (
                <View className="mt-3" style={{ gap: 10 }}>
                  {Object.entries(question.incorrect_explanations).map(([option, explanation]) => (
                    <View
                      key={option}
                      className="p-3 rounded-lg"
                      style={{
                        backgroundColor: colors.error + '20',
                        borderLeftWidth: 3,
                        borderLeftColor: colors.error,
                      }}
                    >
                      <Text className="text-sm font-semibold mb-1" style={{ color: colors.error }}>
                        Why {option.toUpperCase()} is incorrect:
                      </Text>
                      <Text className="text-sm text-foreground leading-5">
                        {explanation}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Visual Diagram - Mobile */}
            {question.image_url && (
              <Pressable onPress={() => setZoomedImageUrl(question.image_url)} style={{ marginTop: 12 }}>
                <View
                  className="rounded-xl overflow-hidden border"
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  }}
                >
                  <Image
                    source={{ uri: question.image_url }}
                    style={{ width: '100%', aspectRatio: 1 }}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            )}

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

      {/* Image Zoom Modal - Mobile */}
      <Modal
        visible={!!zoomedImageUrl}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setZoomedImageUrl(null)}
      >
        <Pressable
          onPress={() => setZoomedImageUrl(null)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
        >
          <Pressable onPress={() => setZoomedImageUrl(null)} style={{ position: 'absolute', top: 40, right: 20, zIndex: 10 }}>
            <MaterialIcons name="close" size={32} color="#FFFFFF" />
          </Pressable>
          {zoomedImageUrl && (
            <Image
              source={{ uri: zoomedImageUrl }}
              style={{ width: '200%', maxWidth: 800, aspectRatio: 1 }}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

// Score Ring Component for Results
function ScoreRing({
  percent,
  size,
  strokeWidth,
  color,
  bgColor
}: {
  percent: number;
  size: number;
  strokeWidth: number;
  color: string;
  bgColor: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          stroke={bgColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color}
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
        <Text style={{ fontSize: size * 0.25, fontWeight: 'bold', color }}>
          {percent}%
        </Text>
      </View>
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
