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

type Article = {
  id: string;
  title: string;
  readTime: string;
  icon: string;
  content: string;
};

const READING_ARTICLES: Article[] = [
  {
    id: "nys-vs-mblex",
    title: "How the NYS Massage Exam Differs from the National MBLEx",
    readTime: "4 min read",
    icon: "compare-arrows",
    content: `If you've studied for the MBLEx or heard about it from colleagues in other states, you might assume the New York State massage licensing exam is similar. It's not. Understanding these differences is critical to passing on your first attempt.

The most significant difference is content. While the MBLEx focuses almost exclusively on Western massage principles, the NYS exam dedicates approximately 14% of its questions (20 out of 140) to Eastern medicine concepts. This includes Traditional Chinese Medicine theory, the 12 primary meridians, acupressure points, Yin/Yang theory, and the Five Element system. Many candidates who breezed through MBLEx preparation find themselves struggling with these unfamiliar concepts.

The format also differs substantially. The MBLEx is a computer-adaptive test available year-round at Pearson VUE testing centers nationwide. You receive your results immediately upon completion. The NYS exam, by contrast, is a paper-based test offered only twice per year in March and September, exclusively in New York State. Results take several weeks to arrive by mail.

Question count and timing vary as well. The MBLEx contains 100 questions with a two-hour time limit. The NYS exam has 140 questions, requiring better time management and stamina. The longer format can lead to fatigue-related errors if you're not prepared.

Perhaps most importantly, there's no reciprocity. Passing the MBLEx doesn't qualify you to practice in New York, and passing the NYS exam doesn't automatically transfer to MBLEx states. Each credential stands alone.`
  },
  {
    id: "eastern-medicine",
    title: "Mastering the Eastern Medicine Section: Your 20-Question Strategy",
    readTime: "5 min read",
    icon: "self-improvement",
    content: `The Eastern medicine section is where most NYS massage exam candidates lose critical points. With 20 questions worth roughly 14% of your total score, neglecting this content area can mean the difference between passing and waiting six months for another attempt.

Start by understanding the foundational concepts. Yin and Yang aren't just abstract philosophy—they're the basis for understanding how TCM views the body. Yin represents cold, passive, interior, and descending qualities. Yang represents hot, active, exterior, and ascending qualities. Every organ, meridian, and treatment approach in TCM relates back to balancing these forces.

The Five Element theory (Wood, Fire, Earth, Metal, Water) is equally essential. Each element corresponds to specific organs, emotions, seasons, colors, and body tissues. For example, Wood relates to the Liver and Gallbladder, the emotion of anger, spring season, and the tendons. Creating mnemonic devices for these associations will save you during the exam.

Learn the 12 primary meridians systematically. Know their pathways, their associated organs, and their Yin or Yang classification. The Lung, Spleen, Heart, Kidney, Pericardium, and Liver meridians are Yin. The Large Intestine, Stomach, Small Intestine, Bladder, Triple Warmer, and Gallbladder meridians are Yang.

Key acupressure points appear frequently on the exam. Focus on commonly tested points like LI4 (Hegu), ST36 (Zusanli), SP6 (Sanyinjiao), and GB20 (Fengchi). Know their locations and therapeutic applications.

Practice with Eastern medicine-specific questions daily in the weeks before your exam. What feels foreign initially becomes second nature with consistent exposure.`
  },
  {
    id: "pass-rate-reality",
    title: "The Truth About NYS Massage Exam Pass Rates and What It Means for You",
    readTime: "4 min read",
    icon: "analytics",
    content: `Let's address the elephant in the room: the NYS massage therapy exam has a reputation for being difficult, and that reputation is earned. While official pass rate statistics aren't publicly published by NYSED, anecdotal evidence from massage schools and candidates suggests first-time pass rates hover between 60-75%, depending on the exam administration.

What does this mean for you? First, it means you're not alone if you're feeling anxious. The exam is designed to be challenging, ensuring that licensed massage therapists in New York meet a high standard of knowledge. Second, it means preparation isn't optional—it's essential.

The candidates who fail typically share common characteristics. They underestimate the Eastern medicine section, assuming their Western training is sufficient. They don't practice with the paper-based format, losing valuable time on exam day. They cram in the final weeks rather than studying consistently over months. They neglect the treatment planning questions, which require applied critical thinking rather than memorization.

The candidates who pass take a different approach. They begin studying 3-4 months before the exam date. They identify their weak areas early through practice tests and focus their efforts there. They treat Eastern medicine as seriously as anatomy and physiology. They practice time management with full-length mock exams. They use memory techniques like mnemonics and visualization to retain complex information.

If you fail, you can retake the exam at the next administration (six months later). While this is frustrating, use that time productively to address your specific weaknesses rather than simply reviewing the same material the same way.`
  },
  {
    id: "treatment-planning",
    title: "Conquering the Treatment Planning Section: Beyond Memorization",
    readTime: "4 min read",
    icon: "assignment",
    content: `The treatment planning section comprises 27% of the NYS massage exam—approximately 37 questions. Unlike anatomy questions where you either know the answer or you don't, treatment planning questions require you to synthesize information and make clinical decisions. This is where critical thinking separates passing candidates from those who fall short.

Treatment planning questions typically present a client scenario and ask what you would do. For example: "A 45-year-old office worker presents with chronic tension headaches, forward head posture, and reports sitting at a computer 8 hours daily. Which treatment approach is MOST appropriate?" The answer requires understanding postural assessment, muscle imbalances, and appropriate techniques—then selecting the best option among several reasonable-sounding choices.

To excel in this section, think like a practicing therapist, not a student. When reading a scenario, mentally walk through your assessment process. What muscles are likely involved? What are the contraindications? What techniques address the root cause versus just the symptoms? What would you prioritize in a 60-minute session?

Learn to recognize red flags and contraindications. Many treatment planning questions test whether you can identify when massage is inappropriate or when modifications are needed. Fever, acute inflammation, certain medications, and specific conditions all require recognition and appropriate response.

Practice case studies regularly. Create or find scenarios and practice developing treatment plans before looking at the answers. This active engagement builds the clinical reasoning skills the exam tests.

Pay attention to qualifying words in questions and answers. "Most appropriate," "first priority," and "best approach" all signal that multiple answers might be partially correct, but one is superior. Read all options before selecting your answer.`
  },
  {
    id: "exam-day-psychology",
    title: "Exam Day Psychology: Managing Anxiety and Maximizing Performance",
    readTime: "4 min read",
    icon: "psychology",
    content: `Your mental state on exam day can add or subtract points from your score. Candidates who manage test anxiety effectively often outperform those with superior knowledge who let nerves derail their performance. Here's how to optimize your psychological approach.

The night before the exam, stop studying. Seriously. Last-minute cramming increases anxiety without meaningfully improving retention. Instead, prepare everything you'll need: photo ID, admission confirmation, directions to the testing location, comfortable clothing, and any allowed materials. Go to bed at your normal time rather than artificially early, which often leads to anxious wakefulness.

On exam morning, eat a balanced breakfast with protein and complex carbohydrates—nothing too heavy or unfamiliar that might cause digestive distress. Arrive 30 minutes early to allow time for check-in and settling in without rushing. Visit the restroom before entering the testing room.

When you receive your exam, don't immediately dive in. Take 30 seconds to breathe deeply and ground yourself. Remind yourself that you've prepared for this and that moderate anxiety actually enhances performance.

Read each question completely, including all answer choices, before selecting your response. Your first instinct is often correct, so don't change answers unless you have a concrete reason. If you encounter a difficult question, mark it (if allowed) and move on—don't let one question consume disproportionate time and mental energy.

Monitor your pace. With 140 questions, you have roughly one minute per question. Every 30-40 questions, check the clock to ensure you're on track. If you're falling behind, pick up the pace on questions you know well.

During the exam, if anxiety spikes, use grounding techniques. Feel your feet on the floor. Take three slow breaths. Remind yourself that this feeling is temporary and manageable. Then return your focus to the next question.`
  },
];

