import { useEffect, useState } from "react";
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
import { Button } from "@/components/desktop/button";
import { Container, useIsDesktop } from "@/components/desktop/container";
import { Card } from "@/components/desktop/card";
import { Badge } from "@/components/desktop/badge";
import Svg, { Rect, Text as SvgText, Circle, G } from "react-native-svg";
import { SEOHead, SEO_CONFIG } from "@/components/seo-head";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030336692/NfIEaabGwmxOivXu.png";

const EXAM_DATES = [
  { date: new Date("2026-03-06"), label: "March 6, 2026", deadline: "Nov 1, 2025" },
  { date: new Date("2026-09-18"), label: "September 18, 2026", deadline: "Jun 1, 2026" },
];

const STATS = [
  { value: "287", label: "Questions" },
  { value: "90%", label: "Pass Rate*" },
  { value: "500+", label: "Students" },
  { value: "4.9", label: "Rating" },
];

const PASS_RATE_DISCLAIMER = "*90% pass rate is based on self-reported results from users of this study guide. This figure has not been independently verified and should not be considered a guarantee of individual outcomes.";

const EXAM_CATEGORIES = [
  { name: "Anatomy", percentage: 28, color: "#2A9D8F", questions: 80 },
  { name: "Physiology", percentage: 22, color: "#E76F51", questions: 63 },
  { name: "Kinesiology", percentage: 18, color: "#F4A261", questions: 52 },
  { name: "Pathology", percentage: 12, color: "#264653", questions: 34 },
  { name: "Eastern Medicine", percentage: 20, color: "#E9C46A", questions: 58 },
];

const COMPARISON_DATA = [
  { feature: "NYS-Specific Content", us: true, them: false },
  { feature: "Eastern Medicine Focus", us: true, them: false },
  { feature: "Memory Mnemonics", us: true, them: false },
  { feature: "Spaced Repetition", us: true, them: "Limited" },
  { feature: "Wrong Answer Analysis", us: true, them: false },
  { feature: "Paper Exam Strategies", us: true, them: false },
  { feature: "Money-Back Guarantee", us: true, them: false },
];

function LiveCountdown({ targetDate }: { targetDate: Date }) {
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0 });

  useEffect(() => {
    setMounted(true);
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        });
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000 * 60);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) {
    return (
      <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
        <Text style={{ fontSize: isDesktop ? 48 : 36, fontWeight: "800", color: "#FFFFFF" }}>-- Days, -- Hours</Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className="flex-row items-baseline" style={{ gap: 4 }}>
        <Text style={{ fontSize: isDesktop ? 64 : 48, fontWeight: "900", color: "#FFFFFF" }}>{timeLeft.days}</Text>
        <Text style={{ fontSize: isDesktop ? 28 : 22, fontWeight: "700", color: "#FFFFFF" }}>Days</Text>
        <Text style={{ fontSize: isDesktop ? 64 : 48, fontWeight: "900", color: "#FFFFFF", marginLeft: 12 }}>{timeLeft.hours}</Text>
        <Text style={{ fontSize: isDesktop ? 28 : 22, fontWeight: "700", color: "#FFFFFF" }}>Hours</Text>
      </View>
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 8, fontWeight: "500" }}>until the next NYS Massage Therapy Exam</Text>
    </View>
  );
}

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const colors = useColors();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Sec" },
  ];

  if (!mounted) {
    return (
      <View className="flex-row justify-center" style={{ gap: 12 }}>
        {units.map((unit, index) => (
          <View key={index} className="items-center">
            <View className="rounded-xl items-center justify-center" style={{ backgroundColor: colors.elevated, borderWidth: 1, borderColor: colors.border, width: 72, height: 72 }}>
              <Text style={{ fontSize: 28, fontWeight: "700", color: colors.primary }}>--</Text>
            </View>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6, fontWeight: "500" }}>{unit.label}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row justify-center" style={{ gap: 12 }}>
      {units.map((unit, index) => (
        <View key={index} className="items-center">
          <View className="rounded-xl items-center justify-center" style={{ backgroundColor: colors.elevated, borderWidth: 1, borderColor: colors.border, width: 72, height: 72 }}>
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.primary }}>{String(unit.value).padStart(2, "0")}</Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6, fontWeight: "500" }}>{unit.label}</Text>
        </View>
      ))}
    </View>
  );
}

