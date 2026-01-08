import { useEffect, useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
  useWindowDimensions,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { getLoginUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeInUp,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  SlideInUp,
  SlideInDown,
  ZoomIn,
  BounceIn,
  interpolate,
  runOnJS,
} from "react-native-reanimated";
import { SEOHead, SEO_CONFIG } from "@/components/seo-head";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030336692/NfIEaabGwmxOivXu.png";

// Responsive breakpoint
const useIsDesktop = () => {
  const { width } = useWindowDimensions();
  return width >= 768;
};

// ============================================================================
// ANIMATED COMPONENTS
// ============================================================================

// Animated Badge with bounce
function AnimatedBadge({
  children,
  variant = "primary",
  delay = 0,
}: {
  children: React.ReactNode;
  variant?: "primary" | "warning" | "error" | "success";
  delay?: number;
}) {
  const colors = useColors();
  const bgColors = {
    primary: colors.primaryMuted,
    warning: colors.warningMuted,
    error: colors.errorMuted,
    success: colors.successMuted,
  };
  const textColors = {
    primary: colors.primary,
    warning: colors.warning,
    error: colors.error,
    success: colors.success,
  };

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).springify().damping(12)}
      style={{
        backgroundColor: bgColors[variant],
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
      }}
    >
      <Text style={{ color: textColors[variant], fontSize: 12, fontWeight: "700" }}>
        {children}
      </Text>
    </Animated.View>
  );
}

// Animated Button with press effect
function AnimatedButton({
  onPress,
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  delay = 0,
}: {
  onPress: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  delay?: number;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const sizes = {
    sm: { paddingHorizontal: 16, paddingVertical: 10, fontSize: 14 },
    md: { paddingHorizontal: 24, paddingVertical: 14, fontSize: 16 },
    lg: { paddingHorizontal: 32, paddingVertical: 18, fontSize: 18 },
  };

  const variants = {
    primary: { backgroundColor: colors.primary, borderWidth: 0, textColor: "#FFFFFF" },
    outline: { backgroundColor: "transparent", borderWidth: 2, borderColor: colors.border, textColor: colors.foreground },
    ghost: { backgroundColor: "transparent", borderWidth: 0, textColor: colors.primary },
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.96, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: variants[variant].backgroundColor,
              borderWidth: variants[variant].borderWidth,
              borderColor: variants[variant].borderColor,
              paddingHorizontal: sizes[size].paddingHorizontal,
              paddingVertical: sizes[size].paddingVertical,
              borderRadius: 14,
              alignItems: "center",
              width: fullWidth ? "100%" : "auto",
            },
            animatedStyle,
          ]}
        >
          <Text style={{ color: variants[variant].textColor, fontSize: sizes[size].fontSize, fontWeight: "700" }}>
            {children}
          </Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// Animated Card with hover/press effect
function AnimatedCard({
  children,
  delay = 0,
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  style?: any;
}) {
  const colors = useColors();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View entering={FadeInUp.delay(delay).springify().damping(14)}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 15 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15 });
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              ...style,
            },
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// Pulsing Button for CTA
function PulsingButton({ onPress, children, colors }: { onPress: () => void; children: React.ReactNode; colors: any }) {
  const scale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * buttonScale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        buttonScale.value = withSpring(0.96, { damping: 15 });
      }}
      onPressOut={() => {
        buttonScale.value = withSpring(1, { damping: 15 });
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 40,
            paddingVertical: 18,
            borderRadius: 16,
          },
          pulseStyle,
        ]}
      >
        <Text style={{ color: colors.primary, fontSize: 18, fontWeight: "700" }}>{children}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ============================================================================
// DATA
// ============================================================================

const EXAM_DATES = [
  { date: new Date("2026-03-06"), label: "March 6, 2026", deadline: "Nov 1, 2025", deadlineDate: new Date("2025-11-01") },
  { date: new Date("2026-09-18"), label: "September 18, 2026", deadline: "Jun 1, 2026", deadlineDate: new Date("2026-06-01") },
];

const STATS = [
  { value: "250+", label: "Questions" },
  { value: "90%", label: "Pass Rate*" },
  { value: "100+", label: "Students" },
  { value: "4.9", label: "Rating" },
];