export default function ExamInfoScreen() {
  const router = useRouter();
  const colors = useColors();
  const [expandedSection, setExpandedSection] = useState<string | null>("overview");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

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

        {/* Important Reading Topics Section */}
        <View className="px-5 mt-8">
          <View className="flex-row items-center mb-4">
            <View
              className="w-10 h-10 rounded-full items-center justify-center mr-3"
              style={{ backgroundColor: colors.warning + '20' }}
            >
              <MaterialIcons name="menu-book" size={20} color={colors.warning} />
            </View>
            <View>
              <Text className="text-xl font-bold text-foreground">Important Reading Topics</Text>
              <Text className="text-sm text-muted">In-depth guides to help you pass</Text>
            </View>
          </View>

          {READING_ARTICLES.map((article) => {
            const isExpanded = expandedArticle === article.id;

            return (
              <View key={article.id} className="mb-3">
                <Pressable
                  onPress={() => setExpandedArticle(isExpanded ? null : article.id)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: isExpanded ? colors.warning : colors.border,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  className="rounded-xl p-4"
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-start flex-1">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5"
                        style={{ backgroundColor: colors.warning + '20' }}
                      >
                        <MaterialIcons name={article.icon as any} size={20} color={colors.warning} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-medium text-foreground leading-5">
                          {article.title}
                        </Text>
                        <Text className="text-xs text-muted mt-1">{article.readTime}</Text>
                      </View>
                    </View>
                    <MaterialIcons
                      name={isExpanded ? "expand-less" : "expand-more"}
                      size={24}
                      color={colors.muted}
                    />
                  </View>
                </Pressable>

                {isExpanded && (
                  <View
                    className="mt-2 p-5 rounded-xl"
                    style={{
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.warning,
                      borderLeftWidth: 4,
                    }}
                  >
                    <Text className="text-sm text-foreground leading-6" style={{ lineHeight: 24 }}>
                      {article.content}
                    </Text>
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

        {/* Footer */}
        <View className="px-5 mt-8 mb-4">
          <Text className="text-xs text-muted text-center">
            Created by DataAutomation.ai
          </Text>
          <Text className="text-xs text-muted text-center mt-1">
            © 2026 All Rights Reserved
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
