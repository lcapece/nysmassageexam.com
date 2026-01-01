import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, Pressable, FlatList, Platform, useWindowDimensions, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { Container, useIsDesktop } from "@/components/desktop/container";
import { Card } from "@/components/desktop/card";
import { Button } from "@/components/desktop/button";
import { Badge } from "@/components/desktop/badge";
import { AppShell } from "@/components/desktop/nav";
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
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();

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

  // DESKTOP LAYOUTS
  if (isDesktop) {
    // Desktop Categories View
    if (viewMode === "categories") {
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
                <Text style={{ fontSize: 32, fontWeight: '700', color: colors.foreground }}>
                  Study Mode
                </Text>
                <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>
                  Browse and learn from all questions by category
                </Text>
              </View>

              {/* Stats Overview */}
              <View style={{ flexDirection: 'row', gap: 20, marginBottom: 32 }}>
                <Card style={{ flex: 1, padding: 24 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: colors.primaryMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MaterialIcons name="quiz" size={28} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.foreground }}>
                        {questions.length}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Total Questions</Text>
                    </View>
                  </View>
                </Card>

                <Card style={{ flex: 1, padding: 24 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: colors.successMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MaterialIcons name="check-circle" size={28} color={colors.success} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.foreground }}>
                        {progress?.totalCorrect || 0}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Mastered</Text>
                    </View>
                  </View>
                </Card>

                <Card style={{ flex: 1, padding: 24 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <View style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      backgroundColor: colors.warningMuted,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <MaterialIcons name="bookmark" size={28} color={colors.warning} />
                    </View>
                    <View>
                      <Text style={{ fontSize: 28, fontWeight: '700', color: colors.foreground }}>
                        {bookmarks.length}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.muted }}>Bookmarked</Text>
                    </View>
                  </View>
                </Card>
              </View>

              {/* Bookmarked Section */}
              {bookmarks.length > 0 && (
                <Pressable
                  onPress={() => {
                    setSelectedCategory("Bookmarks");
                    setViewMode("questions");
                  }}
                  style={{ marginBottom: 24 }}
                >
                  {({ hovered }: any) => (
                    <Card
                      style={{
                        padding: 24,
                        borderWidth: 2,
                        borderColor: colors.warning,
                        backgroundColor: hovered ? colors.surfaceHover : colors.surface,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                          <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            backgroundColor: colors.warningMuted,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <MaterialIcons name="bookmark" size={24} color={colors.warning} />
                          </View>
                          <View>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground }}>
                              Bookmarked Questions
                            </Text>
                            <Text style={{ fontSize: 14, color: colors.muted }}>
                              {bookmarks.length} questions saved for review
                            </Text>
                          </View>
                        </View>
                        <MaterialIcons name="arrow-forward" size={24} color={colors.warning} />
                      </View>
                    </Card>
                  )}
                </Pressable>
              )}

              {/* Categories Grid */}
              <Text style={{ fontSize: 20, fontWeight: '600', color: colors.foreground, marginBottom: 16 }}>
                Browse by Category
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
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
                      style={{ width: 'calc(50% - 8px)' } as any}
                    >
                      {({ hovered, pressed }: any) => (
                        <Card
                          style={{
                            padding: 24,
                            backgroundColor: hovered ? colors.surfaceHover : colors.surface,
                            transform: [{ scale: pressed ? 0.99 : 1 }],
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <View style={{
                              width: 48,
                              height: 48,
                              borderRadius: 12,
                              backgroundColor: colors.primaryMuted,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <MaterialIcons name={getCategoryIcon(category)} size={24} color={colors.primary} />
                            </View>
                            <Badge variant={progressPercent >= 75 ? 'success' : progressPercent >= 25 ? 'warning' : 'default'}>
                              {progressPercent}%
                            </Badge>
                          </View>
                          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.foreground, marginTop: 16 }}>
                            {category}
                          </Text>
                          <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
                            {categoryQuestions.length} questions • {masteredCount} mastered
                          </Text>
                          <View style={{ marginTop: 16, height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' }}>
                            <View
                              style={{
                                height: '100%',
                                width: `${progressPercent}%`,
                                backgroundColor: progressPercent >= 75 ? colors.success : progressPercent >= 25 ? colors.warning : colors.primary,
                                borderRadius: 3,
                              }}
                            />
                          </View>
                        </Card>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </Container>
          </ScrollView>
        </AppShell>
      );
    }

    // Desktop Questions List View
    if (viewMode === "questions") {
      const categoryQuestions = selectedCategory === "Bookmarks"
        ? questions.filter(q => bookmarks.includes(q.id))
        : questions.filter(q => q.category === selectedCategory);

      return (
        <AppShell>
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <Container>
              {/* Header */}
              <View style={{ paddingTop: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Pressable
                  onPress={goBack}
                  style={({ hovered }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: hovered ? colors.surfaceHover : 'transparent',
                    marginRight: 16,
                  })}
                >
                  <MaterialIcons name="arrow-back" size={20} color={colors.muted} />
                  <Text style={{ fontSize: 14, color: colors.muted }}>Back</Text>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: colors.foreground }}>
                    {selectedCategory}
                  </Text>
                  <Text style={{ fontSize: 14, color: colors.muted }}>
                    {categoryQuestions.length} questions
                  </Text>
                </View>
              </View>
            </Container>

            {/* Split View: List + Detail */}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              {/* Questions List */}
              <ScrollView
                style={{ width: selectedQuestion ? 400 : '100%', borderRightWidth: selectedQuestion ? 1 : 0, borderRightColor: colors.border }}
                contentContainerStyle={{ padding: 16 }}
              >
                {categoryQuestions.map((item, index) => {
                  const qProgress = progress?.questionsProgress[item.id];
                  const isBookmarked = bookmarks.includes(item.id);
                  const isSelected = selectedQuestion?.id === item.id;

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => selectQuestion(item)}
                    >
                      {({ hovered }: any) => (
                        <View
                          style={{
                            padding: 16,
                            marginBottom: 8,
                            borderRadius: 12,
                            backgroundColor: isSelected ? colors.primaryMuted : hovered ? colors.surfaceHover : colors.surface,
                            borderWidth: 1,
                            borderColor: isSelected ? colors.primary : colors.border,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                            <View
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                                backgroundColor: qProgress?.correct
                                  ? colors.successMuted
                                  : qProgress?.answered
                                    ? colors.errorMuted
                                    : colors.border,
                              }}
                            >
                              {qProgress?.correct ? (
                                <MaterialIcons name="check" size={16} color={colors.success} />
                              ) : qProgress?.answered ? (
                                <MaterialIcons name="close" size={16} color={colors.error} />
                              ) : (
                                <Text style={{ fontSize: 12, color: colors.muted }}>{index + 1}</Text>
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text
                                style={{ fontSize: 14, color: colors.foreground, lineHeight: 20 }}
                                numberOfLines={2}
                              >
                                {item.rewrite_question}
                              </Text>
                              {isBookmarked && (
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                                  <MaterialIcons name="bookmark" size={14} color={colors.warning} />
                                  <Text style={{ fontSize: 12, color: colors.warning, marginLeft: 4 }}>Bookmarked</Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Question Detail Panel (Desktop) */}
              {selectedQuestion && (
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 32 }}>
                  {/* Question Header */}
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                    <View style={{ flex: 1 }}>
                      <Badge variant="primary" size="md">{selectedQuestion.category}</Badge>
                      <Text style={{ fontSize: 12, color: colors.muted, marginTop: 8 }}>
                        Question #{selectedQuestion.id}
                      </Text>
                    </View>
                    <Pressable onPress={() => handleBookmark(selectedQuestion.id)}>
                      {({ hovered }: any) => (
                        <View style={{
                          padding: 8,
                          borderRadius: 8,
                          backgroundColor: hovered ? colors.surfaceHover : 'transparent',
                        }}>
                          <MaterialIcons
                            name={bookmarks.includes(selectedQuestion.id) ? "bookmark" : "bookmark-border"}
                            size={28}
                            color={bookmarks.includes(selectedQuestion.id) ? colors.warning : colors.muted}
                          />
                        </View>
                      )}
                    </Pressable>
                  </View>

                  {/* Question Text */}
                  <Text style={{ fontSize: 22, fontWeight: '600', color: colors.foreground, lineHeight: 32, marginBottom: 28 }}>
                    {selectedQuestion.rewrite_question}
                  </Text>

                  {/* Answer Options */}
                  <View style={{ gap: 12, marginBottom: 28 }}>
                    {Object.entries(selectedQuestion.options).map(([key, value]) => {
                      const isCorrect = key === selectedQuestion.correct_option;

                      return (
                        <View
                          key={key}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            borderRadius: 12,
                            backgroundColor: isCorrect ? colors.successMuted : colors.surface,
                            borderWidth: 2,
                            borderColor: isCorrect ? colors.success : colors.border,
                          }}
                        >
                          <View
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 18,
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: 16,
                              backgroundColor: isCorrect ? colors.success : colors.border,
                            }}
                          >
                            <Text style={{ fontSize: 14, fontWeight: '700', color: isCorrect ? '#FFFFFF' : colors.foreground }}>
                              {key.toUpperCase()}
                            </Text>
                          </View>
                          <Text style={{ flex: 1, fontSize: 16, color: isCorrect ? colors.success : colors.foreground }}>
                            {value}
                          </Text>
                          {isCorrect && <MaterialIcons name="check-circle" size={24} color={colors.success} />}
                        </View>
                      );
                    })}
                  </View>

                  {/* Explanation Card */}
                  <Card style={{ padding: 24, marginBottom: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <MaterialIcons name="info" size={20} color={colors.primary} />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                        Explanation
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 22 }}>
                      {selectedQuestion.topic_explanation}
                    </Text>
                  </Card>

                  {/* Mnemonic Card */}
                  <Card style={{ padding: 24, borderLeftWidth: 4, borderLeftColor: colors.warning }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                        Memory Tip
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: colors.foreground, fontStyle: 'italic', lineHeight: 22 }}>
                      {selectedQuestion.mnemonic}
                    </Text>
                  </Card>

                  {/* Visual Diagram */}
                  {selectedQuestion.image_url && (
                    <Card style={{ padding: 24, marginTop: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <MaterialIcons name="image" size={20} color={colors.primary} />
                        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground }}>
                          Visual Aid
                        </Text>
                      </View>
                      <Image
                        source={{ uri: selectedQuestion.image_url }}
                        style={{ width: '100%', height: 300, borderRadius: 12 }}
                        resizeMode="contain"
                      />
                    </Card>
                  )}
                </ScrollView>
              )}
            </View>
          </View>
        </AppShell>
      );
    }

    // Desktop Detail View (standalone, for when coming from a link)
    if (viewMode === "detail" && selectedQuestion) {
      const isBookmarked = bookmarks.includes(selectedQuestion.id);

      return (
        <AppShell>
          <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: 48 }}>
            <Container>
              {/* Header */}
              <View style={{ paddingTop: 24, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                <Pressable
                  onPress={goBack}
                  style={({ hovered }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: hovered ? colors.surfaceHover : 'transparent',
                    marginRight: 16,
                  })}
                >
                  <MaterialIcons name="arrow-back" size={20} color={colors.muted} />
                  <Text style={{ fontSize: 14, color: colors.muted }}>Back to {selectedCategory}</Text>
                </Pressable>
              </View>

              {/* Question Content */}
              <Card style={{ padding: 32, maxWidth: 800 }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                  <Badge variant="primary" size="md">{selectedQuestion.category}</Badge>
                  <Pressable onPress={() => handleBookmark(selectedQuestion.id)}>
                    <MaterialIcons
                      name={isBookmarked ? "bookmark" : "bookmark-border"}
                      size={28}
                      color={isBookmarked ? colors.warning : colors.muted}
                    />
                  </Pressable>
                </View>

                <Text style={{ fontSize: 24, fontWeight: '600', color: colors.foreground, lineHeight: 34, marginBottom: 32 }}>
                  {selectedQuestion.rewrite_question}
                </Text>

                <View style={{ gap: 12, marginBottom: 32 }}>
                  {Object.entries(selectedQuestion.options).map(([key, value]) => {
                    const isCorrect = key === selectedQuestion.correct_option;
                    return (
                      <View
                        key={key}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 16,
                          borderRadius: 12,
                          backgroundColor: isCorrect ? colors.successMuted : colors.surface,
                          borderWidth: 2,
                          borderColor: isCorrect ? colors.success : colors.border,
                        }}
                      >
                        <View style={{
                          width: 36,
                          height: 36,
                          borderRadius: 18,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16,
                          backgroundColor: isCorrect ? colors.success : colors.border,
                        }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: isCorrect ? '#FFFFFF' : colors.foreground }}>
                            {key.toUpperCase()}
                          </Text>
                        </View>
                        <Text style={{ flex: 1, fontSize: 16, color: isCorrect ? colors.success : colors.foreground }}>
                          {value}
                        </Text>
                        {isCorrect && <MaterialIcons name="check-circle" size={24} color={colors.success} />}
                      </View>
                    );
                  })}
                </View>

                <View style={{ padding: 20, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginBottom: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialIcons name="info" size={20} color={colors.primary} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginLeft: 8 }}>Explanation</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 22 }}>
                    {selectedQuestion.topic_explanation}
                  </Text>
                </View>

                <View style={{ padding: 20, backgroundColor: colors.warningMuted, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: colors.warning }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <MaterialIcons name="lightbulb" size={20} color={colors.warning} />
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginLeft: 8 }}>Memory Tip</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.foreground, fontStyle: 'italic', lineHeight: 22 }}>
                    {selectedQuestion.mnemonic}
                  </Text>
                </View>

                {/* Visual Diagram - Desktop Standalone */}
                {selectedQuestion.image_url && (
                  <View style={{ padding: 20, backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, marginTop: 16 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                      <MaterialIcons name="image" size={20} color={colors.primary} />
                      <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginLeft: 8 }}>Visual Aid</Text>
                    </View>
                    <Image
                      source={{ uri: selectedQuestion.image_url }}
                      style={{ width: '100%', height: 300, borderRadius: 12 }}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </Card>
            </Container>
          </ScrollView>
        </AppShell>
      );
    }
  }

  // MOBILE LAYOUTS

  // Mobile Categories View
  if (viewMode === "categories") {
    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="px-5 pt-4 pb-2">
            <Text className="text-3xl font-bold text-foreground">Study Mode</Text>
            <Text className="text-base text-muted mt-1">Browse by category</Text>
          </View>

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

  // Mobile Questions List View
  if (viewMode === "questions") {
    const categoryQuestions = selectedCategory === "Bookmarks"
      ? questions.filter(q => bookmarks.includes(q.id))
      : questions.filter(q => q.category === selectedCategory);

    return (
      <ScreenContainer>
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
                      {item.rewrite_question}
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

  // Mobile Question Detail View
  if (viewMode === "detail" && selectedQuestion) {
    const isBookmarked = bookmarks.includes(selectedQuestion.id);

    return (
      <ScreenContainer>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
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

          <View className="px-5 mt-4">
            <Text className="text-xl font-semibold text-foreground leading-7">
              {selectedQuestion.rewrite_question}
            </Text>
          </View>

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
                {selectedQuestion.topic_explanation}
              </Text>
            </View>
          </View>

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

          {/* Visual Diagram - Mobile */}
          {selectedQuestion.image_url && (
            <View className="px-5 mt-4">
              <View
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                }}
              >
                <View className="flex-row items-center mb-3">
                  <MaterialIcons name="image" size={20} color={colors.primary} />
                  <Text className="text-base font-semibold text-foreground ml-2">
                    Visual Aid
                  </Text>
                </View>
                <Image
                  source={{ uri: selectedQuestion.image_url }}
                  style={{ width: '100%', height: 250, borderRadius: 12 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          )}
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