const NYS_PASS_RATE = "31%";

const PASS_RATE_DISCLAIMER = "*90% pass rate is based on self-reported results from users of this study guide vs. the NYS statewide average of 31%. This figure has not been independently verified and should not be considered a guarantee of individual outcomes.";

const FEATURES = [
  { icon: "spa", title: "20% Eastern Medicine", desc: "58 questions on meridians, Yin/Yang, and acupressure — content MBLEx prep ignores", color: "#E9C46A" },
  { icon: "psychology", title: "Memory Mnemonics", desc: "Every question includes a memorable mnemonic to make answers stick", color: "#2A9D8F" },
  { icon: "trending-up", title: "Smart Repetition", desc: "Our algorithm identifies weak spots and drills them until mastered", color: "#E76F51" },
  { icon: "description", title: "Paper Test Ready", desc: "Strategies for the paper-based format where you can't go back", color: "#264653" },
];

const TESTIMONIALS = [
  { quote: "I failed the NYS exam twice using generic MBLEx prep. The Eastern Medicine section killed me. This app's mnemonics made all the difference.", author: "Sarah, Pacific College NYC", result: "PASSED" },
  { quote: "The spaced repetition is a game changer. I could see my weak spots and the app kept drilling me until I mastered them.", author: "Michael T.", result: "PASSED" },
  { quote: "Straight to the point, no fluff. Just the questions and mnemonics. Exactly what I needed with a full-time job.", author: "Jenn, Swedish Inst NY", result: "PASSED" },
];

const COMPARISON_DATA = [
  { feature: "NYS-Specific Content", us: true, them: false },
  { feature: "Eastern Medicine (20%)", us: true, them: false },
  { feature: "Memory Mnemonics", us: true, them: false },
  { feature: "Spaced Repetition", us: true, them: "Limited" },
  { feature: "Paper Exam Strategy", us: true, them: false },
  { feature: "Money-Back Guarantee", us: true, them: false },
];

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