function AnalyticsPreview() {
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const chartWidth = isDesktop ? 400 : 320;
  const chartHeight = 220;
  const barHeight = 32;
  const barGap = 10;
  const leftPadding = 110;

  return (
    <Card className="p-6" variant="elevated">
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 20 }}>Exam Category Breakdown</Text>
      <Svg width={chartWidth} height={chartHeight}>
        {EXAM_CATEGORIES.map((cat, i) => {
          const y = i * (barHeight + barGap);
          const barWidth = ((chartWidth - leftPadding - 60) * cat.percentage) / 30;
          return (
            <G key={cat.name}>
              <SvgText x={0} y={y + barHeight / 2 + 5} fill={colors.foreground} fontSize={13} fontWeight="500">{cat.name}</SvgText>
              <Rect x={leftPadding} y={y} width={barWidth} height={barHeight} rx={6} fill={cat.color} />
              <SvgText x={leftPadding + barWidth + 10} y={y + barHeight / 2 + 5} fill={colors.muted} fontSize={12} fontWeight="600">{cat.percentage}% ({cat.questions})</SvgText>
            </G>
          );
        })}
      </Svg>
      <View style={{ marginTop: 16, padding: 12, backgroundColor: colors.warningMuted, borderRadius: 8 }}>
        <Text style={{ color: colors.warning, fontSize: 13, fontWeight: "600" }}>20% Eastern Medicine - NYS Exclusive Content</Text>
      </View>
    </Card>
  );
}

function MemoryAnalysisPreview() {
  const colors = useColors();
  const sampleData = [
    { label: "Mastered", value: 156, color: colors.success, percent: 54 },
    { label: "Learning", value: 89, color: colors.warning, percent: 31 },
    { label: "Needs Work", value: 42, color: colors.error, percent: 15 },
  ];

  return (
    <Card className="p-6" variant="elevated">
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>Smart Memory Tracking</Text>
      <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 20 }}>Know exactly what you know - and what you don't</Text>
      <View className="flex-row justify-around items-center" style={{ marginBottom: 20 }}>
        <Svg width={120} height={120}>
          <Circle cx={60} cy={60} r={50} stroke={colors.surfaceHover} strokeWidth={12} fill="transparent" />
          <Circle cx={60} cy={60} r={50} stroke={colors.success} strokeWidth={12} fill="transparent" strokeDasharray={`${54 * 3.14} ${100 * 3.14}`} strokeDashoffset={0} transform="rotate(-90 60 60)" strokeLinecap="round" />
          <SvgText x={60} y={55} textAnchor="middle" fill={colors.foreground} fontSize={24} fontWeight="700">54%</SvgText>
          <SvgText x={60} y={75} textAnchor="middle" fill={colors.muted} fontSize={11}>Mastered</SvgText>
        </Svg>
        <View style={{ gap: 12 }}>
          {sampleData.map((item) => (
            <View key={item.label} className="flex-row items-center" style={{ gap: 8 }}>
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: item.color }} />
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "500", width: 80 }}>{item.label}</Text>
              <Text style={{ color: colors.muted, fontSize: 14 }}>{item.value} questions</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ padding: 12, backgroundColor: colors.primaryMuted, borderRadius: 8 }}>
        <Text style={{ color: colors.primary, fontSize: 13 }}>Our spaced repetition algorithm resurfaces questions at the optimal time for long-term retention.</Text>
      </View>
    </Card>
  );
}

