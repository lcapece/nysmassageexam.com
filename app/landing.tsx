import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { getLoginUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";

// Exam dates
const EXAM_DATES = [
  { date: new Date("2026-03-06"), label: "March 6, 2026", applicationDeadline: "November 1, 2025" },
  { date: new Date("2026-09-18"), label: "September 18, 2026", applicationDeadline: "June 1, 2026" },
];

// USPs
const USP_LIST = [
  {
    icon: "🎯",
    title: "Built for NYS, Not MBLEx",
    description: "Specifically designed for the New York State exam—the only state that requires its own licensing test separate from the national MBLEx.",
  },
  {
    icon: "💰",
    title: "Money-Back Guarantee",
    description: "Pass the exam or get your money back. We're that confident in our study system.",
  },
  {
    icon: "🧠",
    title: "Innovative Mnemonics",
    description: "Every question includes clever memory aids—rhymes, visualizations, and physical comparisons that actually stick.",
  },
  {
    icon: "👩‍⚕️",
    title: "Expert Co-Design",
    description: "Created with a NY State licensed massage therapist who actually sat for and passed this exam.",
  },
  {
    icon: "📊",
    title: "Multiple Study Modes",
    description: "Progressive difficulty, custom pacing, weakness targeting, and last-minute procrastinator's mode.",
  },
  {
    icon: "📱",
    title: "Study Anywhere",
    description: "Works on iPhone, iPad, Android, and web. Your progress syncs across all devices.",
  },
  {
    icon: "📚",
    title: "287 Curated Questions",
    description: "Comprehensive coverage of all exam topics including the unique Eastern Medicine section required only by NYS.",
  },
  {
    icon: "⏱️",
    title: "Timed Practice Tests",
    description: "Simulate real exam conditions with our timed practice mode to build your test-taking stamina.",
  },
  {
    icon: "📈",
    title: "Progress Analytics",
    description: "Track your improvement over time with detailed statistics and identify areas that need more attention.",
  },
  {
    icon: "🔄",
    title: "Spaced Repetition",
    description: "Our smart algorithm resurfaces questions you got wrong at optimal intervals for maximum retention.",
  },
];

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <View className="flex-row justify-center gap-3">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hours" },
        { value: timeLeft.minutes, label: "Min" },
        { value: timeLeft.seconds, label: "Sec" },
      ].map((item, index) => (
        <View key={index} className="items-center">
          <View className="bg-surface rounded-xl px-4 py-3 min-w-[70px] items-center border border-border">
            <Text className="text-3xl font-bold text-primary">
              {String(item.value).padStart(2, "0")}
            </Text>
          </View>
          <Text className="text-xs text-muted mt-1">{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

export default function LandingScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated, loading } = useAuth();

  // Find the next upcoming exam
  const now = new Date();
  const nextExam = EXAM_DATES.find((exam) => exam.date > now) || EXAM_DATES[0];

  const handleLogin = async () => {
    const loginUrl = getLoginUrl();
    if (Platform.OS === "web") {
      window.location.href = loginUrl;
    } else {
      await WebBrowser.openAuthSessionAsync(loginUrl);
    }
  };

  const handleStartTrial = () => {
    router.push("/(tabs)");
  };

  const handleGetFullAccess = () => {
    // For now, just go to the app - payment integration would be added later
    router.push("/(tabs)");
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="bg-primary px-6 pt-8 pb-12">
          <View className="items-center">
            <Text className="text-white text-sm font-medium tracking-wider uppercase mb-2">
              NYSMassageExam.com
            </Text>
            <Text className="text-white text-3xl font-bold text-center mb-3">
              Pass the NYS Massage Therapy Exam
            </Text>
            <Text className="text-white/80 text-center text-base mb-6 px-4">
              The only study app designed specifically for New York State's unique licensing exam
            </Text>
            
            {/* Warning Badge */}
            <View className="bg-error/20 rounded-full px-4 py-2 mb-6">
              <Text className="text-white font-semibold text-center">
                ⚠️ Only offered TWICE a year — Don't fail!
              </Text>
            </View>
          </View>
        </View>

        {/* Countdown Section */}
        <View className="bg-surface mx-4 -mt-6 rounded-2xl p-6 border border-border shadow-sm">
          <Text className="text-center text-lg font-semibold text-foreground mb-1">
            Next Exam Date
          </Text>
          <Text className="text-center text-primary font-bold text-xl mb-4">
            {nextExam.label}
          </Text>
          <CountdownTimer targetDate={nextExam.date} />
          <Text className="text-center text-muted text-sm mt-4">
            Application deadline: {nextExam.applicationDeadline}
          </Text>
        </View>

        {/* Why NYS is Different */}
        <View className="px-6 mt-8">
          <Text className="text-2xl font-bold text-foreground mb-4">
            Why the NYS Exam is Different
          </Text>
          <View className="bg-warning/10 rounded-xl p-4 border border-warning/30">
            <Text className="text-foreground leading-6">
              New York is the <Text className="font-bold">only state</Text> that requires its own massage therapy licensing exam separate from the national MBLEx. The NYS exam includes <Text className="font-bold">20 Eastern Medicine questions</Text> not found on any other exam, plus unique content on NY state laws and regulations.
            </Text>
            <Text className="text-foreground leading-6 mt-3">
              With only <Text className="font-bold">two exam dates per year</Text> and a <Text className="font-bold">paper-based format</Text>, failing means waiting 6 months to retake. Generic MBLEx prep won't cut it here.
            </Text>
          </View>
        </View>

        {/* Pricing Section */}
        <View className="px-6 mt-8">
          <View className="bg-primary rounded-2xl p-6 items-center">
            <Text className="text-white/80 text-sm uppercase tracking-wider mb-1">
              One-Time Purchase
            </Text>
            <View className="flex-row items-baseline mb-2">
              <Text className="text-white text-5xl font-bold">$37</Text>
            </View>
            <Text className="text-white/80 text-center mb-4">
              Lifetime access • No subscription • No hidden fees
            </Text>
            <TouchableOpacity
              onPress={handleGetFullAccess}
              className="bg-white rounded-full px-8 py-4 w-full"
              style={{ opacity: 1 }}
              activeOpacity={0.8}
            >
              <Text className="text-primary font-bold text-lg text-center">
                Get Full Access Now
              </Text>
            </TouchableOpacity>
            <Text className="text-white/60 text-xs text-center mt-3">
              💰 Money-back guarantee if you don't pass
            </Text>
          </View>
        </View>

        {/* Trial Mode */}
        <View className="px-6 mt-6">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-lg font-semibold text-foreground text-center mb-2">
              Not sure yet? Try it free!
            </Text>
            <Text className="text-muted text-center mb-4">
              Get 3 sample questions from each category to experience our unique study approach.
            </Text>
            <TouchableOpacity
              onPress={handleStartTrial}
              className="bg-surface border-2 border-primary rounded-full px-6 py-3"
              activeOpacity={0.8}
            >
              <Text className="text-primary font-semibold text-center">
                Start Free Trial
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* USPs */}
        <View className="px-6 mt-8">
          <Text className="text-2xl font-bold text-foreground mb-6 text-center">
            Why Students Choose Us
          </Text>
          {USP_LIST.map((usp, index) => (
            <View
              key={index}
              className="flex-row mb-4 bg-surface rounded-xl p-4 border border-border"
            >
              <Text className="text-3xl mr-4">{usp.icon}</Text>
              <View className="flex-1">
                <Text className="text-foreground font-semibold text-base mb-1">
                  {usp.title}
                </Text>
                <Text className="text-muted text-sm leading-5">
                  {usp.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Authentication Section */}
        <View className="px-6 mt-8 mb-8">
          <Text className="text-xl font-bold text-foreground mb-4 text-center">
            Create Your Account
          </Text>
          <Text className="text-muted text-center mb-6">
            Sign up to save your progress and access your study materials on any device.
          </Text>
          
          {/* Google Auth Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-white border border-border rounded-xl px-6 py-4 flex-row items-center justify-center mb-3"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">🔵</Text>
            <Text className="text-foreground font-semibold">Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple Auth Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-black rounded-xl px-6 py-4 flex-row items-center justify-center mb-3"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">🍎</Text>
            <Text className="text-white font-semibold">Continue with Apple</Text>
          </TouchableOpacity>

          {/* Email Auth Button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="bg-surface border border-border rounded-xl px-6 py-4 flex-row items-center justify-center"
            activeOpacity={0.8}
          >
            <Text className="text-2xl mr-3">✉️</Text>
            <Text className="text-foreground font-semibold">Continue with Email</Text>
          </TouchableOpacity>
        </View>

        {/* Testimonial/Trust Section */}
        <View className="px-6 mb-8">
          <View className="bg-surface rounded-2xl p-6 border border-border">
            <Text className="text-foreground italic text-center leading-6">
              "I failed the NYS exam twice using generic MBLEx prep. This app's Eastern Medicine mnemonics and NYS-specific content made all the difference. Passed on my third try!"
            </Text>
            <Text className="text-muted text-center mt-3 font-medium">
              — Sarah M., Licensed Massage Therapist
            </Text>
          </View>
        </View>

        {/* Footer CTA */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleGetFullAccess}
            className="bg-primary rounded-2xl px-6 py-5"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-xl text-center mb-1">
              Start Studying Now — $37
            </Text>
            <Text className="text-white/80 text-center text-sm">
              Join 500+ students who passed with our help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <Text className="text-muted text-center text-xs">
            © 2025 NYSMassageExam.com • All rights reserved
          </Text>
          <Text className="text-muted text-center text-xs mt-1">
            Not affiliated with the NYS Education Department
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