// Animated Countdown Timer
function AnimatedCountdown({ targetDate }: { targetDate: Date }) {
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const secondsPulse = useSharedValue(1);

  useEffect(() => {
    setMounted(true);
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

    // Pulse animation for seconds
    secondsPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 400 }),
        withTiming(1, { duration: 400 })
      ),
      -1,
      false
    );

    return () => clearInterval(timer);
  }, [targetDate]);

  const secondsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: secondsPulse.value }],
  }));

  const units = [
    { value: timeLeft.days, label: "Days", isSeconds: false },
    { value: timeLeft.hours, label: "Hours", isSeconds: false },
    { value: timeLeft.minutes, label: "Min", isSeconds: false },
    { value: timeLeft.seconds, label: "Sec", isSeconds: true },
  ];

  return (
    <View style={{ flexDirection: "row", justifyContent: "center", gap: isDesktop ? 16 : 10 }}>
      {units.map((unit, index) => (
        <Animated.View
          key={unit.label}
          entering={ZoomIn.delay(index * 100).springify().damping(12)}
        >
          <View style={{ alignItems: "center" }}>
            <Animated.View
              style={[
                {
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: 16,
                  width: isDesktop ? 80 : 65,
                  height: isDesktop ? 80 : 65,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.2)",
                },
                unit.isSeconds ? secondsStyle : {},
              ]}
            >
              <Text style={{ fontSize: isDesktop ? 32 : 24, fontWeight: "800", color: "#FFFFFF" }}>
                {mounted ? String(unit.value).padStart(2, "0") : "--"}
              </Text>
            </Animated.View>
            <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 8, fontWeight: "600" }}>
              {unit.label}
            </Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

// Hero Section
function HeroSection({ onGetAccess, onTrial }: { onGetAccess: () => void; onTrial: () => void }) {
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const now = new Date();
  const nextExam = EXAM_DATES.find((exam) => exam.date > now) || EXAM_DATES[0];

  return (
    <View style={{ paddingHorizontal: isDesktop ? 48 : 20, paddingTop: isDesktop ? 80 : 32, paddingBottom: isDesktop ? 80 : 48 }}>
      <View style={{ flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "center" : "flex-start", gap: isDesktop ? 64 : 32, maxWidth: 1200, alignSelf: "center", width: "100%" }}>
        {/* Left Content */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            <AnimatedBadge variant="warning" delay={0}>Only 2 Exams/Year</AnimatedBadge>
            <AnimatedBadge variant="error" delay={100}>{NYS_PASS_RATE} Fail Rate</AnimatedBadge>
          </View>

          <Animated.Text
            entering={FadeInLeft.delay(200).springify()}
            style={{
              fontSize: isDesktop ? 52 : 36,
              fontWeight: "900",
              color: colors.foreground,
              lineHeight: isDesktop ? 60 : 42,
              letterSpacing: -1,
            }}
          >
            Stop Gambling on{"\n"}Generic MBLEx Prep
          </Animated.Text>

          <Animated.Text
            entering={FadeInLeft.delay(400).springify()}
            style={{
              fontSize: isDesktop ? 18 : 16,
              color: colors.muted,
              marginTop: 20,
              lineHeight: isDesktop ? 30 : 26,
            }}
          >
            New York State has its <Text style={{ fontWeight: "700", color: colors.foreground }}>own exam</Text> with{" "}
            <Text style={{ fontWeight: "700", color: colors.warning }}>20% Eastern Medicine questions</Text> that generic prep doesn't cover.
            We're the only study tool built specifically for the NYS Massage Therapy Licensing Exam.
          </Animated.Text>

          <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 12, marginTop: 32 }}>
            <AnimatedButton onPress={onGetAccess} variant="primary" size="lg" delay={600}>
              Get Full Access - $37
            </AnimatedButton>
            <AnimatedButton onPress={onTrial} variant="outline" size="lg" delay={700}>
              Try 20 Free Questions
            </AnimatedButton>
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: "row", gap: isDesktop ? 40 : 20, marginTop: 40, flexWrap: "wrap" }}>
            {STATS.map((stat, index) => (
              <Animated.View
                key={stat.label}
                entering={FadeInUp.delay(800 + index * 100).springify()}
              >
                <Text style={{ fontSize: isDesktop ? 28 : 24, fontWeight: "800", color: colors.foreground }}>{stat.value}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>{stat.label}</Text>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Right Content - Countdown Card */}
        <Animated.View
          entering={ZoomIn.delay(500).springify().damping(12)}
          style={{
            backgroundColor: colors.error,
            borderRadius: 24,
            padding: isDesktop ? 32 : 24,
            width: isDesktop ? 380 : "100%",
            alignItems: "center",
          }}
        >
          <Animated.View
            entering={FadeIn.delay(700)}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              marginBottom: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 13, fontWeight: "700" }}>Next Exam Date</Text>
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(800).springify()}
            style={{ fontSize: isDesktop ? 26 : 22, fontWeight: "700", color: "#FFFFFF", marginBottom: 24, textAlign: "center" }}
          >
            {nextExam.label}
          </Animated.Text>

          <AnimatedCountdown targetDate={nextExam.date} />

          <Animated.View
            entering={FadeIn.delay(1200)}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: 12,
              borderRadius: 12,
              marginTop: 24,
              width: "100%",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.9)", textAlign: "center", fontSize: 13 }}>
              Application deadline: <Text style={{ fontWeight: "700" }}>{nextExam.deadline}</Text>
            </Text>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

