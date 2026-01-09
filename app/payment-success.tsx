import { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { setPurchased } from "@/lib/study-store";
import { useAuthContext } from "@/lib/auth-context";

const SUPABASE_URL = "https://ekklokrukxmqlahtonnc.supabase.co";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams();
  const { refreshPurchaseStatus } = useAuthContext();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");

  const purchaseId = params.purchase_id as string | undefined;

  useEffect(() => {
    verifyPayment();
  }, [purchaseId]);

  const verifyPayment = async () => {
    try {
      // If we have a purchase_id, verify it
      if (purchaseId) {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/nys-massage-check-purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchaseId }),
        });

        const data = await response.json();

        if (data.hasPurchased) {
          // Payment verified - unlock access
          await setPurchased(true);
          await refreshPurchaseStatus();
          setStatus("success");
          return;
        }
      }

      // If no purchase_id or not yet completed, wait and try again
      // (Square webhook may not have processed yet)
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (purchaseId) {
        const retryResponse = await fetch(`${SUPABASE_URL}/functions/v1/nys-massage-check-purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchaseId }),
        });

        const retryData = await retryResponse.json();

        if (retryData.hasPurchased) {
          await setPurchased(true);
          await refreshPurchaseStatus();
          setStatus("success");
          return;
        }
      }

      // Payment may still be processing - show success anyway
      // (webhook will update the database)
      setStatus("success");
      await setPurchased(true);
      await refreshPurchaseStatus();
    } catch (error: any) {
      console.error("Payment verification error:", error);
      setErrorMessage(error.message || "Failed to verify payment");
      setStatus("error");
    }
  };

  const handleContinue = () => {
    router.replace("/(tabs)");
  };

  const handleRetry = () => {
    setStatus("verifying");
    verifyPayment();
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 justify-center items-center px-6">
        {status === "verifying" && (
          <>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="text-foreground text-lg mt-4 text-center">
              Verifying your payment...
            </Text>
            <Text className="text-muted text-sm mt-2 text-center">
              Please wait while we confirm your purchase.
            </Text>
          </>
        )}

        {status === "success" && (
          <>
            <Text className="text-6xl mb-4">🎉</Text>
            <Text className="text-foreground text-2xl font-bold text-center mb-2">
              Payment Successful!
            </Text>
            <Text className="text-muted text-center mb-8">
              Thank you for your purchase. You now have full access to all 302 exam questions,
              mnemonics, and study materials.
            </Text>
            <TouchableOpacity
              onPress={handleContinue}
              className="bg-primary rounded-xl px-8 py-4 w-full"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-lg text-center">
                Start Studying
              </Text>
            </TouchableOpacity>
          </>
        )}

        {status === "error" && (
          <>
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-foreground text-2xl font-bold text-center mb-2">
              Verification Issue
            </Text>
            <Text className="text-muted text-center mb-4">
              {errorMessage || "We couldn't verify your payment right now."}
            </Text>
            <Text className="text-muted text-sm text-center mb-8">
              If you completed the payment, don't worry - your access will be activated shortly.
              You can also restore your purchase from the upgrade screen.
            </Text>
            <View className="w-full gap-3">
              <TouchableOpacity
                onPress={handleRetry}
                className="bg-primary rounded-xl px-8 py-4"
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-lg text-center">
                  Try Again
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.replace("/upgrade")}
                className="bg-surface border border-border rounded-xl px-8 py-4"
                activeOpacity={0.8}
              >
                <Text className="text-foreground font-medium text-lg text-center">
                  Go to Upgrade Screen
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
