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

// Photorealistic pencil cursor (SVG data URI)
const PENCIL_CURSOR = Platform.OS === 'web'
  ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='wood' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23DEB887'/%3E%3Cstop offset='50%25' style='stop-color:%23F4A460'/%3E%3Cstop offset='100%25' style='stop-color:%23DEB887'/%3E%3C/linearGradient%3E%3ClinearGradient id='metal' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3E%3Cstop offset='0%25' style='stop-color:%23C0C0C0'/%3E%3Cstop offset='50%25' style='stop-color:%23E8E8E8'/%3E%3Cstop offset='100%25' style='stop-color:%23A0A0A0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg transform='rotate(-45 16 16)'%3E%3Crect x='12' y='4' width='8' height='20' fill='url(%23wood)' rx='0.5'/%3E%3Cpolygon points='12,24 16,30 20,24' fill='%23F5DEB3'/%3E%3Cpolygon points='14,26 16,30 18,26' fill='%23333'/%3E%3Crect x='12' y='4' width='8' height='3' fill='url(%23metal)'/%3E%3Crect x='12' y='2' width='8' height='3' fill='%23FFB6C1' rx='1'/%3E%3Cline x1='14' y1='7' x2='14' y2='24' stroke='%23CD853F' stroke-width='0.5'/%3E%3Cline x1='18' y1='7' x2='18' y2='24' stroke='%23CD853F' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E") 2 30, auto`
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
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const questionsPerPage = 25;
  const totalPages = Math.ceil(testQuestions.length / questionsPerPage);

  // Initialize test with shuffled questions (filter out questions with missing options)
  useEffect(() => {
    // Filter questions that have valid options (at least A and B with content)
    const validQuestions = questions.filter(q => {
      const opts = q.options;
      if (!opts || typeof opts !== 'object') return false;
      const keys = Object.keys(opts);
      // Must have at least A and B options with actual content
      return keys.length >= 2 && opts.A && opts.B;
    });
    const shuffled = shuffleArray(validQuestions).slice(0, 100); // 100 question test
    setTestQuestions(shuffled);
  }, []);

  // Timer
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
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (showResults) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmit = () => {
    setShowResults(true);
    setIsTimerRunning(false);
  };

  const getScore = () => {
    let correct = 0;
    testQuestions.forEach((q, index) => {
      if (answers[index] === q.correct_option) {
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
              Shuffling 100 questions
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
              <Text
                style={{
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 12,
                  textAlign: "center",
                  marginTop: 4,
                  fontFamily: Platform.OS === "web" ? "Courier New, monospace" : "monospace",
                }}
              >
                GENERAL PURPOSE ANSWER SHEET
              </Text>
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
                  correctAnswer={question.correct_option || "A"}
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
