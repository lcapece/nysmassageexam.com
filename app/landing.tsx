import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { getLoginUrl } from "@/constants/oauth";
import * as WebBrowser from "expo-web-browser";
import { Button } from "@/components/desktop/button";
import { Container, useIsDesktop } from "@/components/desktop/container";
import { Card, FeatureCard } from "@/components/desktop/card";
import { Badge } from "@/components/desktop/badge";

// Exam dates
const EXAM_DATES = [
  { date: new Date("2026-03-06"), label: "March 6, 2026", deadline: "Nov 1, 2025" },
  { date: new Date("2026-09-18"), label: "September 18, 2026", deadline: "Jun 1, 2026" },
];

// Feature list
const FEATURES = [
  {
    icon: "gps-fixed",
    title: "NYS-Specific Content",
    description: "Built exclusively for New York State's unique exam - not generic MBLEx prep.",
  },
  {
    icon: "psychology",
    title: "Memory Mnemonics",
    description: "Every question includes clever memory aids that actually stick with you.",
  },
  {
    icon: "verified",
    title: "Expert Designed",
    description: "Created with a licensed NYS massage therapist who passed this exact exam.",
  },
  {
    icon: "auto-graph",
    title: "Spaced Repetition",
    description: "Smart algorithm resurfaces questions at optimal intervals for retention.",
  },
  {
    icon: "devices",
    title: "Study Anywhere",
    description: "Works on any device. Your progress syncs seamlessly across all platforms.",
  },
  {
    icon: "verified-user",
    title: "Money-Back Guarantee",
    description: "Pass the exam or get a full refund. We're that confident in our system.",
  },
];

