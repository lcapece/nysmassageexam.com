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

const LOGO_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310419663030336692/NfIEaabGwmxOivXu.png";

// Exam dates - NYS only offers 2 per year
const EXAM_DATES = [
  { date: new Date("2026-03-06"), label: "March 6, 2026", deadline: "Nov 1, 2025" },
  { date: new Date("2026-09-18"), label: "September 18, 2026", deadline: "Jun 1, 2026" },
];

// Stats
const STATS = [
  { value: "287", label: "Questions" },
  { value: "94%", label: "Pass Rate" },
  { value: "500+", label: "Students" },
  { value: "4.9", label: "Rating" },
];

// Category breakdown for visualization
const EXAM_CATEGORIES = [
  { name: "Anatomy", percentage: 28, color: "#2A9D8F", questions: 80 },
  { name: "Physiology", percentage: 22, color: "#E76F51", questions: 63 },
  { name: "Kinesiology", percentage: 18, color: "#F4A261", questions: 52 },
  { name: "Pathology", percentage: 12, color: "#264653", questions: 34 },
  { name: "Eastern Medicine", percentage: 20, color: "#E9C46A", questions: 58 },
];

// Comparison data
const COMPARISON_DATA = [
  { feature: "NYS-Specific Content", us: true, them: false },
  { feature: "Eastern Medicine Focus", us: true, them: false },
  { feature: "Memory Mnemonics", us: true, them: false },
  { feature: "Spaced Repetition", us: true, them: "Limited" },
  { feature: "Wrong Answer Analysis", us: true, them: false },
  { feature: "Paper Exam Strategies", us: true, them: false },
  { feature: "Money-Back Guarantee", us: true, them: false },
];

// Live countdown component - shows Days and Hours prominently
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
        <Text style={{ fontSize: isDesktop ? 48 : 36, fontWeight: "800", color: "#FFFFFF" }}>
          -- Days, -- Hours
        </Text>
      </View>
    );
  }

  return (
    <View className="items-center">
      <View className="flex-row items-baseline" style={{ gap: 4 }}>
        <Text style={{ fontSize: isDesktop ? 64 : 48, fontWeight: "900", color: "#FFFFFF" }}>
          {timeLeft.days}
        </Text>
        <Text style={{ fontSize: isDesktop ? 28 : 22, fontWeight: "700", color: "#FFFFFF" }}>
          Days
        </Text>
        <Text style={{ fontSize: isDesktop ? 64 : 48, fontWeight: "900", color: "#FFFFFF", marginLeft: 12 }}>
          {timeLeft.hours}
        </Text>
        <Text style={{ fontSize: isDesktop ? 28 : 22, fontWeight: "700", color: "#FFFFFF" }}>
          Hours
        </Text>
      </View>
      <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", marginTop: 8, fontWeight: "500" }}>
        until the next NYS Massage Therapy Exam
      </Text>
    </View>
  );
}

// Full countdown timer for the card
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
