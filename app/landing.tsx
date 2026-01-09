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
import { trpc } from "@/lib/trpc";
import { useAuthContext } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { VERSION } from "@/shared/const";
import { hasStartedQuiz, setQuizStarted } from "@/lib/study-store";

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030336692/NfIEaabGwmxOivXu.png";

// Sticky CTA Bar for Mobile
function StickyMobileCTA({ onPress, onTrial, colors, price }: { onPress: () => void; onTrial: () => void; colors: any; price: string }) {
  return (
    <View
      style={{
        position: Platform.OS === 'web' ? 'fixed' : 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'web' ? 10 : 24,
        zIndex: 1000,
        ...(Platform.OS === 'web' ? { boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' } : {}),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {/* Free Trial Button */}
        <Pressable
          onPress={onTrial}
          style={({ pressed }) => ({
            flex: 1,
            backgroundColor: colors.successMuted,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: colors.success,
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ color: colors.success, fontSize: 15, fontWeight: '700' }}>Try Free</Text>
        </Pressable>
        {/* Full Access Button */}
        <Pressable
          onPress={onPress}
          style={({ pressed }) => ({
            flex: 2,
            backgroundColor: colors.primary,
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: 'center',
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>Full Access - {price}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const EXAM_DATES = [
  { date: new Date("2026-03-06"), label: "March 6, 2026", deadline: "Nov 1, 2025", deadlineDate: new Date("2025-11-01") },
  { date: new Date("2026-09-18"), label: "September 18, 2026", deadline: "Jun 1, 2026", deadlineDate: new Date("2026-06-01") },
];

const STATS = [
  { value: "302", label: "Questions" },
  { value: "90%", label: "Our Pass Rate*" },
  { value: "100+", label: "Students" },
  { value: "4.9", label: "Rating" },
];

// NYS official pass rate for contrast
const NYS_PASS_RATE = "31%";

const PASS_RATE_DISCLAIMER = "*90% pass rate is based on self-reported results from users of this study guide vs. the NYS statewide average of approximately 70%. This figure has not been independently verified and should not be considered a guarantee of individual outcomes.";

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
  { feature: "Money-Back Guarantee", us: true, them: "🤷" },
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
    <Card className="p-6" variant="elevated" style={{ flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 20 }}>Exam Category Breakdown (Practice Content)</Text>
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
    <Card className="p-6" variant="elevated" style={{ flex: 1 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, marginBottom: 4 }}>Smart Memory Tracking</Text>
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
              <Text style={{ color: colors.success, fontWeight: "700", marginBottom: 8 }}>"Wild Fires Easily Melt Wax"</Text>
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
            {row.them === false ? <MaterialIcons name="cancel" size={22} color={colors.error} /> : <Text style={{ color: colors.muted, fontSize: row.them === "🤷" ? 28 : 14 }}>{row.them}</Text>}
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
  const { user, hasPurchased, signInWithGoogle } = useAuthContext();
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [checkingReturningUser, setCheckingReturningUser] = useState(true);

  // Check if user has previously started a quiz - redirect to study area
  useEffect(() => {
    const checkReturningUser = async () => {
      try {
        const started = await hasStartedQuiz();
        if (started) {
          router.replace("/(tabs)/study");
          return;
        }
      } catch (error) {
        console.error("Error checking returning user:", error);
      } finally {
        setCheckingReturningUser(false);
      }
    };
    checkReturningUser();
  }, [router]);

  // Fetch price from backend
  const { data: priceData } = trpc.config.getPrice.useQuery();
  const price = priceData?.formatted || "$37";

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

  const handleStartTrial = async () => {
    await setQuizStarted();
    router.push("/(tabs)/study");
  };

  // Show nothing while checking if user is returning (prevents flash)
  if (checkingReturningUser) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Loading...</Text>
      </View>
    );
  }

  const handleGetFullAccess = async () => {
    // If user is not logged in, prompt for Google sign-in first
    if (!user) {
      try {
        await signInWithGoogle();
        // After OAuth redirect, this component will re-render with user data
        // The auth callback will handle checking purchase status
        return;
      } catch (error) {
        console.error("Sign in error:", error);
        // If sign-in fails or is cancelled, still allow them to proceed to upgrade
        router.push("/upgrade" as any);
        return;
      }
    }

    // User is logged in, check if they already purchased
    setCheckingPurchase(true);
    try {
      // Query the database for purchase info
      const { data, error } = await supabase
        .from('nys_massage_subscribers')
        .select('purchased_at, email')
        .or(`user_id.eq.${user.id},email.ilike.${user.email}`)
        .not('purchased_at', 'is', null)
        .limit(1);

      if (!error && data && data.length > 0 && data[0].purchased_at) {
        // User has already purchased - show message with date
        const purchaseDate = new Date(data[0].purchased_at);
        const formattedDate = purchaseDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        if (Platform.OS === 'web') {
          window.alert(`You already have full access! You purchased on ${formattedDate}. Redirecting to study area...`);
        }
        router.push("/(tabs)/study");
        return;
      }

      // User hasn't purchased, proceed to upgrade
      router.push("/upgrade" as any);
    } catch (error) {
      console.error("Error checking purchase:", error);
      // On error, still allow them to proceed to upgrade
      router.push("/upgrade" as any);
    } finally {
      setCheckingPurchase(false);
    }
  };

  // MOBILE LAYOUT
  if (!isDesktop) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SEOHead
          title={SEO_CONFIG.landing.title}
          description={SEO_CONFIG.landing.description}
          keywords={SEO_CONFIG.landing.keywords}
          canonicalPath="/landing"
        />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Mobile Header - Minimal */}
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Image source={{ uri: LOGO_URL }} style={{ width: 36, height: 36, borderRadius: 8 }} resizeMode="contain" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.foreground }}>NYS Massage Exam</Text>
            </View>
            <Pressable onPress={handleLogin}>
              <Text style={{ color: colors.primary, fontWeight: '600', fontSize: 14 }}>Sign In</Text>
            </Pressable>
          </View>

          {/* Mobile Hero - Clear Purpose */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <Badge variant="primary" size="sm">The Only NYS-Specific Prep</Badge>

            <Text style={{
              fontSize: 32,
              fontWeight: '800',
              color: colors.foreground,
              marginTop: 16,
              lineHeight: 38,
              letterSpacing: -0.5
            }}>
              Pass the NYS{'\n'}Massage Therapy{'\n'}Exam
            </Text>

            <Text style={{
              fontSize: 16,
              color: colors.muted,
              marginTop: 12,
              lineHeight: 24
            }}>
              The only study tool built for New York's unique exam — including the <Text style={{ fontWeight: '700', color: colors.warning }}>20% Eastern Medicine</Text> questions that generic prep ignores.
            </Text>

            {/* Primary CTA - Trial First! */}
            <View style={{ marginTop: 24, gap: 12 }}>
              {/* FREE TRIAL - Most Prominent */}
              <Pressable
                onPress={handleStartTrial}
                style={({ pressed }) => ({
                  backgroundColor: colors.success,
                  paddingVertical: 18,
                  borderRadius: 14,
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>Start Free Trial</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 }}>20 questions • No signup required</Text>
              </Pressable>

              {/* Full Access - Secondary */}
              <Pressable
                onPress={handleGetFullAccess}
                style={({ pressed }) => ({
                  backgroundColor: colors.primary,
                  paddingVertical: 16,
                  borderRadius: 14,
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Get Full Access - {price}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 }}>302 questions • Lifetime access</Text>
              </Pressable>
            </View>

            {/* Trust Badges */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>302</Text>
                <Text style={{ fontSize: 11, color: colors.muted }}>Questions</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.success }}>90%</Text>
                <Text style={{ fontSize: 11, color: colors.muted }}>Pass Rate*</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: colors.foreground }}>100+</Text>
                <Text style={{ fontSize: 11, color: colors.muted }}>Students</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <MaterialIcons name="verified" size={20} color={colors.primary} />
                <Text style={{ fontSize: 11, color: colors.muted }}>Guarantee</Text>
              </View>
            </View>
          </View>

          {/* Scary Stats Card */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ backgroundColor: colors.errorMuted, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.error + '30' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <MaterialIcons name="warning" size={24} color={colors.error} />
                <Text style={{ fontSize: 18, fontWeight: '700', color: colors.error }}>The NYS Exam is No Joke</Text>
              </View>
              <View style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: 28, fontWeight: '800', color: colors.error }}>{NYS_PASS_RATE}</Text>
                  <Text style={{ fontSize: 14, color: colors.foreground, flex: 1 }}>of test-takers fail the NYS exam statewide</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialIcons name="event-busy" size={20} color={colors.warning} />
                  <Text style={{ fontSize: 14, color: colors.foreground }}>Only <Text style={{ fontWeight: '700' }}>2 exam dates per year</Text> — fail and wait 6 months</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialIcons name="cancel" size={20} color={colors.error} />
                  <Text style={{ fontSize: 14, color: colors.foreground }}>Generic MBLEx prep misses <Text style={{ fontWeight: '700' }}>20%</Text> of NYS content</Text>
                </View>
              </View>
              <Text style={{ fontSize: 13, color: colors.muted, marginTop: 12, lineHeight: 20 }}>
                New York State has its own exam with 20% (28) Eastern Medicine questions that generic MBLEx prep doesn't cover. Even seasoned licensed massage therapists who passed the MBLEx 20 years ago get tripped up here. We're the BEST study tool built specifically for the New York State Massage Therapy Licensing Exam.
              </Text>
            </View>
          </View>

          {/* Countdown Card - Compact */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Next Exam</Text>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: colors.foreground, marginTop: 2 }}>{nextExam.label}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <CountdownTimer targetDate={nextExam.date} />
                </View>
              </View>
            </View>
          </View>

          {/* Social Proof - Testimonial */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>What Students Say</Text>
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {[1,2,3,4,5].map(i => <MaterialIcons key={i} name="star" size={16} color={colors.warning} />)}
              </View>
              <Text style={{ fontSize: 15, color: colors.foreground, lineHeight: 22, fontStyle: 'italic' }}>
                "I failed the NYS exam twice using generic MBLEx prep. The Eastern Medicine section killed me. This app's mnemonics made all the difference. Passed on my third try!"
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <Text style={{ fontSize: 13, color: colors.muted, fontWeight: '600' }}>— Sarah, Pacific College NYC</Text>
                <Badge variant="success" size="sm">PASSED</Badge>
              </View>
            </View>
          </View>

          {/* Why NYS is Different - Simple List */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>Why NYS Is Different</Text>
            <View style={{ gap: 12 }}>
              {[
                { icon: 'spa', text: '20% Eastern Medicine (58 questions on meridians & Yin/Yang)', color: colors.warning },
                { icon: 'description', text: 'Paper-based test — no going back to change answers', color: colors.secondary },
                { icon: 'event-busy', text: 'Only 2 exam dates per year — high stakes', color: colors.error },
                { icon: 'school', text: 'NYS-specific content not covered by MBLEx prep', color: colors.primary },
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surface, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border }}>
                  <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: item.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name={item.icon as any} size={22} color={item.color} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: colors.foreground, lineHeight: 20 }}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Mnemonic Preview - Keep Interactive Demo */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 12 }}>Memory Mnemonics That Stick</Text>
            <MnemonicPreview />
          </View>

          {/* What You Get - Simple List */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground, marginBottom: 16 }}>What You Get</Text>
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              {[
                '302 practice questions',
                'Memory mnemonic for every answer',
                'Smart spaced repetition algorithm',
                'Category-by-category progress tracking',
                'Paper test simulation mode',
                'Works on any device',
                '30-day money-back guarantee',
              ].map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: i < 6 ? 1 : 0, borderBottomColor: colors.border }}>
                  <MaterialIcons name="check-circle" size={20} color={colors.success} />
                  <Text style={{ fontSize: 14, color: colors.foreground }}>{item}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Try Before You Buy Card */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <Pressable
              onPress={handleStartTrial}
              style={({ pressed }) => ({
                backgroundColor: colors.successMuted,
                borderRadius: 16,
                padding: 20,
                borderWidth: 2,
                borderColor: colors.success,
                opacity: pressed ? 0.95 : 1,
              })}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: colors.success }}>Not sure yet? Try it free!</Text>
                  <Text style={{ fontSize: 14, color: colors.foreground, marginTop: 4 }}>20 sample questions from all categories. No signup, no credit card.</Text>
                </View>
                <MaterialIcons name="arrow-forward" size={28} color={colors.success} />
              </View>
            </Pressable>
          </View>

          {/* Pricing Card */}
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <View style={{ backgroundColor: colors.primary, borderRadius: 20, padding: 24, alignItems: 'center' }}>
              <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>One-Time Purchase</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 56, fontWeight: '800', marginTop: 8 }}>{price}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, marginTop: 4 }}>Lifetime access • No subscription</Text>
              <Pressable
                onPress={handleGetFullAccess}
                style={({ pressed }) => ({
                  backgroundColor: '#FFFFFF',
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  borderRadius: 12,
                  marginTop: 20,
                  width: '100%',
                  alignItems: 'center',
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{ color: colors.primary, fontSize: 18, fontWeight: '700' }}>Get Full Access Now</Text>
              </Pressable>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 12, textAlign: 'center' }}>Secure payment • 30-day money-back guarantee</Text>
            </View>
          </View>

          {/* More Testimonials */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {[1,2,3,4,5].map(i => <MaterialIcons key={i} name="star" size={16} color={colors.warning} />)}
              </View>
              <Text style={{ fontSize: 15, color: colors.foreground, lineHeight: 22, fontStyle: 'italic' }}>
                "Straight to the point, no fluff. Just the questions and mnemonics to remember them. Exactly what I needed with a full-time job and only 2 months to prep."
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                <Text style={{ fontSize: 13, color: colors.muted, fontWeight: '600' }}>— Jenn, Swedish Inst NY</Text>
                <Badge variant="success" size="sm">PASSED</Badge>
              </View>
            </View>
          </View>

          {/* Final CTA Section */}
          <View style={{ paddingHorizontal: 20, marginTop: 32, marginBottom: 20 }}>
            <View style={{ backgroundColor: colors.errorMuted, borderRadius: 16, padding: 20, alignItems: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '800', color: colors.error, textAlign: 'center', lineHeight: 34 }}>Don't Wait Another 6 Months!</Text>
              <Text style={{ fontSize: 14, color: colors.muted, textAlign: 'center', marginTop: 8 }}>Join over 100 students who passed with confidence.</Text>
              <View style={{ width: '100%', gap: 10, marginTop: 16 }}>
                <Pressable
                  onPress={handleStartTrial}
                  style={({ pressed }) => ({
                    backgroundColor: colors.success,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Try 20 Free Questions</Text>
                </Pressable>
                <Pressable
                  onPress={handleGetFullAccess}
                  style={({ pressed }) => ({
                    backgroundColor: colors.primary,
                    paddingVertical: 14,
                    borderRadius: 12,
                    alignItems: 'center',
                    opacity: pressed ? 0.9 : 1,
                  })}
                >
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '700' }}>Get Full Access - {price}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={{ paddingHorizontal: 20, paddingVertical: 24, borderTopWidth: 1, borderTopColor: colors.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Image source={{ uri: LOGO_URL }} style={{ width: 24, height: 24, borderRadius: 6 }} resizeMode="contain" />
              <Text style={{ fontWeight: '600', color: colors.foreground, fontSize: 14 }}>NYSMassageExam.com</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 16 }}>
              © 2025 NYSMassageExam.com. All rights reserved. Not affiliated with the NYS Education Department.
            </Text>
            <Text style={{ color: colors.muted, fontSize: 10, marginTop: 8, lineHeight: 14 }}>{PASS_RATE_DISCLAIMER}</Text>
            <Text style={{ color: colors.border, fontSize: 9, marginTop: 12, textAlign: 'center' }}>{VERSION}</Text>
          </View>
        </ScrollView>

        {/* Sticky Bottom CTA */}
        <StickyMobileCTA onPress={handleGetFullAccess} onTrial={handleStartTrial} colors={colors} price={price} />
      </View>
    );
  }

  // DESKTOP LAYOUT
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
            <View className="flex-row items-center justify-between" style={{ height: 72 }}>
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <Image source={{ uri: LOGO_URL }} style={{ width: 44, height: 44, borderRadius: 10 }} resizeMode="contain" />
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>NYS Massage Exam</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>The Only NYS-Specific Prep</Text>
                </View>
              </View>
                            <View className="flex-row items-center" style={{ gap: 12 }}>
                <Button variant="ghost" size="md" onPress={handleLogin}>Sign In</Button>
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
        <View style={{ paddingTop: 64, paddingBottom: 64 }}>
          <Container>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 64 }}>
              <View style={{ flex: 1 }}>
                <View className="flex-row items-center mb-4" style={{ gap: 8 }}>
                  <Badge variant="warning">Only 2 Exams/Year</Badge>
                  <Badge variant="error">{NYS_PASS_RATE} Fail Rate</Badge>
                </View>
                <Text style={{ fontSize: 52, fontWeight: "800", color: colors.foreground, lineHeight: 60, letterSpacing: -1 }}>
                  Stop Wasting Time on{" "}Generic MBLEx Prep
                </Text>
                <Text style={{ fontSize: 20, color: colors.muted, marginTop: 20, lineHeight: 32, maxWidth: 520 }}>
                  New York State has its <Text style={{ fontWeight: "700", color: colors.foreground }}>own exam</Text> with <Text style={{ fontWeight: "700", color: colors.warning }}>20% (28) Eastern Medicine questions</Text> that generic MBLEx prep doesn't cover. We're simply the best study tool built specifically for the New York State Massage Therapy Licensing Exam.
                </Text>
                <View className="flex-row items-center" style={{ gap: 16, marginTop: 32 }}>
                  <Button variant="primary" size="lg" onPress={handleGetFullAccess}>Get Full Access - {price}</Button>
                  <Button variant="outline" size="lg" onPress={handleStartTrial}>Try 20 Free Questions</Button>
                </View>
                <View className="flex-row" style={{ gap: 40, marginTop: 40 }}>
                  {STATS.map((stat, i) => (
                    <View key={i}>
                      <Text style={{ fontSize: 32, fontWeight: "700", color: colors.foreground }}>{stat.value}</Text>
                      <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>{stat.label}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={{ width: 380 }}>
                <Card variant="elevated" className="p-8">
                  <View className="items-center">
                    <View style={{ backgroundColor: colors.errorMuted, paddingHorizontal: 16, paddingVertical: 6, borderRadius: 999, marginBottom: 16 }}>
                      <Text style={{ color: colors.error, fontSize: 13, fontWeight: "600" }}>Next Exam Date</Text>
                    </View>
                    <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground, marginBottom: 20 }}>{nextExam.label}</Text>
                    <CountdownTimer targetDate={nextExam.date} />
                    <View style={{ backgroundColor: nextExam.deadlineDate < new Date() ? colors.errorMuted : colors.surfaceHover, padding: 12, borderRadius: 12, marginTop: 20, width: "100%" }}>
                      <Text style={{ color: colors.muted, textAlign: "center", fontSize: 13 }}>
                        Application deadline: <Text style={{ color: nextExam.deadlineDate < new Date() ? colors.error : colors.foreground, fontWeight: "600" }}>{nextExam.deadline}</Text>
                        {nextExam.deadlineDate < new Date() && <Text style={{ color: colors.error, fontWeight: "700" }}> — EXPIRED!</Text>}
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
            </View>
          </Container>
        </View>

        {/* Brutal Facts Section */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: 64 }}>
          <Container>
            <View className="items-center mb-12">
              <View style={{ backgroundColor: colors.errorMuted, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="warning" size={24} color={colors.error} />
                <Text style={{ fontSize: 24, fontWeight: '800', color: colors.error }}>{NYS_PASS_RATE} Fail Rate Statewide</Text>
              </View>
              <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>The NYS Exam Is No Joke</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 700 }}>New York State has its own exam with 20% (28) Eastern Medicine questions that generic MBLEx prep doesn't cover. Even seasoned licensed massage therapists who passed the MBLEx 20 years ago get tripped up here. We're the BEST study tool built specifically for the New York State Massage Therapy Licensing Exam.</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 24 }}>
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
        <View style={{ paddingVertical: 64 }}>
          <Container>
            <View className="items-center mb-12">
              <Badge variant="primary" size="lg">Data-Driven Prep</Badge>
              <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, textAlign: "center", marginTop: 16, marginBottom: 12 }}>Know Exactly Where You Stand</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 600 }}>Our intelligent tracking system analyzes your performance and tells you exactly what to study next.</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 24, alignItems: 'stretch' }}>
              <View style={{ flex: 1 }}><AnalyticsPreview /></View>
              <View style={{ flex: 1 }}><MemoryAnalysisPreview /></View>
            </View>
          </Container>
        </View>

        {/* Mnemonic Preview Section */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: 64 }}>
          <Container size="md">
            <View className="items-center mb-12">
              <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>No BS. Just Memory Hacks.</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 600 }}>Every single question comes with a mnemonic memory aid designed to make the answer unforgettable. Truth is, you don't need to relearn extremely tough topics — you just need to PASS!</Text>
            </View>
            <MnemonicPreview />
          </Container>
        </View>

        {/* Reinforced Learning Section */}
        <View style={{ paddingVertical: 64 }}>
          <Container>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 48 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                  source={require("@/assets/images/p901.png")}
                  style={{ width: 400, height: 400 }}
                  resizeMode="contain"
                />
              </View>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Badge variant="primary" size="md">Reinforced Learning</Badge>
                <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 16, textAlign: "left" }}>Master Content Through Repetition</Text>
                <Text style={{ fontSize: 17, color: colors.muted, lineHeight: 28, textAlign: "left" }}>
                  Our reinforced learning system guides you through a proven cycle: study with mnemonics, test your recall, review mistakes, and repeat. Each practice session strengthens neural pathways, transforming short-term memorization into lasting exam-ready knowledge.
                </Text>
              </View>
            </View>
          </Container>
        </View>

        {/* CRISP Principle Section */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: 64 }}>
          <Container>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 48 }}>
              <View style={{ flex: 1, alignItems: "flex-start" }}>
                <Badge variant="success" size="md">Science-Backed Method</Badge>
                <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, marginTop: 16, marginBottom: 16, textAlign: "left" }}>Built on CRISP Principles</Text>
                <Text style={{ fontSize: 17, color: colors.muted, lineHeight: 28, textAlign: "left" }}>
                  Every mnemonic in our study guide follows the CRISP framework: Concise content stripped to essentials, Relatable connections to what you know, vivid Imagery that sticks, Structured patterns for clarity, and Personal meaning that makes learning memorable.
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Image
                  source={require("@/assets/images/p910.png")}
                  style={{ width: 480, height: 320 }}
                  resizeMode="contain"
                />
              </View>
            </View>
          </Container>
        </View>

        {/* Comparison Section */}
        <View style={{ paddingVertical: 64 }}>
          <Container size="md">
            <View className="items-center mb-12">
              <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>Us vs. Generic MBLEx Prep</Text>
              <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", maxWidth: 500 }}>There's a reason 90%* of our students pass on their first try.</Text>
            </View>
            <ComparisonTable />
          </Container>
        </View>

        {/* Testimonials */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: 64 }}>
          <Container>
            <View className="items-center mb-12">
              <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, textAlign: "center" }}>What Our Students Say</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 24 }}>
              <TestimonialCard quote="I failed the NYS exam twice using generic MBLEx prep. The Eastern Medicine section killed me. This app's mnemonics made all the difference. Passed on my third try!" author="Sarah, Pacific College NYC" result="PASSED" />
              <TestimonialCard quote="The spaced repetition is a game changer. I could see my weak spots and the app kept drilling me on them until I mastered them. Worth every penny." author="Michael T." result="PASSED" />
              <TestimonialCard quote="Straight to the point, no fluff. Just the questions and mnemonics to remember them. Exactly what I needed with a full-time job and only 2 months to prep." author="Jenn, Swedish Inst NY" result="PASSED" />
            </View>
          </Container>
        </View>

        {/* Pricing Section */}
        <View style={{ paddingVertical: 64 }}>
          <Container size="md">
            <Text style={{ fontSize: 36, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 12 }}>One Price. Lifetime Access.</Text>
            <Text style={{ fontSize: 17, color: colors.muted, textAlign: "center", marginBottom: 40 }}>No subscriptions. No hidden fees. No upsells.</Text>
            <Card variant="elevated" className="p-8 overflow-hidden" style={{ borderWidth: 2, borderColor: colors.primary }}>
              <View style={{ position: "absolute", top: 0, right: 0, backgroundColor: colors.primary, paddingHorizontal: 20, paddingVertical: 8, borderBottomLeftRadius: 16 }}>
                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 13 }}>90% Pass Rate*</Text>
              </View>
              <View className="items-center">
                <Text style={{ fontSize: 112, fontWeight: "800", color: colors.foreground }}>{price}</Text>
                <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>One-time payment • Lifetime access</Text>
                <View style={{ marginTop: 32, marginBottom: 32, gap: 14, width: "100%" }}>
                  {["302 practice questions", "Memory mnemonic for every answer", "Smart spaced repetition algorithm", "Category-by-category progress tracking", "Wrong answer analysis & review", "Works on any device", "Lifetime updates as exam changes", "30-day money-back guarantee"].map((item, i) => (
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
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
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
        <View style={{ backgroundColor: colors.primary, paddingVertical: 64 }}>
          <Container>
            <View className="items-center">
              <Text style={{ fontSize: 32, fontWeight: "700", color: "#FFFFFF", textAlign: "center", marginBottom: 8 }}>Your Career Is Waiting</Text>
              <Text style={{ fontSize: 17, color: "rgba(255,255,255,0.8)", textAlign: "center", marginBottom: 24, maxWidth: 500 }}>Join over 100 students who passed the NYS exam with confidence. Don't wait another 6 months.</Text>
              <Button variant="secondary" size="lg" onPress={handleGetFullAccess} style={{ backgroundColor: "#FFFFFF" }}>
                <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>Get Started for {price}</Text>
              </Button>
            </View>
          </Container>
        </View>

        {/* Footer */}
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingVertical: 32 }}>
          <Container>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <Image source={{ uri: LOGO_URL }} style={{ width: 24, height: 24, borderRadius: 6 }} resizeMode="contain" />
                <Text style={{ fontWeight: "600", color: colors.foreground }}>NYSMassageExam.com</Text>
              </View>
              <View>
              <Text style={{ color: colors.muted, fontSize: 13 }}>© 2025 NYSMassageExam.com. All rights reserved. Not affiliated with the NYS Education Department.</Text>
              <Text style={{ color: colors.muted, fontSize: 11, marginTop: 8 }}>{PASS_RATE_DISCLAIMER}</Text>
            </View>
            </View>
            <Text style={{ color: colors.border, fontSize: 10, marginTop: 16, textAlign: 'center' }}>{VERSION}</Text>
          </Container>
        </View>
      </ScrollView>
    </View>
  );
}