function MnemonicPreview() {
  const colors = useColors();
  const [revealed, setRevealed] = useState(false);

  return (
    <Card className="p-6" variant="elevated">
      <View className="flex-row items-center" style={{ gap: 8, marginBottom: 16 }}>
        <MaterialIcons name="psychology" size={24} color={colors.primary} />
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>Memory Mnemonics That Stick</Text>
      </View>
      <View style={{ backgroundColor: colors.surface, padding: 16, borderRadius: 12, marginBottom: 16 }}>
        <Text style={{ color: colors.muted, fontSize: 13, marginBottom: 8 }}>SAMPLE QUESTION</Text>
        <Text style={{ color: colors.foreground, fontSize: 16, lineHeight: 24 }}>What are the Five Elements in Traditional Chinese Medicine?</Text>
      </View>
      <Pressable onPress={() => setRevealed(!revealed)}>
        <View style={{ backgroundColor: revealed ? colors.successMuted : colors.primaryMuted, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: revealed ? colors.success : colors.primary, borderStyle: "dashed" }}>
          {revealed ? (
            <>
              <Text style={{ color: colors.success, fontWeight: "700", marginBottom: 8 }}>"Wise Fire Wizards Melt Everything"</Text>
              <Text style={{ color: colors.foreground, lineHeight: 22 }}><Text style={{ fontWeight: "600" }}>W</Text>ood, <Text style={{ fontWeight: "600" }}>F</Text>ire, <Text style={{ fontWeight: "600" }}>E</Text>arth, <Text style={{ fontWeight: "600" }}>M</Text>etal, <Text style={{ fontWeight: "600" }}>W</Text>ater</Text>
            </>
          ) : (
            <View className="flex-row items-center justify-center" style={{ gap: 8 }}>
              <MaterialIcons name="touch-app" size={20} color={colors.primary} />
              <Text style={{ color: colors.primary, fontWeight: "600" }}>Tap to reveal mnemonic</Text>
            </View>
          )}
        </View>
      </Pressable>
      <Text style={{ color: colors.muted, fontSize: 13, marginTop: 12, textAlign: "center" }}>Every question includes a memorable mnemonic like this</Text>
    </Card>
  );
}

function ComparisonTable() {
  const colors = useColors();
  return (
    <Card className="overflow-hidden" variant="elevated">
      <View className="flex-row" style={{ backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flex: 2, padding: 16 }}><Text style={{ color: colors.muted, fontWeight: "600", fontSize: 14 }}>Feature</Text></View>
        <View style={{ flex: 1, padding: 16, alignItems: "center", backgroundColor: colors.primaryMuted }}><Text style={{ color: colors.primary, fontWeight: "700", fontSize: 14 }}>Us</Text></View>
        <View style={{ flex: 1, padding: 16, alignItems: "center" }}><Text style={{ color: colors.muted, fontWeight: "600", fontSize: 14 }}>Generic MBLEx</Text></View>
      </View>
      {COMPARISON_DATA.map((row, i) => (
        <View key={row.feature} className="flex-row" style={{ borderBottomWidth: i < COMPARISON_DATA.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
          <View style={{ flex: 2, padding: 16 }}><Text style={{ color: colors.foreground, fontSize: 14 }}>{row.feature}</Text></View>
          <View style={{ flex: 1, padding: 16, alignItems: "center", backgroundColor: colors.primaryMuted + "40" }}>
            {row.us === true ? <MaterialIcons name="check-circle" size={22} color={colors.success} /> : <Text style={{ color: colors.foreground }}>{row.us}</Text>}
          </View>
          <View style={{ flex: 1, padding: 16, alignItems: "center" }}>
            {row.them === false ? <MaterialIcons name="cancel" size={22} color={colors.error} /> : <Text style={{ color: colors.muted }}>{row.them}</Text>}
          </View>
        </View>
      ))}
    </Card>
  );
}

function TestimonialCard({ quote, author, result }: { quote: string; author: string; result: string }) {
  const colors = useColors();
  return (
    <Card className="p-6" style={{ flex: 1 }}>
      <View className="flex-row mb-3">{[1, 2, 3, 4, 5].map((i) => <MaterialIcons key={i} name="star" size={18} color={colors.warning} />)}</View>
      <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 24, fontStyle: "italic", marginBottom: 12 }}>"{quote}"</Text>
      <View className="flex-row items-center justify-between">
        <Text style={{ color: colors.muted, fontWeight: "600", fontSize: 14 }}>— {author}</Text>
        <Badge variant="success">{result}</Badge>
      </View>
    </Card>
  );
}

