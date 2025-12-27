import { useState, useRef } from "react";
import { Text, View, Pressable, Dimensions, FlatList, Animated } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { setOnboardingComplete, setSelectedExamDate, EXAM_DATES } from "@/lib/study-store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
};

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to NYS Massage Exam Prep",
      description: "Your comprehensive study companion for the New York State Massage Therapy Licensing Examination.",
      icon: "spa",
      color: colors.primary,
    },
    {
      id: "unique",
      title: "Built for the NYS Exam",
      description: "Unlike generic study apps, we focus specifically on New York's unique requirements - including 20 Eastern Medicine questions that aren't on the MBLEx.",
      icon: "star",
      color: colors.warning,
    },
    {
      id: "features",
      title: "Smart Study Features",
      description: "287 practice questions with clever mnemonics, detailed explanations, progress tracking, and an exam countdown to keep you on schedule.",
      icon: "psychology",
      color: colors.success,
    },
    {
      id: "examdate",
      title: "Select Your Exam Date",
      description: "Choose your target exam date so we can help you create an optimal study plan.",
      icon: "event",
      color: colors.primary,
    },
  ];

  const handleNext = () => {
    if (currentIndex < steps.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handleComplete = async () => {
    if (selectedExam) {
      await setSelectedExamDate(selectedExam);
    }
    await setOnboardingComplete();
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    router.replace("/");
  };

  const renderStep = ({ item, index }: { item: OnboardingStep; index: number }) => {
    if (item.id === "examdate") {
      return (
        <View style={{ width: SCREEN_WIDTH }} className="flex-1 px-8 justify-center">
          <View className="items-center mb-8">
            <View 
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: item.color + '20' }}
            >
              <MaterialIcons name={item.icon as any} size={48} color={item.color} />
            </View>
            <Text className="text-2xl font-bold text-foreground text-center">
              {item.title}
            </Text>
            <Text className="text-base text-muted text-center mt-3 leading-6">
              {item.description}
            </Text>
          </View>

          {/* Exam Date Selection */}
          <View className="mt-4">
            {EXAM_DATES.map((exam) => (
              <Pressable
                key={exam.date}
                onPress={() => {
                  setSelectedExam(exam.date);
                  if (Platform.OS !== "web") {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }
                }}
                style={({ pressed }) => [
                  {
                    backgroundColor: selectedExam === exam.date ? colors.primary + '20' : colors.surface,
                    borderWidth: 2,
                    borderColor: selectedExam === exam.date ? colors.primary : colors.border,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                className="rounded-xl p-4 mb-3 flex-row items-center justify-between"
              >
                <View>
                  <Text className="text-lg font-semibold text-foreground">{exam.label}</Text>
                  <Text className="text-sm text-muted">
                    Application deadline: {new Date(exam.applicationDeadline).toLocaleDateString()}
                  </Text>
                </View>
                {selectedExam === exam.date && (
                  <MaterialIcons name="check-circle" size={28} color={colors.primary} />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={{ width: SCREEN_WIDTH }} className="flex-1 px-8 justify-center items-center">
        <View 
          className="w-32 h-32 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: item.color + '20' }}
        >
          <MaterialIcons name={item.icon as any} size={64} color={item.color} />
        </View>
        <Text className="text-2xl font-bold text-foreground text-center">
          {item.title}
        </Text>
        <Text className="text-base text-muted text-center mt-4 leading-6 px-4">
          {item.description}
        </Text>
      </View>
    );
  };

  const isLastStep = currentIndex === steps.length - 1;

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1">
        {/* Skip Button */}
        {!isLastStep && (
          <View className="absolute top-4 right-4 z-10">
            <Pressable
              onPress={handleComplete}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <Text className="text-base text-muted">Skip</Text>
            </Pressable>
          </View>
        )}

        {/* Content */}
        <FlatList
          ref={flatListRef}
          data={steps}
          renderItem={renderStep}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
        />

        {/* Bottom Section */}
        <View className="px-8 pb-8">
          {/* Dots */}
          <View className="flex-row justify-center mb-6">
            {steps.map((_, index) => (
              <View
                key={index}
                className="w-2 h-2 rounded-full mx-1"
                style={{
                  backgroundColor: index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 24 : 8,
                }}
              />
            ))}
          </View>

          {/* Button */}
          <Pressable
            onPress={isLastStep ? handleComplete : handleNext}
            disabled={isLastStep && !selectedExam}
            style={({ pressed }) => [
              {
                backgroundColor: isLastStep && !selectedExam ? colors.border : colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-center"
          >
            <Text className="text-lg font-semibold" style={{ color: colors.background }}>
              {isLastStep ? "Get Started" : "Continue"}
            </Text>
            {!isLastStep && (
              <MaterialIcons 
                name="arrow-forward" 
                size={24} 
                color={colors.background} 
                style={{ marginLeft: 8 }}
              />
            )}
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}
