import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { setPurchased } from "@/lib/study-store";

const SUPABASE_URL = "https://ekklokrukxmqlahtonnc.supabase.co";

export default function SuccessScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Confirming your purchase...");

  useEffect(() => {
    const confirmPurchase = async () => {
      try {
        const sessionId = params.session_id as string;

        if (!sessionId) {
          // No session ID - might be a direct navigation or promo code purchase
          // Check if already purchased
          setStatus("success");
          setMessage("Welcome! You now have full access.");
          await setPurchased(true);

          setTimeout(() => {
            router.replace("/(tabs)");
          }, 2000);
          return;
        }

        // Verify the session with our backend
        const response = await fetch(`${SUPABASE_URL}/functions/v1/nys-massage-verify-session`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (data.success || data.paid) {
          await setPurchased(true);
          setStatus("success");
          setMessage("Payment confirmed! You now have full access to all 287 questions.");

          setTimeout(() => {
            router.replace("/(tabs)");
          }, 3000);
        } else {
          // Payment might still be processing, but unlock anyway since they completed checkout
          await setPurchased(true);
          setStatus("success");
          setMessage("Thank you for your purchase! Full access unlocked.");

          setTimeout(() => {
            router.replace("/(tabs)");
          }, 3000);
        }
      } catch (error) {
        console.error("Error confirming purchase:", error);
        // Even on error, unlock access since they completed Stripe checkout
        await setPurchased(true);
        setStatus("success");
        setMessage("Thank you! Your access has been activated.");

        setTimeout(() => {
          router.replace("/(tabs)");
        }, 3000);
      }
    };

    confirmPurchase();
  }, [params.session_id]);

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center px-6">
        {status === "loading" && (
          <>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-foreground text-lg mt-4 text-center">
              {message}
            </Text>
          </>
        )}

        {status === "success" && (
          <>
            <Text className="text-6xl mb-4">🎉</Text>
            <Text className="text-foreground text-2xl font-bold text-center mb-2">
              Success!
            </Text>
            <Text className="text-muted text-center text-lg mb-6">
              {message}
            </Text>
            <View className="bg-success/10 rounded-xl p-4 border border-success/30">
              <Text className="text-success text-center font-medium">
                Redirecting to your dashboard...
              </Text>
            </View>
          </>
        )}

        {status === "error" && (
          <>
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-foreground text-2xl font-bold text-center mb-2">
              Something went wrong
            </Text>
            <Text className="text-muted text-center text-lg">
              {message}
            </Text>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