// Stats
const STATS = [
  { value: "287", label: "Questions" },
  { value: "94%", label: "Pass Rate" },
  { value: "500+", label: "Students" },
  { value: "4.9", label: "Rating" },
];

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

  // Don't render countdown values until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <View className="flex-row justify-center" style={{ gap: 12 }}>
        {units.map((unit, index) => (
          <View key={index} className="items-center">
            <View
              className="rounded-xl items-center justify-center"
              style={{
                backgroundColor: colors.elevated,
                borderWidth: 1,
                borderColor: colors.border,
                width: 72,
                height: 72,
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: "700", color: colors.primary }}>
                --
              </Text>
            </View>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6, fontWeight: "500" }}>
              {unit.label}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row justify-center" style={{ gap: 12 }}>
      {units.map((unit, index) => (
        <View key={index} className="items-center">
          <View
            className="rounded-xl items-center justify-center"
            style={{
              backgroundColor: colors.elevated,
              borderWidth: 1,
              borderColor: colors.border,
              width: 72,
              height: 72,
            }}
          >
            <Text style={{ fontSize: 28, fontWeight: "700", color: colors.primary }}>
              {String(unit.value).padStart(2, "0")}
            </Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 6, fontWeight: "500" }}>
            {unit.label}
          </Text>
        </View>
      ))}
    </View>
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
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Navigation Bar */}
        <View
          style={{
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Container>
            <View
              className="flex-row items-center justify-between"
              style={{ height: isDesktop ? 72 : 60 }}
            >
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialIcons name="spa" size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>
                    NYS Massage Exam
                  </Text>
                  {isDesktop && (
                    <Text style={{ fontSize: 12, color: colors.muted }}>Study App</Text>
                  )}
                </View>
              </View>

              {isDesktop && (
                <View className="flex-row items-center" style={{ gap: 32 }}>
                  <Pressable onPress={() => {}}>
                    <Text style={{ color: colors.muted, fontWeight: "500" }}>Features</Text>
                  </Pressable>
                  <Pressable onPress={() => {}}>
                    <Text style={{ color: colors.muted, fontWeight: "500" }}>Pricing</Text>
                  </Pressable>
                  <Pressable onPress={() => {}}>
                    <Text style={{ color: colors.muted, fontWeight: "500" }}>FAQ</Text>
                  </Pressable>
                </View>
              )}

              <View className="flex-row items-center" style={{ gap: 12 }}>
                {isDesktop && (
                  <Button variant="ghost" size="md" onPress={handleLogin}>
                    Sign In
                  </Button>
                )}
                <Button variant="primary" size="md" onPress={handleGetFullAccess}>
                  Get Started
                </Button>
              </View>
            </View>
          </Container>
        </View>

        {/* Hero Section */}
        <View style={{ paddingTop: isDesktop ? 80 : 48, paddingBottom: isDesktop ? 80 : 48 }}>
          <Container>
            <View
              style={{
                flexDirection: isDesktop ? "row" : "column",
                alignItems: isDesktop ? "center" : "stretch",
                gap: isDesktop ? 64 : 40,
              }}
            >
              {/* Hero Text */}
              <View style={{ flex: 1 }}>
                <View className="flex-row items-center mb-4" style={{ gap: 8 }}>
                  <Badge variant="warning">Only 2 Exams/Year</Badge>
                  <Badge variant="error">Don't Fail!</Badge>
                </View>

                <Text
                  style={{
                    fontSize: isDesktop ? 56 : 36,
                    fontWeight: "800",
                    color: colors.foreground,
                    lineHeight: isDesktop ? 64 : 42,
                    letterSpacing: -1,
                  }}
                >
                  Pass the NYS{"\n"}Massage Therapy{"\n"}
                  <Text style={{ color: colors.primary }}>Exam</Text>
                </Text>

                <Text
                  style={{
                    fontSize: isDesktop ? 20 : 17,
                    color: colors.muted,
                    marginTop: 20,
                    lineHeight: isDesktop ? 32 : 26,
                    maxWidth: 520,
                  }}
                >
                  The only study app designed specifically for New York State's unique
                  licensing examination. Built by experts, trusted by 500+ students.
                </Text>

                <View
                  className="flex-row items-center"
                  style={{ gap: 16, marginTop: 32 }}
                >
                  <Button variant="primary" size="lg" onPress={handleGetFullAccess}>
                    Get Full Access - $37
                  </Button>
                  <Button variant="outline" size="lg" onPress={handleStartTrial}>
                    Try Free Demo
                  </Button>
                </View>

                {/* Stats Row */}
                <View
                  className="flex-row"
                  style={{ gap: isDesktop ? 40 : 24, marginTop: 40 }}
                >
                  {STATS.map((stat, i) => (
                    <View key={i}>
                      <Text
                        style={{
                          fontSize: isDesktop ? 32 : 24,
                          fontWeight: "700",
                          color: colors.foreground,
                        }}
                      >
                        {stat.value}
                      </Text>
                      <Text style={{ fontSize: 13, color: colors.muted, marginTop: 2 }}>
                        {stat.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Countdown Card */}
              <View style={{ width: isDesktop ? 380 : "100%" }}>
                <Card variant="elevated" className="p-8">
                  <View className="items-center">
                    <View
                      style={{
                        backgroundColor: colors.errorMuted,
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        borderRadius: 999,
                        marginBottom: 16,
                      }}
                    >
                      <Text style={{ color: colors.error, fontSize: 13, fontWeight: "600" }}>
                        Next Exam Date
                      </Text>
                    </View>

                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "700",
                        color: colors.foreground,
                        marginBottom: 20,
                      }}
                    >
                      {nextExam.label}
                    </Text>

                    <CountdownTimer targetDate={nextExam.date} />

                    <View
                      style={{
                        backgroundColor: colors.surfaceHover,
                        padding: 12,
                        borderRadius: 12,
                        marginTop: 20,
                        width: "100%",
                      }}
                    >
                      <Text style={{ color: colors.muted, textAlign: "center", fontSize: 13 }}>
                        Application deadline:{" "}
                        <Text style={{ color: colors.foreground, fontWeight: "600" }}>
                          {nextExam.deadline}
                        </Text>
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
            </View>
          </Container>
        </View>

        {/* Why NYS is Different */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 80 : 48 }}>
          <Container>
            <View style={{ maxWidth: 800, marginHorizontal: "auto" }}>
              <Text
                style={{
                  fontSize: isDesktop ? 36 : 28,
                  fontWeight: "700",
                  color: colors.foreground,
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                Why the NYS Exam is Different
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: colors.muted,
                  textAlign: "center",
                  lineHeight: 28,
                  marginBottom: 32,
                }}
              >
                New York is the only state that requires its own massage therapy licensing
                exam separate from the national MBLEx.
              </Text>

              <Card
                className="p-6"
                style={{ borderLeftWidth: 4, borderLeftColor: colors.warning }}
              >
                <View style={{ gap: 16 }}>
                  <View className="flex-row items-start" style={{ gap: 12 }}>
                    <MaterialIcons name="warning" size={24} color={colors.warning} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 16 }}>
                        20 Eastern Medicine Questions
                      </Text>
                      <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 22 }}>
                        Unique to NYS - covers meridians, Yin/Yang theory, and acupressure
                        points not found on any other exam.
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-start" style={{ gap: 12 }}>
                    <MaterialIcons name="event-busy" size={24} color={colors.error} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 16 }}>
                        Only 2 Exam Dates Per Year
                      </Text>
                      <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 22 }}>
                        Failing means waiting 6 months to retake. Generic MBLEx prep won't
                        cut it here.
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-start" style={{ gap: 12 }}>
                    <MaterialIcons name="description" size={24} color={colors.secondary} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "600", color: colors.foreground, fontSize: 16 }}>
                        Paper-Based Format
                      </Text>
                      <Text style={{ color: colors.muted, marginTop: 4, lineHeight: 22 }}>
                        Unlike computer-based exams, you need different strategies for
                        paper-based testing.
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </View>
          </Container>
        </View>

        {/* Features Grid */}
        <View style={{ paddingVertical: isDesktop ? 80 : 48 }}>
          <Container>
            <Text
              style={{
                fontSize: isDesktop ? 36 : 28,
                fontWeight: "700",
                color: colors.foreground,
                textAlign: "center",
                marginBottom: 48,
              }}
            >
              Everything You Need to Pass
            </Text>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 24,
                justifyContent: "center",
              }}
            >
              {FEATURES.map((feature, i) => (
                <View
                  key={i}
                  style={{
                    width: isDesktop ? "calc(33.333% - 16px)" : "100%",
                    maxWidth: 400,
                  }}
                >
                  <Card className="p-6 h-full">
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: colors.primaryMuted,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <MaterialIcons
                        name={feature.icon as any}
                        size={24}
                        color={colors.primary}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "600",
                        color: colors.foreground,
                        marginBottom: 8,
                      }}
                    >
                      {feature.title}
                    </Text>
                    <Text style={{ color: colors.muted, lineHeight: 24 }}>
                      {feature.description}
                    </Text>
                  </Card>
                </View>
              ))}
            </View>
          </Container>
        </View>

        {/* Pricing Section */}
        <View style={{ backgroundColor: colors.surface, paddingVertical: isDesktop ? 80 : 48 }}>
          <Container size="md">
            <Text
              style={{
                fontSize: isDesktop ? 36 : 28,
                fontWeight: "700",
                color: colors.foreground,
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Simple, One-Time Pricing
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: colors.muted,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              No subscriptions. No hidden fees. Lifetime access.
            </Text>

            <Card
              variant="elevated"
              className="p-8 overflow-hidden"
              style={{ borderWidth: 2, borderColor: colors.primary }}
            >
              {/* Best Value Badge */}
              <View
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
                <Text style={{ color: "#FFFFFF", fontWeight: "600", fontSize: 13 }}>
                  Best Value
                </Text>
              </View>

              <View className="items-center">
                <Text
                  style={{ fontSize: 56, fontWeight: "800", color: colors.foreground }}
                >
                  $37
                </Text>
                <Text style={{ fontSize: 16, color: colors.muted, marginTop: 4 }}>
                  One-time payment
                </Text>

                <View style={{ marginTop: 32, marginBottom: 32, gap: 16, width: "100%" }}>
                  {[
                    "All 287 exam questions",
                    "Detailed explanations & mnemonics",
                    "Progress tracking across devices",
                    "Lifetime updates",
                    "Money-back guarantee",
                  ].map((item, i) => (
                    <View key={i} className="flex-row items-center" style={{ gap: 12 }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: colors.successMuted,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialIcons name="check" size={16} color={colors.success} />
                      </View>
                      <Text style={{ color: colors.foreground, fontSize: 16 }}>{item}</Text>
                    </View>
                  ))}
                </View>

                <Button
                  variant="primary"
                  size="xl"
                  fullWidth
                  onPress={handleGetFullAccess}
                >
                  Get Full Access Now
                </Button>

                <Text
                  style={{
                    color: colors.muted,
                    fontSize: 13,
                    marginTop: 16,
                    textAlign: "center",
                  }}
                >
                  Secure payment via Square. 30-day money-back guarantee.
                </Text>
              </View>
            </Card>

            {/* Free Trial Card */}
            <Card className="p-6 mt-6">
              <View
                style={{
                  flexDirection: isDesktop ? "row" : "column",
                  alignItems: isDesktop ? "center" : "stretch",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: colors.foreground }}>
                    Not sure yet? Try it free!
                  </Text>
                  <Text style={{ color: colors.muted, marginTop: 4 }}>
                    Get 3 sample questions from each category to experience our approach.
                  </Text>
                </View>
                <Button variant="outline" size="lg" onPress={handleStartTrial}>
                  Start Free Trial
                </Button>
              </View>
            </Card>
          </Container>
        </View>

        {/* Testimonial */}
        <View style={{ paddingVertical: isDesktop ? 80 : 48 }}>
          <Container size="md">
            <Card className="p-8" variant="elevated">
              <View className="items-center">
                <View className="flex-row mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <MaterialIcons key={i} name="star" size={24} color={colors.warning} />
                  ))}
                </View>
                <Text
                  style={{
                    fontSize: isDesktop ? 20 : 17,
                    color: colors.foreground,
                    textAlign: "center",
                    lineHeight: isDesktop ? 32 : 28,
                    fontStyle: "italic",
                    maxWidth: 600,
                  }}
                >
                  "I failed the NYS exam twice using generic MBLEx prep. This app's Eastern
                  Medicine mnemonics and NYS-specific content made all the difference.
                  Passed on my third try!"
                </Text>
                <Text
                  style={{
                    color: colors.muted,
                    marginTop: 16,
                    fontWeight: "600",
                  }}
                >
                  — Sarah M., Licensed Massage Therapist
                </Text>
              </View>
            </Card>
          </Container>
        </View>

        {/* Final CTA */}
        <View
          style={{
            backgroundColor: colors.primary,
            paddingVertical: isDesktop ? 64 : 48,
          }}
        >
          <Container>
            <View className="items-center">
              <Text
                style={{
                  fontSize: isDesktop ? 32 : 24,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                Ready to Pass Your Exam?
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                Join 500+ students who trusted us to prepare for their NYS exam.
              </Text>
              <Button
                variant="secondary"
                size="lg"
                onPress={handleGetFullAccess}
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 16 }}>
                  Get Started for $37
                </Text>
              </Button>
            </View>
          </Container>
        </View>

        {/* Footer */}
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingVertical: 32,
          }}
        >
          <Container>
            <View
              style={{
                flexDirection: isDesktop ? "row" : "column",
                justifyContent: "space-between",
                alignItems: isDesktop ? "center" : "flex-start",
                gap: 16,
              }}
            >
              <View className="flex-row items-center" style={{ gap: 8 }}>
                <MaterialIcons name="spa" size={20} color={colors.primary} />
                <Text style={{ fontWeight: "600", color: colors.foreground }}>
                  NYSMassageExam.com
                </Text>
              </View>

              <Text style={{ color: colors.muted, fontSize: 13 }}>
                © 2025 NYSMassageExam.com. All rights reserved. Not affiliated with the
                NYS Education Department.
              </Text>
            </View>
          </Container>
        </View>
      </ScrollView>
    </View>
  );
}