// Warning Section
function WarningSection() {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  const warnings = [
    { icon: "event-busy", title: "Only 2 Chances Per Year", desc: "Fail the exam? Wait 6 months. Your career is on hold.", color: colors.error },
    { icon: "warning", title: "20% Eastern Medicine", desc: "58 questions on meridians & Yin/Yang. Generic prep covers ZERO.", color: colors.warning },
    { icon: "description", title: "Paper-Based Test", desc: "No going back. Different strategies needed than computer tests.", color: colors.secondary },
  ];

  return (
    <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 1200, alignSelf: "center", width: "100%" }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: "center", marginBottom: 48 }}>
          <View style={{
            backgroundColor: colors.errorMuted,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
          }}>
            <MaterialIcons name="warning" size={24} color={colors.error} />
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.error }}>{NYS_PASS_RATE} Fail Rate Statewide</Text>
          </View>
          <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>
            The NYS Exam Is No Joke
          </Text>
        </Animated.View>

        <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 20 }}>
          {warnings.map((item, index) => (
            <Animated.View
              key={item.title}
              entering={FadeInUp.delay(200 + index * 150).springify()}
              style={{ flex: 1 }}
            >
              <View style={{
                backgroundColor: colors.background,
                borderRadius: 20,
                padding: 24,
                borderLeftWidth: 4,
                borderLeftColor: item.color,
                height: "100%",
              }}>
                <MaterialIcons name={item.icon as any} size={32} color={item.color} />
                <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 8 }}>
                  {item.title}
                </Text>
                <Text style={{ color: colors.muted, lineHeight: 22 }}>{item.desc}</Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </View>
  );
}

// Features Section
function FeaturesSection() {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  return (
    <View style={{ paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 1200, alignSelf: "center", width: "100%" }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: "center", marginBottom: 48 }}>
          <AnimatedBadge variant="primary">What Makes Us Different</AnimatedBadge>
          <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "800", color: colors.foreground, textAlign: "center", marginTop: 16 }}>
            Built For NYS. Nothing Else.
          </Text>
        </Animated.View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 20 }}>
          {FEATURES.map((feature, index) => (
            <AnimatedCard
              key={feature.title}
              delay={200 + index * 100}
              style={{ flex: 1, minWidth: isDesktop ? 280 : "100%" }}
            >
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: feature.color + "20",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}>
                <MaterialIcons name={feature.icon as any} size={28} color={feature.color} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 8 }}>
                {feature.title}
              </Text>
              <Text style={{ color: colors.muted, lineHeight: 22 }}>{feature.desc}</Text>
            </AnimatedCard>
          ))}
        </View>
      </View>
    </View>
  );
}

// Mnemonic Demo Section
function MnemonicSection() {
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const [revealed, setRevealed] = useState(false);
  const cardScale = useSharedValue(1);
  const bgColor = useSharedValue(0);

  const handleReveal = () => {
    setRevealed(!revealed);
    cardScale.value = withSequence(
      withTiming(0.97, { duration: 100 }),
      withSpring(1, { damping: 12 })
    );
  };

  const revealStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 700, alignSelf: "center", width: "100%" }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>
            Memory Mnemonics That Stick
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center", marginTop: 12, maxWidth: 500 }}>
            Every question includes a memorable mnemonic. You don't need to relearn tough topics — you just need to PASS!
          </Text>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(200).springify().damping(12)}
          style={{
            backgroundColor: colors.background,
            borderRadius: 20,
            padding: 24,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <MaterialIcons name="psychology" size={24} color={colors.primary} />
            <Text style={{ fontSize: 14, color: colors.muted, fontWeight: "600" }}>SAMPLE QUESTION</Text>
          </View>

          <Text style={{ fontSize: 18, color: colors.foreground, lineHeight: 26, marginBottom: 20 }}>
            What are the Five Elements in Traditional Chinese Medicine?
          </Text>

          <Pressable onPress={handleReveal}>
            <Animated.View
              style={[
                {
                  backgroundColor: revealed ? colors.successMuted : colors.primaryMuted,
                  borderColor: revealed ? colors.success : colors.primary,
                  padding: 20,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderStyle: "dashed",
                },
                revealStyle,
              ]}
            >
              {revealed ? (
                <Animated.View entering={FadeIn.duration(300)}>
                  <Text style={{ color: colors.success, fontWeight: "700", fontSize: 18, marginBottom: 8 }}>
                    "Wild Fires Easily Melt Wax"
                  </Text>
                  <Text style={{ color: colors.foreground, lineHeight: 24 }}>
                    <Text style={{ fontWeight: "700" }}>W</Text>ood, <Text style={{ fontWeight: "700" }}>F</Text>ire, <Text style={{ fontWeight: "700" }}>E</Text>arth, <Text style={{ fontWeight: "700" }}>M</Text>etal, <Text style={{ fontWeight: "700" }}>W</Text>ater
                  </Text>
                </Animated.View>
              ) : (
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <MaterialIcons name="touch-app" size={20} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontWeight: "600" }}>Tap to reveal mnemonic</Text>
                </View>
              )}
            </Animated.View>
          </Pressable>

          <Text style={{ color: colors.muted, fontSize: 13, marginTop: 16, textAlign: "center" }}>
            Every question includes a memorable mnemonic like this
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

