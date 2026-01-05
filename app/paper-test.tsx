import { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { questions, getProgress, saveProgress, StudyProgress } from "@/lib/study-store";

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Scantron bubble component with fill animation
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
  const fillAnim = useRef(new Animated.Value(filled ? 1 : 0)).current;
  const colors = useColors();

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: filled ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [filled]);

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
      style={({ pressed, hovered }: any) => ({
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
          // Paper indent effect
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 1,
        }}
      >
        <Animated.View
          style={{
            width: 26,
            height: 12,
            borderRadius: 6,
            backgroundColor: fillAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["transparent", getBubbleColor()],
            }),
          }}
        />
        {/* Pencil graphite texture when filled */}
        {filled && !showResult && (
          <View
            style={{
              position: "absolute",
              width: 26,
              height: 12,
              borderRadius: 6,
              backgroundColor: "rgba(26, 26, 26, 0.85)",
              // Graphite texture
              opacity: 0.9,
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

  // Initialize test with shuffled questions
  useEffect(() => {
    const shuffled = shuffleArray(questions).slice(0, 100); // 100 question test
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

  const handleSubmit = async () => {
    setShowResults(true);
    setIsTimerRunning(false);

    // Calculate and save results
    let correct = 0;
    testQuestions.forEach((q, index) => {
      const correctLetter = ["A", "B", "C", "D"][q.correctIndex];
      if (answers[index] === correctLetter) {
        correct++;
      }
    });

    // Save progress
    const progress = await getProgress();
    // Update progress with results...
  };

  const getScore = () => {
    let correct = 0;
    testQuestions.forEach((q, index) => {
      const correctLetter = ["A", "B", "C", "D"][q.correctIndex];
      if (answers[index] === correctLetter) {
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
              const correctLetter = ["A", "B", "C", "D"][question.correctIndex];

              return (
                <ScantronRow
                  key={globalIndex}
                  questionNumber={globalIndex + 1}
                  selectedAnswer={answers[globalIndex] || null}
                  correctAnswer={correctLetter}
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
                      {question.options.map((option, optIndex) => (
                        <Text
                          key={optIndex}
                          style={{
                            fontSize: 11,
                            color: "#6B7280",
                            marginLeft: 12,
                            marginBottom: 2,
                          }}
                        >
                          {["A", "B", "C", "D"][optIndex]}. {option}
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
                    {question.options.map((option, optIndex) => (
                      <Text
                        key={optIndex}
                        style={{
                          fontSize: 12,
                          color: "#6B7280",
                          marginLeft: 8,
                          marginBottom: 2,
                        }}
                      >
                        {["A", "B", "C", "D"][optIndex]}. {option}
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