export default function LandingScreen() {
  const router = useRouter();
  const colors = useColors();
  const isDesktop = useIsDesktop();
  const { width } = useWindowDimensions();
  const { isAuthenticated, loading } = useAuth();

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
    router.push("/upgrade" as any);
  };

  return (
    <View className="flex-1 bg-background">
      <SEOHead
        title={SEO_CONFIG.landing.title}
        description={SEO_CONFIG.landing.description}
        keywords={SEO_CONFIG.landing.keywords}
        canonicalPath="/landing"
      />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <View style={{ backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Container>
            <View className="flex-row items-center justify-between" style={{ height: isDesktop ? 72 : 60 }}>
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <Image source={{ uri: LOGO_URL }} style={{ width: 44, height: 44, borderRadius: 10 }} resizeMode="contain" />
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>NYS Massage Exam</Text>
                  {isDesktop && <Text style={{ fontSize: 12, color: colors.muted }}>The Only NYS-Specific Prep</Text>}
                </View>
              </View>
              {isDesktop && (
                <View className="flex-row items-center" style={{ gap: 32 }}>
                  <Pressable onPress={() => {}}><Text style={{ color: colors.muted, fontWeight: "500" }}>Features</Text></Pressable>
                  <Pressable onPress={() => {}}><Text style={{ color: colors.muted, fontWeight: "500" }}>Pricing</Text></Pressable>
                  <Pressable onPress={() => {}}><Text style={{ color: colors.muted, fontWeight: "500" }}>FAQ</Text></Pressable>
                </View>
              )}
              <View className="flex-row items-center" style={{ gap: 12 }}>
                {isDesktop && <Button variant="ghost" size="md" onPress={handleLogin}>Sign In</Button>}
                <Button variant="primary" size="md" onPress={handleGetFullAccess}>Get Started</Button>
              </View>
            </View>
          </Container>
        </View>

        {/* Urgency Banner */}
        <View style={{ backgroundColor: colors.error, paddingVertical: 12 }}>
          <Container>
            <LiveCountdown targetDate={nextExam.date} />
          </Container>
        </View>

        {/* Hero Section */}
        <View style={{ paddingTop: isDesktop ? 64 : 40, paddingBottom: isDesktop ? 64 : 40 }}>
          <Container>
            <View style={{ flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "center" : "stretch", gap: isDesktop ? 64 : 40 }}>
              <View style={{ flex: 1 }}>
                <View className="flex-row items-center mb-4" style={{ gap: 8 }}>
                  <Badge variant="warning">Only 2 Exams/Year</Badge>
                  <Badge variant="error">Don't Miss It</Badge>
                </View>
                <Text style={{ fontSize: isDesktop ? 52 : 34, fontWeight: "800", color: colors.foreground, lineHeight: isDesktop ? 60 : 40, letterSpacing: -1 }}>
                  Stop Wasting Time on{"
"}Generic MBLEx Prep
                </Text>
                <Text style={{ fontSize: isDesktop ? 20 : 17, color: colors.muted, marginTop: 20, lineHeight: isDesktop ? 32 : 26, maxWidth: 520 }}>
                  New York State has its <Text style={{ fontWeight: "700", color: colors.foreground }}>own exam</Text> with <Text style={{ fontWeight: "700", color: colors.warning }}>20% Eastern Medicine questions</Text> that generic MBLEx prep doesn't cover. We're the only study tool built specifically for the NYS exam.
                </Text>
                <View className="flex-row items-center" style={{ gap: 16, marginTop: 32 }}>
                  <Button variant="primary" size="lg" onPress={handleGetFullAccess}>Get Full Access - $37</Button>
                  <Button variant="outline" size="lg" onPress={handleStartTrial}>Try 3 Free Questions</Button>
                </View>
                <View className="flex-row" style={{ gap: isDesktop ? 40 : 24, marginTop: 40 }}>
                  {STATS.map((stat, i) => (
                    <View key={i}>
                      <Text style={{ fontSize: isDesktop ? 32 : 24, fontWeight: "700", color: colors.foreground }}>{stat.value}</Text>
                      <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={{ width: isDesktop ? 380 : "100%" }}>
                <Card variant="elevated" className="p-8">
                  <View className="items-center">
                    <View style={{ backgroundColor: colors.errorMuted, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginBottom: 16 }}>
                      <Text style={{ color: colors.error, fontSize: 13, fontWeight: "600" }}>Next Exam Date</Text>
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginBottom: 20 }}>{nextExam.label}</Text>
                    <CountdownTimer targetDate={nextExam.date} />
                    <View style={{ backgroundColor: colors.surfaceHover, padding: 12, borderRadius: 12, marginTop: 20, width: "100%" }}>
                      <Text style={{ color: colors.muted, textAlign: "center", fontSize: 13 }}>Application deadline: <Text style={{ color: colors.foreground, fontWeight: "600" }}>{nextExam.deadline}</Text></Text>
                    </View>
                  </View>
                </Card>
              </View>
            </View>
          </Container>
        </View>

        {/* Brutal Facts Section */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 64 : 40 }}>
          <Container>
            <View className="items-center mb-12">
              <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>The Brutal Truth About NYS</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 600 }}>New York is the only state with its own massage therapy licensing exam. Here's why that matters:</Text>
            </View>
            <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 24 }}>
              <Card className="p-6" style={{ flex: 1, borderLeftWidth: 4, borderLeftColor: colors.error }}>
                <MaterialIcons name="event-busy" size={32} color={colors.error} />
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginTop: 12, marginBottom: 8 }}>Only 2 Chances Per Year</Text>
                <Text style={{ color: colors.muted, lineHeight: 24 }}>Fail the exam? You're waiting 6 months to try again. Your career is on hold. Your competition isn't waiting.</Text>
              </Card>
              <Card className="p-6" style={{ flex: 1, borderLeftWidth: 4, borderLeftColor: colors.warning }}>
                <MaterialIcons name="warning" size={32} color={colors.warning} />
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginTop: 12, marginBottom: 8 }}>20% Eastern Medicine</Text>
                <Text style={{ color: colors.muted, lineHeight: 24 }}>58 questions on meridians, Yin/Yang theory, and acupressure points. Generic MBLEx prep covers ZERO of this.</Text>
              </Card>
              <Card className="p-6" style={{ flex: 1, borderLeftWidth: 4, borderLeftColor: colors.secondary }}>
                <MaterialIcons name="description" size={32} color={colors.secondary} />
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, marginTop: 12, marginBottom: 8 }}>Paper-Based Test</Text>
                <Text style={{ color: colors.muted, lineHeight: 24 }}>No flagging questions, no going back. Different strategies needed than computer-based adaptive testing.</Text>
              </Card>
            </View>
          </Container>
        </View>

        {/* Data Visualizations Section */}
        <View style={{ paddingVertical: isDesktop ? 64 : 40 }}>
          <Container>
            <View className="items-center mb-12">
              <Badge variant="primary" size="md">Data-Driven Prep</Badge>
              <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "700", color: colors.foreground, textAlign: "center", marginTop: 16, marginBottom: 12 }}>Know Exactly Where You Stand</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 600 }}>Our intelligent tracking system analyzes your performance and tells you exactly what to study next.</Text>
            </View>
            <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 24 }}>
              <View style={{ flex: 1 }}><AnalyticsPreview /></View>
              <View style={{ flex: 1 }}><MemoryAnalysisPreview /></View>
            </View>
          </Container>
        </View>

        {/* Mnemonic Preview Section */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 64 : 40 }}>
          <Container size="md">
            <View className="items-center mb-12">
              <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>No BS. Just Memory Hacks.</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 500 }}>Every single question comes with a mnemonic designed to make the answer unforgettable.</Text>
            </View>
            <MnemonicPreview />
          </Container>
        </View>

        {/* Comparison Section */}
        <View style={{ paddingVertical: isDesktop ? 64 : 40 }}>
          <Container size="md">
            <View className="items-center mb-12">
              <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>Us vs. Generic MBLEx Prep</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 500 }}>There's a reason 90%* of our students pass on their first try.</Text>
            </View>
            <ComparisonTable />
          </Container>
        </View>

        {/* Testimonials */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 64 : 40 }}>
          <Container>
            <View className="items-center mb-12">
              <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "700", color: colors.foreground, textAlign: "center" }}>What Our Students Say</Text>
            </View>
            <View style={{ flexDirection: isDesktop ? "row" : "column", gap: 24 }}>
              <TestimonialCard quote="I failed the NYS exam twice using generic MBLEx prep. The Eastern Medicine section killed me. This app's mnemonics made all the difference. Passed on my third try!" author="Sarah M." result="PASSED" />
              <TestimonialCard quote="The spaced repetition is a game changer. I could see my weak spots and the app kept drilling me on them until I mastered them. Worth every penny." author="Michael T." result="PASSED" />
              <TestimonialCard quote="Straight to the point, no fluff. Just the questions and mnemonics to remember them. Exactly what I needed with a full-time job and only 2 months to prep." author="Jennifer L." result="PASSED" />
            </View>
          </Container>
        </View>

        {/* Pricing Section */}
        <View style={{ paddingVertical: isDesktop ? 64 : 40 }}>
          <Container size="md">
            <Text style={{ fontSize: isDesktop ? 36 : 28, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>One Price. Lifetime Access.</Text>
            <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", marginBottom: 40 }}>No subscriptions. No hidden fees. No upsells.</Text>
            <Card variant="elevated" className="p-8 overflow-hidden" style={{ borderWidth: 2, borderColor: colors.primary }}>
              <View style={{ position: "absolute", top: 0, right: 0, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderBottomLeftRadius: 16 }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 13 }}>90% Pass Rate*</Text>
              </View>
              <View className="items-center">
                <Text style={{ fontSize: 56, fontWeight: "800", color: colors.foreground }}>$37</Text>
                <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>One-time payment • Lifetime access</Text>
                <View style={{ marginTop: 32, marginBottom: 32, gap: 14, width: "100%" }}>
                  {["All 287 NYS-specific exam questions", "Memory mnemonic for every answer", "Smart spaced repetition algorithm", "Category-by-category progress tracking", "Wrong answer analysis & review", "Works on any device", "Lifetime updates as exam changes", "30-day money-back guarantee"].map((item, i) => (
                    <View key={i} className="flex-row items-center" style={{ gap: 12 }}>
                      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.successMuted, alignItems: "center", justifyContent: "center" }}>
                        <MaterialIcons name="check" size={16} color={colors.success} />
                      </View>
                      <Text style={{ color: colors.foreground, fontSize: 15 }}>{item}</Text>
                    </View>
                  ))}
                </View>
                <Button variant="primary" size="xl" fullWidth onPress={handleGetFullAccess}>Get Full Access Now</Button>
                <Text style={{ color: colors.muted, fontSize: 13, marginTop: 16, textAlign: "center" }}>Secure payment. 30-day money-back guarantee. No questions asked.</Text>
              </View>
            </Card>
            <Card className="p-6 mt-6">
              <View style={{ flexDirection: isDesktop ? "row" : "column", alignItems: isDesktop ? "center" : "stretch", justifyContent: "space-between", gap: 16 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>Not sure yet? Try before you buy.</Text>
                  <Text style={{ color: colors.muted, marginTop: 4 }}>Get 3 sample questions from each category completely free.</Text>
                </View>
                <Button variant="outline" size="lg" onPress={handleStartTrial}>Start Free Trial</Button>
              </View>
            </Card>
          </Container>
        </View>

        {/* Final CTA */}
        <View style={{ backgroundColor: colors.primary, paddingVertical: isDesktop ? 64 : 48 }}>
          <Container>
            <View className="items-center">
              <Text style={{ fontSize: isDesktop ? 32 : 24, fontWeight: "700", color: "#FFFFFF", textAlign: "center", marginBottom: 8 }}>Your Career Is Waiting</Text>
              <Text style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 24, maxWidth: 500 }}>Join 500+ students who passed the NYS exam with confidence. Don't wait another 6 months.</Text>
              <Button variant="secondary" size="lg" onPress={handleGetFullAccess} style={{ backgroundColor: "#FFFFFF" }}>
                <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>Get Started for $37</Text>
              </Button>
            </View>
          </Container>
        </View>

        {/* Footer */}
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 32 }}>
          <Container>
            <View style={{ flexDirection: isDesktop ? "row" : "column", justifyContent: "space-between", alignItems: isDesktop ? "center" : "flex-start", gap: 16 }}>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Image source={{ uri: LOGO_URL }} style={{ width: 24, height: 24, borderRadius: 6 }} resizeMode="contain" />
                <Text style={{ fontWeight: "600", color: colors.foreground }}>NYSMassageExam.com</Text>
              </View>
              <View>
              <Text style={{ color: colors.muted, fontSize: 13 }}>© 2025 NYSMassageExam.com. All rights reserved. Not affiliated with the NYS Education Department.</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>{PASS_RATE_DISCLAIMER}</Text>
            </View>
            </View>
          </Container>
        </View>
      </ScrollView>
    </View>
  );
}