// Comparison Section
function ComparisonSection() {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  return (
    <View style={{ paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 800, alignSelf: "center", width: "100%" }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>
            Us vs. Generic MBLEx Prep
          </Text>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(200).springify().damping(14)}
          style={{ backgroundColor: colors.surface, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: colors.border }}
        >
          {/* Header */}
          <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View style={{ flex: 2, padding: 16 }}>
              <Text style={{ color: colors.muted, fontWeight: "600" }}>Feature</Text>
            </View>
            <View style={{ flex: 1, padding: 16, alignItems: "center", backgroundColor: colors.primaryMuted }}>
              <Text style={{ color: colors.primary, fontWeight: "700" }}>Us</Text>
            </View>
            <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
              <Text style={{ color: colors.muted, fontWeight: "600" }}>Generic</Text>
            </View>
          </View>

          {/* Rows */}
          {COMPARISON_DATA.map((row, index) => (
            <Animated.View
              key={row.feature}
              entering={FadeInLeft.delay(300 + index * 50)}
              style={{
                flexDirection: "row",
                borderBottomWidth: index < COMPARISON_DATA.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ flex: 2, padding: 16 }}>
                <Text style={{ color: colors.foreground, fontSize: 14 }}>{row.feature}</Text>
              </View>
              <View style={{ flex: 1, padding: 16, alignItems: "center", backgroundColor: colors.primaryMuted + "40" }}>
                {row.us === true ? (
                  <MaterialIcons name="check-circle" size={22} color={colors.success} />
                ) : (
                  <Text style={{ color: colors.foreground }}>{row.us}</Text>
                )}
              </View>
              <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
                {row.them === false ? (
                  <MaterialIcons name="cancel" size={22} color={colors.error} />
                ) : (
                  <Text style={{ color: colors.muted }}>{row.them}</Text>
                )}
              </View>
            </Animated.View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  return (
    <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 1200, alignSelf: "center", width: "100%" }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: "center", marginBottom: 48 }}>
          <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>
            What Students Say
          </Text>
        </Animated.View>

        <View style={{ flexDirection: isDesktop ? "row" : "column", flexWrap: "wrap", gap: 20, justifyContent: "center" }}>
          {TESTIMONIALS.map((testimonial, index) => (
            <AnimatedCard
              key={testimonial.author}
              delay={200 + index * 150}
              style={{
                flex: isDesktop ? 1 : undefined,
                minWidth: isDesktop ? 300 : undefined,
                maxWidth: isDesktop ? 380 : undefined,
                width: isDesktop ? undefined : "100%",
              }}
            >
              <View style={{ flexDirection: "row", marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <MaterialIcons key={i} name="star" size={18} color={colors.warning} />
                ))}
              </View>
              <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 24, fontStyle: "italic", marginBottom: 16 }}>
                "{testimonial.quote}"
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ color: colors.muted, fontWeight: "600", fontSize: 13 }}>— {testimonial.author}</Text>
                <View style={{ backgroundColor: colors.successMuted, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                  <Text style={{ color: colors.success, fontSize: 11, fontWeight: "700" }}>{testimonial.result}</Text>
                </View>
              </View>
            </AnimatedCard>
          ))}
        </View>
      </View>
    </View>
  );
}

