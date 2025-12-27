import { useState } from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

type Section = {
  id: string;
  title: string;
  icon: string;
  content: React.ReactNode;
};

export default function ExamInfoScreen() {
  const router = useRouter();
  const colors = useColors();
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");

  const sections: Section[] = [
    {
      id: "overview",
      title: "What is the NYS Massage Exam?",
      icon: "info",
      content: (
        <View>
          <Text className="text-base text-foreground leading-6">
            The New York State Massage Therapy Licensing Examination is a comprehensive test required to practice massage therapy in New York. It is administered by the New York State Education Department (NYSED) and is designed to ensure that candidates have the knowledge and skills necessary to provide safe and effective massage therapy.
          </Text>
          <View className="mt-4 bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm font-semibold text-foreground mb-2">Key Facts:</Text>
            <Text className="text-sm text-muted">• 140 multiple choice questions</Text>
            <Text className="text-sm text-muted">• Includes 20 Eastern Medicine questions</Text>
            <Text className="text-sm text-muted">• Paper-based examination</Text>
            <Text className="text-sm text-muted">• Offered twice per year (March & September)</Text>
            <Text className="text-sm text-muted">• Requires 1,000 hours of education</Text>
          </View>
        </View>
      ),
    },
    {
      id: "differences",
      title: "NYS Exam vs MBLEx",
      icon: "compare-arrows",
      content: (
        <View>
          <Text className="text-base text-foreground leading-6 mb-4">
            Unlike most states that accept the MBLEx (Massage & Bodywork Licensing Examination), New York requires its own state-specific exam. Here are the key differences:
          </Text>
          
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <View className="flex-row bg-border">
              <View className="flex-1 p-3">
                <Text className="text-sm font-semibold text-foreground">Aspect</Text>
              </View>
              <View className="flex-1 p-3 border-l border-border">
                <Text className="text-sm font-semibold text-foreground">NYS Exam</Text>
              </View>
              <View className="flex-1 p-3 border-l border-border">
                <Text className="text-sm font-semibold text-foreground">MBLEx</Text>
              </View>
            </View>
            
            {[
              { aspect: "Frequency", nys: "2x/year", mblex: "Year-round" },
              { aspect: "Format", nys: "Paper", mblex: "Computer" },
              { aspect: "Questions", nys: "140", mblex: "100" },
              { aspect: "Eastern Med", nys: "20 questions", mblex: "Minimal" },
              { aspect: "Results", nys: "Weeks", mblex: "Immediate" },
              { aspect: "Location", nys: "NY only", mblex: "Nationwide" },
            ].map((row, index) => (
              <View key={index} className="flex-row border-t border-border">
                <View className="flex-1 p-3">
                  <Text className="text-sm text-foreground">{row.aspect}</Text>
                </View>
                <View className="flex-1 p-3 border-l border-border">
                  <Text className="text-sm text-muted">{row.nys}</Text>
                </View>
                <View className="flex-1 p-3 border-l border-border">
                  <Text className="text-sm text-muted">{row.mblex}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      id: "difficulty",
      title: "Why It's Challenging",
      icon: "trending-up",
      content: (
        <View>
          <Text className="text-base text-foreground leading-6 mb-4">
            The NYS Massage Therapy Exam is considered one of the most challenging licensing exams in the country. Here's why:
          </Text>
          
          {[
            {
              title: "Eastern Medicine Requirement",
              description: "20 questions on meridians, acupressure, Yin/Yang theory, and TCM concepts - topics many Western-trained therapists struggle with.",
              icon: "self-improvement",
            },
            {
              title: "Limited Test Opportunities",
              description: "Only 2 chances per year. Missing an exam means waiting 6 months for the next opportunity.",
              icon: "event",
            },
            {
              title: "Paper-Based Format",
              description: "No ability to easily flag and return to questions. Must manage time without computer aids.",
              icon: "description",
            },
            {
              title: "Higher Education Requirement",
              description: "NYS requires 1,000 hours of training - one of the highest in the US (many states require only 500-750 hours).",
              icon: "school",
            },
            {
              title: "Treatment Planning Focus",
              description: "27% of the exam focuses on developing treatment plans - requires critical thinking, not just memorization.",
              icon: "assignment",
            },
            {
              title: "NY-Specific Regulations",
              description: "Must know NYS massage therapy laws, advertising rules, and scope of practice specifics.",
              icon: "gavel",
            },
          ].map((item, index) => (
            <View 
              key={index} 
              className="flex-row mb-4"
            >
              <View 
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.error + '20' }}
              >
                <MaterialIcons name={item.icon as any} size={20} color={colors.error} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.title}</Text>
                <Text className="text-sm text-muted mt-1 leading-5">{item.description}</Text>
              </View>
            </View>
          ))}
        </View>
      ),
    },
    {
      id: "content",
      title: "Exam Content Breakdown",
      icon: "pie-chart",
      content: (
        <View>
          <Text className="text-base text-foreground leading-6 mb-4">
            The exam is divided into four main content areas (effective March 2025):
          </Text>
          
          {[
            { area: "Professional Standards & Practices", percent: 30, questions: 43, color: colors.primary },
            { area: "Application of Treatment Skills", percent: 28, questions: 39, color: colors.success },
            { area: "Development of Treatment Plan", percent: 27, questions: 37, color: colors.warning },
            { area: "Assessment & Evaluation", percent: 15, questions: 21, color: colors.error },
          ].map((item, index) => (
            <View key={index} className="mb-4">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-sm text-foreground flex-1">{item.area}</Text>
                <Text className="text-sm font-semibold" style={{ color: item.color }}>
                  {item.percent}%
                </Text>
              </View>
              <View className="h-3 bg-border rounded-full overflow-hidden">
                <View 
                  className="h-full rounded-full"
                  style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                />
              </View>
              <Text className="text-xs text-muted mt-1">{item.questions} questions</Text>
            </View>
          ))}
        </View>
      ),
    },
    {
      id: "examday",
      title: "What to Expect on Exam Day",
      icon: "event-available",
      content: (
        <View>
          <Text className="text-lg font-semibold text-foreground mb-3">Before the Exam</Text>
          <View className="bg-surface rounded-xl p-4 border border-border mb-4">
            <Text className="text-sm text-muted">• Arrive 30 minutes early</Text>
            <Text className="text-sm text-muted">• Bring valid photo ID</Text>
            <Text className="text-sm text-muted">• Bring admission ticket/confirmation</Text>
            <Text className="text-sm text-muted">• No electronic devices allowed</Text>
            <Text className="text-sm text-muted">• No study materials in testing room</Text>
          </View>
          
          <Text className="text-lg font-semibold text-foreground mb-3">During the Exam</Text>
          <View className="bg-surface rounded-xl p-4 border border-border mb-4">
            <Text className="text-sm text-muted">• Read each question carefully</Text>
            <Text className="text-sm text-muted">• Manage your time (~1.3 min per question)</Text>
            <Text className="text-sm text-muted">• Answer every question (no penalty for guessing)</Text>
            <Text className="text-sm text-muted">• Review answers if time permits</Text>
          </View>
          
          <Text className="text-lg font-semibold text-foreground mb-3">After the Exam</Text>
          <View className="bg-surface rounded-xl p-4 border border-border">
            <Text className="text-sm text-muted">• Results mailed within several weeks</Text>
            <Text className="text-sm text-muted">• Passing score required for licensure</Text>
            <Text className="text-sm text-muted">• If failed, can retake at next scheduled exam</Text>
          </View>
        </View>
      ),
    },
    {
      id: "tips",
      title: "Study Tips for Success",
      icon: "lightbulb",
      content: (
        <View>
          {[
            { tip: "Start Early", detail: "Begin studying at least 3-4 months before exam date" },
            { tip: "Focus on Weak Areas", detail: "Use practice tests to identify gaps in your knowledge" },
            { tip: "Master Eastern Medicine", detail: "Don't neglect the 20 TCM questions - they're unique to NYS" },
            { tip: "Know NY Law", detail: "Review advertising rules, scope of practice, record keeping" },
            { tip: "Practice Treatment Planning", detail: "Work through case scenarios and develop assessment skills" },
            { tip: "Use Mnemonics", detail: "Memory aids help retain anatomical details and concepts" },
            { tip: "Simulate Exam Conditions", detail: "Practice with timed paper tests to build stamina" },
          ].map((item, index) => (
            <View 
              key={index}
              className="flex-row items-start mb-4"
            >
              <View 
                className="w-8 h-8 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.success + '20' }}
              >
                <Text className="text-sm font-bold" style={{ color: colors.success }}>
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">{item.tip}</Text>
                <Text className="text-sm text-muted mt-1">{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      ),
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-foreground">NYS Massage Exam</Text>
            <Text className="text-base text-muted">Everything you need to know</Text>
          </View>
        </View>

        {/* Sections */}
        <View className="px-5 mt-4">
          {sections.map((section) => {
            const isExpanded = expandedSection === section.id;
            
            return (
              <View key={section.id} className="mb-3">
                <Pressable
                  onPress={() => setExpandedSection(isExpanded ? null : section.id)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: isExpanded ? colors.primary : colors.border,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  className="rounded-xl p-4 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center flex-1">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: colors.primary + '20' }}
                    >
                      <MaterialIcons name={section.icon as any} size={20} color={colors.primary} />
                    </View>
                    <Text className="text-base font-medium text-foreground flex-1">
                      {section.title}
                    </Text>
                  </View>
                  <MaterialIcons 
                    name={isExpanded ? "expand-less" : "expand-more"} 
                    size={24} 
                    color={colors.muted} 
                  />
                </Pressable>
                
                {isExpanded && (
                  <View 
                    className="mt-2 p-4 rounded-xl"
                    style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
                  >
                    {section.content}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* CTA */}
        <View className="px-5 mt-6">
          <Pressable
            onPress={() => router.push("/quiz" as any)}
            style={({ pressed }) => [
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            className="rounded-xl p-4 flex-row items-center justify-center"
          >
            <MaterialIcons name="play-arrow" size={24} color={colors.background} />
            <Text className="text-lg font-semibold ml-2" style={{ color: colors.background }}>
              Start Practicing
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
