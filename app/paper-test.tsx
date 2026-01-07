import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { questions } from "@/lib/study-store";
import { useAuthContext } from "@/lib/auth-context";

// Photorealistic pencil cursor (SVG data URI) - 96x96 (3x larger)
// Hotspot at (78, 78) = pencil tip after -45deg rotation
const PENCIL_CURSOR = Platform.OS === 'web'
  ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Cdefs%3E%3ClinearGradient id='wood' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23DEB887'/%3E%3Cstop offset='30%25' style='stop-color:%23F4A460'/%3E%3Cstop offset='70%25' style='stop-color:%23DAA520'/%3E%3Cstop offset='100%25' style='stop-color:%23DEB887'/%3E%3C/linearGradient%3E%3ClinearGradient id='metal' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23A8A8A8'/%3E%3Cstop offset='25%25' style='stop-color:%23D4D4D4'/%3E%3Cstop offset='50%25' style='stop-color:%23E8E8E8'/%3E%3Cstop offset='75%25' style='stop-color:%23C0C0C0'/%3E%3Cstop offset='100%25' style='stop-color:%23909090'/%3E%3C/linearGradient%3E%3ClinearGradient id='eraser' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23E8A0A0'/%3E%3Cstop offset='50%25' style='stop-color:%23FFB6C1'/%3E%3Cstop offset='100%25' style='stop-color:%23E8A0A0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform='rotate(-45 48 48)'%3E%3Crect x='36' y='12' width='24' height='60' fill='url(%23wood)' rx='1'/%3E%3Cpolygon points='36,72 48,90 60,72' fill='%23F5DEB3'/%3E%3Cpolygon points='42,78 48,90 54,78' fill='%23333'/%3E%3Crect x='36' y='12' width='24' height='9' fill='url(%23metal)'/%3E%3Crect x='37' y='14' width='22' height='1' fill='%23666' opacity='0.3'/%3E%3Crect x='37' y='17' width='22' height='1' fill='%23666' opacity='0.3'/%3E%3Crect x='36' y='3' width='24' height='10' fill='url(%23eraser)' rx='2'/%3E%3Cline x1='42' y1='21' x2='42' y2='72' stroke='%23CD853F' stroke-width='1.5'/%3E%3Cline x1='54' y1='21' x2='54' y2='72' stroke='%23CD853F' stroke-width='1.5'/%3E%3Ctext x='48' y='50' text-anchor='middle' font-size='8' fill='%23654321' font-family='Arial'%3E2%3C/text%3E%3C/g%3E%3C/svg%3E") 78 78, auto`
  : undefined;

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Watch-face pace timer component
function PaceTimer({
  secondsRemaining,
  totalSeconds,
  isVisible,
}: {
  secondsRemaining: number;
  totalSeconds: number;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  const size = 64;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = secondsRemaining / totalSeconds;
  const strokeDashoffset = circumference * (1 - progress);

  // Color based on time remaining
  const getColor = () => {
    if (secondsRemaining <= 10) return "#DC2626"; // Red - urgent
    if (secondsRemaining <= 20) return "#F59E0B"; // Orange - warning
    return "#059669"; // Green - good pace
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: "#1a1a1a",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        // Watch bezel effect
        borderWidth: 3,
        borderColor: "#333",
      }}
    >
      {/* SVG circle progress */}
      {Platform.OS === "web" ? (
        <svg
          width={size - 6}
          height={size - 6}
          style={{ position: "absolute" } as any}
        >
          {/* Background circle */}
          <circle
            cx={(size - 6) / 2}
            cy={(size - 6) / 2}
            r={radius - 3}
            fill="none"
            stroke="#333"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={(size - 6) / 2}
            cy={(size - 6) / 2}
            r={radius - 3}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${(size - 6) / 2} ${(size - 6) / 2})`}
          />
        </svg>
      ) : (
        <View
          style={{
            position: "absolute",
            width: size - 10,
            height: size - 10,
            borderRadius: (size - 10) / 2,
            borderWidth: strokeWidth,
            borderColor: getColor(),
            opacity: 0.3,
          }}
        />
      )}
      {/* Time display */}
      <Text
        style={{
          fontSize: 18,
          fontWeight: "700",
          color: getColor(),
          fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
        }}
      >
        {secondsRemaining}
      </Text>
      <Text
        style={{
          fontSize: 8,
          color: "#6B7280",
          marginTop: -2,
        }}
      >
        SEC
      </Text>
    </View>
  );
}

// Overall pace indicator component
function PaceIndicator({
  questionsAnswered,
  totalQuestions,
  timeElapsed,
  totalTime,
  isVisible,
}: {
  questionsAnswered: number;
  totalQuestions: number;
  timeElapsed: number;
  totalTime: number;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  // Calculate expected progress vs actual progress
  const expectedProgress = timeElapsed / totalTime; // 0 to 1
  const actualProgress = questionsAnswered / totalQuestions; // 0 to 1

  // Difference: positive = ahead, negative = behind
  const progressDiff = actualProgress - expectedProgress;
  const questionsAheadBehind = Math.round(progressDiff * totalQuestions);

  const isAhead = questionsAheadBehind >= 0;
  const isOnTrack = Math.abs(questionsAheadBehind) <= 2;

  const getColor = () => {
    if (isOnTrack) return "#059669"; // Green - on track
    if (isAhead) return "#3B82F6"; // Blue - ahead
    return "#DC2626"; // Red - behind
  };

  const getIcon = (): "trending-up" | "trending-down" | "trending-flat" => {
    if (isOnTrack) return "trending-flat";
    if (isAhead) return "trending-up";
    return "trending-down";
  };

  const getMessage = () => {
    if (isOnTrack) return "On Track";
    if (isAhead) return `${questionsAheadBehind} ahead`;
    return `${Math.abs(questionsAheadBehind)} behind`;
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
      }}
    >
      <MaterialIcons name={getIcon()} size={16} color={getColor()} />
      <Text
        style={{
          fontSize: 12,
          fontWeight: "600",
          color: getColor(),
        }}
      >
        {getMessage()}
      </Text>
    </View>
  );
}

// Scantron bubble component
function ScantronBubble({
  label,
  filled,
  correct,
  showResult,
  onPress,
  disabled,
}: {
  label: string;
  filled: boolean;
  correct: boolean;
  showResult: boolean;
  onPress: () => void;
  disabled: boolean;
}) {
  const getBubbleColor = () => {
    if (!showResult) return filled ? "#1a1a1a" : "transparent";
    if (correct && filled) return "#059669"; // Green for correct
    if (!correct && filled) return "#DC2626"; // Red for wrong
    if (correct && !filled) return "#059669"; // Show correct answer
    return "transparent";
  };

  const getBorderColor = () => {
    if (!showResult) return "#374151";
    if (correct) return "#059669";
    if (filled && !correct) return "#DC2626";
    return "#374151";
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }: any) => ({
        opacity: disabled ? 0.7 : pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
        // Keep pencil cursor on bubbles
        ...(Platform.OS === 'web' ? { cursor: PENCIL_CURSOR } as any : {}),
      })}
    >
      <View
        style={{
          width: 32,
          height: 16,
          borderRadius: 8,
          borderWidth: 2,
          borderColor: getBorderColor(),
          backgroundColor: "#f5f5dc",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
        }}
      >
        {/* Filled bubble */}
        {(filled || (showResult && correct)) && (
          <View
            style={{
              width: 26,
              height: 12,
              borderRadius: 6,
              backgroundColor: getBubbleColor(),
            }}
          />
        )}
      </View>
    </Pressable>
  );
}

// Single question row on the scantron
function ScantronRow({
  questionNumber,
  selectedAnswer,
  correctAnswer,
  showResult,
  onSelectAnswer,
  disabled,
}: {
  questionNumber: number;
  selectedAnswer: string | null;
  correctAnswer: string;
  showResult: boolean;
  onSelectAnswer: (answer: string) => void;
  disabled: boolean;
}) {
  const options = ["A", "B", "C", "D"];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.05)",
      }}
    >
      {/* Question number */}
      <View
        style={{
          width: 36,
          height: 28,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#374151",
            fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
          }}
        >
          {questionNumber.toString().padStart(2, "0")}
        </Text>
      </View>

      {/* Answer bubbles */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {options.map((option) => (
          <View key={option} style={{ alignItems: "center" }}>
            <Text
              style={{
                fontSize: 10,
                fontWeight: "600",
                color: "#6B7280",
                marginBottom: 2,
                fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
              }}
            >
              {option}
            </Text>
            <ScantronBubble
              label={option}
              filled={selectedAnswer === option}
              correct={correctAnswer === option}
              showResult={showResult}
              onPress={() => {
                if (Platform.OS !== "web") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                onSelectAnswer(option);
              }}
              disabled={disabled}
            />
          </View>
        ))}
      </View>

      {/* Result indicator */}
      {showResult && (
        <View style={{ marginLeft: 16 }}>
          {selectedAnswer === correctAnswer ? (
            <MaterialIcons name="check-circle" size={20} color="#059669" />
          ) : (
            <MaterialIcons name="cancel" size={20} color="#DC2626" />
          )}
        </View>
      )}
    </View>
  );
}

export default function PaperTestScreen() {
  const router = useRouter();
  const colors = useColors();
  const { width, height } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 1024;

  const [testQuestions, setTestQuestions] = useState<typeof questions>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [totalTimeSeconds, setTotalTimeSeconds] = useState(90 * 60); // Store initial total time
  const [showPaceTimer, setShowPaceTimer] = useState(true);
  const [paceSecondsRemaining, setPaceSecondsRemaining] = useState(0);
  const [paceSecondsTotal, setPaceSecondsTotal] = useState(0);

  // Use auth context for authoritative purchase status
  const { hasPurchased: isPurchased } = useAuthContext();

  const questionsPerPage = 25;
  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);

  // Free: 25 questions (30 min), Paid: 140 questions (2.5 hours)
  const FREE_QUESTION_COUNT = 25;
  const PAID_QUESTION_COUNT = 140;

  // Initialize test with shuffled questions (filter out questions with missing options)
  useEffect(() => {
    // Set timer based on question count
    const questionCount = isPurchased ? PAID_QUESTION_COUNT : FREE_QUESTION_COUNT;
    const timerMinutes = isPurchased ? 150 : 30; // 2.5 hours for paid, 30 min for free
    const totalSeconds = timerMinutes * 60;
    setTimeRemaining(totalSeconds);
    setTotalTimeSeconds(totalSeconds);

    // Calculate pace timer: seconds per question (minus ~10 sec buffer for navigation)
    // e.g., 150 min for 140 questions = ~64 sec/question, minus buffer = ~54 sec
    const secondsPerQuestion = Math.floor((totalSeconds / questionCount) - 10);
    setPaceSecondsTotal(secondsPerQuestion);
    setPaceSecondsRemaining(secondsPerQuestion);

    // Filter questions that have valid options (at least a and b with content)
    const validQuestions = questions.filter(q => {
      const opts = q.options;
      if (!opts || typeof opts !== 'object') return false;
      const keys = Object.keys(opts);
      // Must have at least 2 options with actual content (keys are lowercase: a, b, c, d)
      return keys.length >= 2 && opts.a && opts.b;
    });
    const shuffled = shuffleArray(validQuestions).slice(0, questionCount);
    setTestQuestions(shuffled);
  }, [isPurchased]);

  // Timer (main countdown + pace timer)
  useEffect(() => {
    if (!isTimerRunning || showResults) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });

      // Pace timer countdown
      setPaceSecondsRemaining((prev) => {
        if (prev <= 0) {
          // Reset pace timer when it hits 0
          return paceSecondsTotal;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, showResults, paceSecondsTotal]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (showResults) return;
    setAnswers((prev) => {
      // Toggle: if same answer clicked, erase it (like using eraser)
      if (prev[questionIndex] === answer) {
        const newAnswers = { ...prev };
        delete newAnswers[questionIndex];
        return newAnswers;
      }
      // Reset pace timer when answering a new question
      if (!prev[questionIndex]) {
        setPaceSecondsRemaining(paceSecondsTotal);
      }
      return {
        ...prev,
        [questionIndex]: answer,
      };
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
    setIsTimerRunning(false);
  };

  const getScore = () => {
    let correct = 0;
    testQuestions.forEach((q, index) => {
      // Compare case-insensitively (answers are uppercase, correct_option is lowercase)
      if (answers[index]?.toLowerCase() === q.correct_option?.toLowerCase()) {
        correct++;
      }
    });
    return correct;
  };

  const answeredCount = Object.keys(answers).length;
  const currentQuestions = testQuestions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  // Loading state
  if (testQuestions.length === 0) {
    return (
      <ScreenContainer edges={["top", "bottom"]}>
        <View style={{ flex: 1, backgroundColor: "#8B7355", justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "#f5f5dc", padding: 32, borderRadius: 8, alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "600", color: "#374151", marginBottom: 8 }}>
              Preparing Your Exam...
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>
              Loading questions
            </Text>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "bottom"]}>
      <View style={{ flex: 1, backgroundColor: "#e8e4d9" }}>
        {/* Wood desk background */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#8B7355",
          }}
        >
          {/* Wood grain pattern */}
          {[...Array(20)].map((_, i) => (
            <View
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: `${i * 5}%`,
                width: 2,
                height: "100%",
                backgroundColor: `rgba(0,0,0,${0.02 + Math.random() * 0.03})`,
              }}
            />
          ))}
        </View>

        {/* Header bar */}
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            paddingHorizontal: 20,
            paddingVertical: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 8, fontWeight: "600" }}>
              Exit Test
            </Text>
          </Pressable>

          {/* Timer */}
          <View
            style={{
              backgroundColor: timeRemaining < 600 ? "#DC2626" : "#1a1a1a",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MaterialIcons name="timer" size={20} color="#fff" />
            <Text
              style={{
                color: "#fff",
                marginLeft: 8,
                fontSize: 18,
                fontWeight: "700",
                fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
              }}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>

          {/* Progress */}
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: "#fff", fontSize: 14 }}>
              {answeredCount} / {testQuestions.length} answered
            </Text>
          </View>
        </View>

        {/* Pace Timer Row */}
        {!showResults && (
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              paddingHorizontal: 20,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              borderTopWidth: 1,
              borderTopColor: "rgba(255,255,255,0.1)",
            }}
          >
            {/* Toggle pace timer */}
            <Pressable
              onPress={() => setShowPaceTimer(!showPaceTimer)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                opacity: 0.8,
              }}
            >
              <MaterialIcons
                name={showPaceTimer ? "visibility" : "visibility-off"}
                size={16}
                color="#fff"
              />
              <Text style={{ color: "#fff", fontSize: 11 }}>
                Pace
              </Text>
            </Pressable>

            {/* Pace Timer Watch */}
            <PaceTimer
              secondsRemaining={paceSecondsRemaining}
              totalSeconds={paceSecondsTotal}
              isVisible={showPaceTimer}
            />

            {/* Pace Indicator */}
            <PaceIndicator
              questionsAnswered={answeredCount}
              totalQuestions={testQuestions.length}
              timeElapsed={totalTimeSeconds - timeRemaining}
              totalTime={totalTimeSeconds}
              isVisible={showPaceTimer}
            />

            {/* Pace explanation */}
            {showPaceTimer && (
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, maxWidth: 120 }}>
                ~{paceSecondsTotal}s per question to finish on time
              </Text>
            )}
          </View>
        )}

        {/* Free trial banner */}
        {!isPurchased && (
          <Pressable
            onPress={() => router.push("/upgrade")}
            style={{
              backgroundColor: "#F59E0B",
              paddingVertical: 10,
              paddingHorizontal: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialIcons name="lock" size={18} color="#fff" />
            <Text style={{ color: "#fff", fontWeight: "600", marginLeft: 8 }}>
              Free Trial: 25 Questions • Upgrade for full 140-question exam
            </Text>
            <MaterialIcons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </Pressable>
        )}

        <ScrollView
          contentContainerStyle={{
            padding: isDesktop ? 40 : 16,
            alignItems: "center",
          }}
        >
          {/* Scantron Sheet */}
          <View
            style={{
              maxWidth: 500,
              width: "100%",
              backgroundColor: "#f5f5dc", // Cream/beige scantron color
              borderRadius: 4,
              // Paper shadow
              shadowColor: "#000",
              shadowOffset: { width: 4, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              // Paper edge effect
              borderWidth: 1,
              borderColor: "rgba(0,0,0,0.1)",
              // Pencil cursor on web
              ...(Platform.OS === 'web' ? { cursor: PENCIL_CURSOR } as any : {}),
            }}
          >
            {/* Scantron Header */}
            <View
              style={{
                backgroundColor: "#1a5f2a", // Green header like real scantrons
                padding: 16,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "700",
                  textAlign: "center",
                  fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                }}
              >
                NYS MASSAGE THERAPY EXAMINATION
              </Text>
              {/* Mode indicator */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 8,
                  gap: 8,
                }}
              >
                <View
                  style={{
                    backgroundColor: isPurchased ? "#059669" : "#F59E0B",
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "700",
                      fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                    }}
                  >
                    {isPurchased ? "FULL EXAM" : "DEMO MODE"}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 12,
                    fontWeight: "600",
                    fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                  }}
                >
                  {testQuestions.length} QUESTIONS • {isPurchased ? "150" : "30"} MIN
                </Text>
              </View>
            </View>

            {/* Instructions */}
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.03)",
                padding: 12,
                borderBottomWidth: 2,
                borderBottomColor: "#1a5f2a",
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  color: "#374151",
                  textAlign: "center",
                  fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                }}
              >
                USE NO. 2 PENCIL ONLY • MAKE DARK MARKS • ERASE COMPLETELY TO CHANGE
              </Text>
            </View>

            {/* Page indicator */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,0.1)",
              }}
            >
              {[...Array(totalPages)].map((_, i) => (
                <Pressable
                  key={i}
                  onPress={() => setCurrentPage(i)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: currentPage === i ? "#1a5f2a" : "transparent",
                    borderWidth: 1,
                    borderColor: "#1a5f2a",
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 4,
                    ...(Platform.OS === 'web' ? { cursor: PENCIL_CURSOR } as any : {}),
                  }}
                >
                  <Text
                    style={{
                      color: currentPage === i ? "#fff" : "#1a5f2a",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {i + 1}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Column headers */}
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: "rgba(0,0,0,0.1)",
              }}
            >
              <View style={{ width: 52 }}>
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: "600",
                    color: "#374151",
                    fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                  }}
                >
                  NO.
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                {["A", "B", "C", "D"].map((letter) => (
                  <View
                    key={letter}
                    style={{ width: 40, alignItems: "center" }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#1a5f2a",
                        fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                      }}
                    >
                      {letter}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Answer rows */}
            {currentQuestions.map((question, index) => {
              const globalIndex = currentPage * questionsPerPage + index;

              return (
                <ScantronRow
                  key={globalIndex}
                  questionNumber={globalIndex + 1}
                  selectedAnswer={answers[globalIndex] || null}
                  correctAnswer={(question.correct_option || "a").toUpperCase()}
                  showResult={showResults}
                  onSelectAnswer={(answer) => handleSelectAnswer(globalIndex, answer)}
                  disabled={showResults}
                />
              );
            })}

            {/* Footer */}
            <View
              style={{
                padding: 16,
                borderTopWidth: 2,
                borderTopColor: "#1a5f2a",
                alignItems: "center",
              }}
            >
              {showResults ? (
                <View style={{ alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "700",
                      color: getScore() >= 70 ? "#059669" : "#DC2626",
                      fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                    }}
                  >
                    SCORE: {getScore()} / {testQuestions.length}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#374151",
                      marginTop: 4,
                    }}
                  >
                    {Math.round((getScore() / testQuestions.length) * 100)}% -{" "}
                    {getScore() >= 70 ? "PASSED" : "NEEDS IMPROVEMENT"}
                  </Text>
                  <Pressable
                    onPress={() => router.back()}
                    style={{
                      marginTop: 16,
                      backgroundColor: "#1a5f2a",
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 8,
                      ...(Platform.OS === 'web' ? { cursor: PENCIL_CURSOR } as any : {}),
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "600" }}>
                      Return to Study
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  onPress={handleSubmit}
                  style={({ pressed }) => ({
                    backgroundColor: answeredCount === testQuestions.length ? "#1a5f2a" : "#6B7280",
                    paddingHorizontal: 32,
                    paddingVertical: 14,
                    borderRadius: 8,
                    opacity: pressed ? 0.9 : 1,
                    ...(Platform.OS === 'web' ? { cursor: PENCIL_CURSOR } as any : {}),
                  })}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 16,
                      fontWeight: "700",
                      fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                    }}
                  >
                    SUBMIT TEST
                  </Text>
                </Pressable>
              )}
            </View>
          </View>

          {/* Question booklet (side panel on desktop) */}
          {isDesktop && (
            <View
              style={{
                position: "absolute",
                right: 40,
                top: 40,
                width: 400,
                backgroundColor: "#fff",
                borderRadius: 4,
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 6 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                padding: 20,
                maxHeight: height - 200,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#1a5f2a",
                  marginBottom: 16,
                  fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                }}
              >
                QUESTION BOOKLET - PAGE {currentPage + 1}
              </Text>
              <ScrollView style={{ maxHeight: height - 300 }}>
                {currentQuestions.map((question, index) => {
                  const globalIndex = currentPage * questionsPerPage + index;
                  return (
                    <View
                      key={globalIndex}
                      style={{
                        marginBottom: 20,
                        paddingBottom: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: "#E5E7EB",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: 8,
                        }}
                      >
                        {globalIndex + 1}. {question.question}
                      </Text>
                      {Object.entries(question.options).map(([key, value]) => (
                        <Text
                          key={key}
                          style={{
                            fontSize: 11,
                            color: "#6B7280",
                            marginLeft: 12,
                            marginBottom: 2,
                          }}
                        >
                          {key}. {value}
                        </Text>
                      ))}
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Mobile question display */}
          {!isDesktop && (
            <View
              style={{
                width: "100%",
                maxWidth: 500,
                marginTop: 20,
                backgroundColor: "#fff",
                borderRadius: 4,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#1a5f2a",
                  marginBottom: 12,
                  fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                }}
              >
                QUESTIONS {currentPage * questionsPerPage + 1} -{" "}
                {Math.min((currentPage + 1) * questionsPerPage, testQuestions.length)}
              </Text>
              {currentQuestions.map((question, index) => {
                const globalIndex = currentPage * questionsPerPage + index;
                return (
                  <View
                    key={globalIndex}
                    style={{
                      marginBottom: 16,
                      paddingBottom: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: "#E5E7EB",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: "#374151",
                        marginBottom: 6,
                      }}
                    >
                      {globalIndex + 1}. {question.question}
                    </Text>
                    {Object.entries(question.options).map(([key, value]) => (
                      <Text
                        key={key}
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginLeft: 8,
                          marginBottom: 2,
                        }}
                      >
                        {key}. {value}
                      </Text>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