// Pricing Section
function PricingSection({ onGetAccess, onTrial }: { onGetAccess: () => void; onTrial: () => void }) {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  const features = [
    "All 250+ NYS-specific exam questions",
    "Memory mnemonic for every answer",
    "Smart spaced repetition algorithm",
    "Category-by-category progress tracking",
    "Wrong answer analysis & review",
    "Works on any device",
    "Lifetime updates as exam changes",
    "30-day money-back guarantee",
  ];

  return (
    <View style={{ paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 600, alignSelf: "center", width: "100%" }}>
        <Animated.View entering={FadeInUp.springify()} style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "800", color: colors.foreground, textAlign: "center" }}>
            One Price. Lifetime Access.
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center", marginTop: 8 }}>
            No subscriptions. No hidden fees. No upsells.
          </Text>
        </Animated.View>

        <Animated.View
          entering={ZoomIn.delay(200).springify().damping(12)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: isDesktop ? 40 : 28,
            borderWidth: 2,
            borderColor: colors.primary,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Badge */}
          <Animated.View
            entering={FadeInRight.delay(400)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 8,
              borderBottomLeftRadius: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 12 }}>90% Pass Rate*</Text>
          </Animated.View>

          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Animated.Text
              entering={BounceIn.delay(300)}
              style={{ fontSize: 64, fontWeight: "900", color: colors.foreground }}
            >
              $37
            </Animated.Text>
            <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>One-time payment • Lifetime access</Text>

            <View style={{ marginTop: 32, marginBottom: 32, width: "100%", gap: 12 }}>
              {features.map((feature, index) => (
                <Animated.View
                  key={feature}
                  entering={FadeInLeft.delay(400 + index * 50)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: colors.successMuted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <MaterialIcons name="check" size={16} color={colors.success} />
                  </View>
                  <Text style={{ color: colors.foreground, fontSize: 15 }}>{feature}</Text>
                </Animated.View>
              ))}
            </View>

            <AnimatedButton onPress={onGetAccess} variant="primary" size="lg" fullWidth delay={800}>
              Get Full Access Now
            </AnimatedButton>

            <Animated.Text
              entering={FadeIn.delay(900)}
              style={{ color: colors.muted, fontSize: 13, marginTop: 16, textAlign: "center" }}
            >
              Secure payment. 30-day money-back guarantee.
            </Animated.Text>
          </View>
        </Animated.View>

        {/* Trial CTA */}
        <Animated.View
          entering={FadeInUp.delay(1000).springify()}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 20,
            marginTop: 20,
            flexDirection: isDesktop ? "row" : "column",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground }}>Not sure yet?</Text>
            <Text style={{ color: colors.muted, marginTop: 4 }}>Try 20 free questions first.</Text>
          </View>
          <AnimatedButton onPress={onTrial} variant="outline" size="md">
            Start Free Trial
          </AnimatedButton>
        </Animated.View>
      </View>
    </View>
  );
}

// Final CTA Section
function FinalCTASection({ onGetAccess }: { onGetAccess: () => void }) {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  return (
    <View style={{ backgroundColor: colors.primary, paddingVertical: isDesktop ? 80 : 48, paddingHorizontal: isDesktop ? 48 : 20 }}>
      <View style={{ maxWidth: 600, alignSelf: "center", width: "100%", alignItems: "center" }}>
        <Animated.Text
          entering={FadeInUp.springify()}
          style={{ fontSize: isDesktop ? 40 : 32, fontWeight: "900", color: "#FFFFFF", textAlign: "center", marginBottom: 12 }}
        >
          Don't Wait Another 6 Months
        </Animated.Text>
        <Animated.Text
          entering={FadeInUp.delay(200).springify()}
          style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", textAlign: "center", marginBottom: 32 }}
        >
          Join 100+ students who passed the NYS exam with confidence.
        </Animated.Text>
        <Animated.View entering={ZoomIn.delay(400).springify()}>
          <PulsingButton onPress={onGetAccess} colors={colors}>
            Get Started for $37
          </PulsingButton>
        </Animated.View>
      </View>
    </View>
  );
}

