import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { hasStartedQuiz, hasPurchased as checkPurchased } from "@/lib/study-store";
import { useColors } from "@/hooks/use-colors";

export default function Index() {
  const router = useRouter();
  const colors = useColors();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Check if user has started quiz or purchased
        const [started, purchased] = await Promise.all([
          hasStartedQuiz(),
          checkPurchased(),
        ]);

        if (started || purchased) {
          // Returning user - go straight to study dashboard
          router.replace("/(tabs)");
        } else {
          // New user - show landing page
          router.replace("/landing");
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        // Default to landing page on error
        router.replace("/landing");
      } finally {
        setChecking(false);
      }
    };

    checkUserStatus();
  }, [router]);

  // Show loading while checking
  if (checking) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.muted }}>Loading...</Text>
      </View>
    );
  }

  return null;
}
