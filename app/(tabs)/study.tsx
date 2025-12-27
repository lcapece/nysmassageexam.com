import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import {
  questions,
  Question,
  getProgress,
  getBookmarks,
  toggleBookmark,
  CATEGORIES,
  StudyProgress,
} from "@/lib/study-store";

type ViewMode = "categories" | "questions" | "detail";

export default function StudyScreen() {
  const colors = useColors();
  
  const [viewMode, setViewMode] = useState<ViewMode>("categories");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<StudyProgress | null>(null);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [showMnemonic, setShowMnemonic] = useState(true);

  const loadData = useCallback(async () => {
    const [prog, bm] = await Promise.all([
      getProgress(),
      getBookmarks(),
    ]);
    setProgress(prog);
    setBookmarks(bm);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
    setViewMode("questions");
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const selectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setViewMode("detail");
  };

  const goBack = () => {
    if (viewMode === "detail") {
      setViewMode("questions");
      setSelectedQuestion(null);
    } else if (viewMode === "questions") {
      setViewMode("categories");
      setSelectedCategory(null);
    }
  };

  const handleBookmark = async (questionId: number) => {
    const newBookmarks = await toggleBookmark(questionId);
    setBookmarks(newBookmarks);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Categories View
  if (viewMode === "categories") {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-4 pb-2">
            <Text className="text-3xl font-bold text-foreground">Study Mode</Text>
            <Text className="text-base text-muted mt-1">Browse by category</Text>
          </View>

          {/* Bookmarked Questions */}
          {bookmarks.length > 0 && (
            <Pressable
              onPress={() => {
                setSelectedCategory("Bookmarks");
                setViewMode("questions");
              }}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.warning + '15',
                  borderWidth: 1,
                  borderColor: colors.warning,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              className="mx-5 mt-4 rounded-xl p-4 flex-row items-center justify-between"
            >
              <View className="flex-row items-center">
                <MaterialIcons name="bookmark" size={24} color={colors.warning} />
                <View className="ml-3">
                  <Text className="text-base font-semibold text-foreground">Bookmarked</Text>
                  <Text className="text-sm text-muted">{bookmarks.length} questions saved</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.muted} />
            </Pressable>
          )}

          {/* Categories */}
          <View className="px-5 mt-6">
            <Text className="text-lg font-semibold text-foreground mb-3">Categories</Text>
            {CATEGORIES.map((category) => {
              const categoryQuestions = questions.filter(q => q.category === category);
              const masteredCount = progress ? categoryQuestions.filter(
                q => progress.questionsProgress[q.id]?.correct
              ).length : 0;
              const progressPercent = categoryQuestions.length > 0 
                ? Math.round((masteredCount / categoryQuestions.length) * 100) 
                : 0;
              
              return (
                <Pressable
                  key={category}
                  onPress={() => selectCategory(category)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  className="rounded-xl p-4 mb-3"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center flex-1">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.primary + '20' }}
                      >
                        <MaterialIcons 
                          name={getCategoryIcon(category)} 
                          size={20} 
                          color={colors.primary} 
                        />
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-base font-medium text-foreground">{category}</Text>
                        <Text className="text-sm text-muted">
                          {categoryQuestions.length} questions
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                        {progressPercent}%
                      </Text>
                      <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
                    </View>
                  </View>
                  {/* Progress bar */}
                  <View className="mt-3 h-1.5 bg-border rounded-full overflow-hidden">
                    <View 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${progressPercent}%`,
                        backgroundColor: colors.primary 
                      }}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  // Questions List View
  if (viewMode === "questions") {
    const categoryQuestions = selectedCategory === "Bookmarks"
      ? questions.filter(q => bookmarks.includes(q.id))
      : questions.filter(q => q.category === selectedCategory);

    return (
      <ScreenContainer>
        {/* Header */}
        <View className="px-5 pt-4 pb-3 flex-row items-center">
          <Pressable onPress={goBack} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-bold text-foreground">{selectedCategory}</Text>
            <Text className="text-sm text-muted">{categoryQuestions.length} questions</Text>
          </View>
        </View>

        <FlatList
          data={categoryQuestions}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          renderItem={({ item, index }) => {
            const qProgress = progress?.questionsProgress[item.id];
            const isBookmarked = bookmarks.includes(item.id);
            
            return (
              <Pressable
                onPress={() => selectQuestion(item)}
                style={({ pressed }) => [
                  {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="rounded-xl p-4 mb-3"
              >
                <View className="flex-row items-start">
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: qProgress?.correct 
                        ? colors.success + '20' 
                        : qProgress?.answered 
                          ? colors.error + '20' 
                          : colors.border 
                    }}
                  >
                    {qProgress?.correct ? (
                      <MaterialIcons name="check" size={16} color={colors.success} />
                    ) : qProgress?.answered ? (
                      <MaterialIcons name="close" size={16} color={colors.error} />
                    ) : (
                      <Text className="text-sm text-muted">{index + 1}</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <Text 
                      className="text-base text-foreground leading-5"
                      numberOfLines={2}
                    >
                      {item.paraphrased_question}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      {isBookmarked && (
                        <MaterialIcons name="bookmark" size={16} color={colors.warning} />
                      )}
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color={colors.muted} />
                </View>
              </Pressable>
            );
          }}
        />
      </ScreenContainer>
    );
  }

  // Question Detail View
  if (viewMode === "detail" && selectedQuestion) {
    const isBookmarked = bookmarks.includes(selectedQuestion.id);
    
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Header */}
          <View className="px-5 pt-4 pb-3 flex-row items-center justify-between">
            <Pressable onPress={goBack} className="mr-3">
              <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
            </Pressable>
            <Text className="text-base font-medium text-foreground flex-1">
              Question #{selectedQuestion.id}
            </Text>
            <Pressable onPress={() => handleBookmark(selectedQuestion.id)}>
              <MaterialIcons 
                name={isBookmarked ? "bookmark" : "bookmark-border"} 
                size={28} 
                color={isBookmarked ? colors.warning : colors.muted} 
              />
            </Pressable>
          </View>

          {/* Category Badge */}
          <View className="px-5 mt-2">
            <View 
              className="self-start px-3 py-1 rounded-full"
              style={{ backgroundColor: colors.primary + '20' }}
            >
              <Text className="text-sm font-medium" style={{ color: colors.primary }}>
                {selectedQuestion.category}
              </Text>
            </View>
          </View>

          {/* Question */}
          <View className="px-5 mt-4">
            <Text className="text-xl font-semibold text-foreground leading-7">
              {selectedQuestion.paraphrased_question}
            </Text>
          </View>

          {/* Answer Options */}
          <View className="px-5 mt-6 gap-3">
            {Object.entries(selectedQuestion.options).map(([key, value]) => {
              const isCorrect = key === selectedQuestion.correct_option;
              
              return (
                <View
                  key={key}
                  className="rounded-xl p-4 flex-row items-center"
                  style={{
                    backgroundColor: isCorrect ? colors.success + '20' : colors.surface,
                    borderWidth: 2,
                    borderColor: isCorrect ? colors.success : colors.border,
                  }}
                >
                  <View 
                    className="w-8 h-8 rounded-full items-center justify-center mr-3"
                    style={{ 
                      backgroundColor: isCorrect ? colors.success : colors.border,
                    }}
                  >
                    <Text 
                      className="text-sm font-bold"
                      style={{ color: isCorrect ? colors.background : colors.foreground }}
                    >
                      {key.toUpperCase()}
                    </Text>
                  </View>
                  <Text 
                    className="flex-1 text-base"
                    style={{ color: isCorrect ? colors.success : colors.foreground }}
                  >
                    {value}
                  </Text>
                  {isCorrect && (
                    <MaterialIcons name="check-circle" size={24} color={colors.success} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Explanation */}
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
              <Text className="text-sm text-muted leading-5">
                {selectedQuestion.explanation}
              </Text>
            </View>
          </View>

          {/* Mnemonic */}
          <View className="px-5 mt-4">
            <View 
              className="rounded-xl p-4"
              style={{ 
                backgroundColor: colors.warning + '15',
                borderLeftWidth: 4,
                borderLeftColor: colors.warning,
              }}
            >
              <View className="flex-row items-center mb-2">
                <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                <Text className="text-base font-semibold text-foreground ml-2">
                  Memory Tip
                </Text>
              </View>
              <Text className="text-sm text-foreground italic leading-5">
                {selectedQuestion.mnemonic}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return null;
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