// Header Component
function Header({ onLogin, onGetAccess }: { onLogin: () => void; onGetAccess: () => void }) {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  return (
    <Animated.View
      entering={FadeInDown.duration(500)}
      style={{
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: isDesktop ? 48 : 20,
        paddingVertical: 16,
      }}
    >
      <View style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: 1200,
        alignSelf: "center",
        width: "100%",
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Image source={{ uri: LOGO_URL }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode="contain" />
          <View>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.foreground }}>NYS Massage Exam</Text>
            {isDesktop && <Text style={{ fontSize: 11, color: colors.muted }}>The Only NYS-Specific Prep</Text>}
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable onPress={onLogin}>
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>Sign In</Text>
          </Pressable>
          {isDesktop && (
            <AnimatedButton onPress={onGetAccess} variant="primary" size="sm">
              Get Started
            </AnimatedButton>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

// Footer Component
function Footer() {
  const colors = useColors();
  const isDesktop = useIsDesktop();

  return (
    <Animated.View entering={FadeIn.delay(200)}>
      <View style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 32,
        paddingHorizontal: isDesktop ? 48 : 20,
      }}>
        <View style={{ maxWidth: 1200, alignSelf: "center", width: "100%" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Image source={{ uri: LOGO_URL }} style={{ width: 24, height: 24, borderRadius: 6 }} resizeMode="contain" />
            <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 14 }}>NYSMassageExam.com</Text>
          </View>
          <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 18 }}>
            © 2025 NYSMassageExam.com. All rights reserved. Not affiliated with the NYS Education Department.
          </Text>
          <Text style={{ color: colors.muted, fontSize: 10, marginTop: 8, lineHeight: 14 }}>
            {PASS_RATE_DISCLAIMER}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

// Sticky Mobile CTA
function StickyMobileCTA({ onPress, colors }: { onPress: () => void; colors: any }) {
  const isDesktop = useIsDesktop();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(100);

  useEffect(() => {
    translateY.value = withDelay(1000, withSpring(0, { damping: 15 }));
    scale.value = withDelay(
      1500,
      withRepeat(
        withSequence(
          withTiming(1.03, { duration: 1200 }),
          withTiming(1, { duration: 1200 })
        ),
        -1,
        false
      )
    );
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (isDesktop) return null;

  return (
    <Animated.View
      style={[
        {
          position: Platform.OS === "web" ? "fixed" : "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingHorizontal: 20,
          paddingVertical: 12,
          paddingBottom: Platform.OS === "web" ? 12 : 28,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1000,
          ...(Platform.OS === "web" ? { boxShadow: "0 -4px 20px rgba(0,0,0,0.1)" } : {}),
        },
        containerStyle,
      ]}
    >
      <View>
        <Text style={{ fontSize: 20, fontWeight: "800", color: colors.foreground }}>$37</Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>Lifetime access</Text>
      </View>
      <Pressable onPress={onPress}>
        <Animated.View
          style={[
            {
              backgroundColor: colors.primary,
              paddingHorizontal: 28,
              paddingVertical: 14,
              borderRadius: 12,
            },
            buttonStyle,
          ]}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>Get Full Access</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LandingMotiScreen() {
  const router = useRouter();
  const colors = useColors();
  const isDesktop = useIsDesktop();

  const handleLogin = async () => {
    const loginUrl = getLoginUrl();
    if (Platform.OS === "web") {
      window.location.href = loginUrl;
    } else {
      await WebBrowser.openAuthSessionAsync(loginUrl);
    }
  };

  const handleStartTrial = () => {
    router.push("/(tabs)/study");
  };

  const handleGetFullAccess = () => {
    router.push("/upgrade" as any);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SEOHead
        title={SEO_CONFIG.landing.title}
        description={SEO_CONFIG.landing.description}
        keywords={SEO_CONFIG.landing.keywords}
        canonicalPath="/landing-moti"
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: isDesktop ? 0 : 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Header onLogin={handleLogin} onGetAccess={handleGetFullAccess} />
        <HeroSection onGetAccess={handleGetFullAccess} onTrial={handleStartTrial} />
        <WarningSection />
        <FeaturesSection />
        <MnemonicSection />
        <ComparisonSection />
        <TestimonialsSection />
        <PricingSection onGetAccess={handleGetFullAccess} onTrial={handleStartTrial} />
        <FinalCTASection onGetAccess={handleGetFullAccess} />
        <Footer />
      </ScrollView>

      <StickyMobileCTA onPress={handleGetFullAccess} colors={colors} />
    </View>
  );
}
