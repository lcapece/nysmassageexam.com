import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useColors } from "@/hooks/use-colors";

export default function OAuthCallback() {
  const router = useRouter();
  const colors = useColors();
  const params = useLocalSearchParams<{
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  }>();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      console.log("[OAuth] Callback handler triggered");

      try {
        // Check for error in params
        if (params.error) {
          console.error("[OAuth] Error in params:", params.error);
          setStatus("error");
          setErrorMessage(params.error_description || params.error);
          return;
        }

        // For web, Supabase handles the hash fragment automatically
        // We just need to check if we have a session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("[OAuth] Session error:", error);
          setStatus("error");
          setErrorMessage(error.message);
          return;
        }

        if (session) {
          console.log("[OAuth] Session found, user:", session.user.email);
          setStatus("success");

          // Redirect to home after a short delay
          setTimeout(() => {
            router.replace("/(tabs)");
          }, 1500);
          return;
        }

        // If no session yet, try to exchange tokens from URL hash (web)
        if (typeof window !== "undefined" && window.location.hash) {
          console.log("[OAuth] Checking URL hash for tokens...");
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            console.log("[OAuth] Found tokens in hash, setting session...");
            const { data, error: setError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (setError) {
              console.error("[OAuth] Set session error:", setError);
              setStatus("error");
              setErrorMessage(setError.message);
              return;
            }

            if (data.session) {
              console.log("[OAuth] Session set successfully");
              setStatus("success");
              setTimeout(() => {
                router.replace("/(tabs)");
              }, 1500);
              return;
            }
          }
        }

        // Check params for tokens (native)
        if (params.access_token && params.refresh_token) {
          console.log("[OAuth] Found tokens in params, setting session...");
          const { data, error: setError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (setError) {
            console.error("[OAuth] Set session error:", setError);
            setStatus("error");
            setErrorMessage(setError.message);
            return;
          }

          if (data.session) {
            console.log("[OAuth] Session set successfully");
            setStatus("success");
            setTimeout(() => {
              router.replace("/(tabs)");
            }, 1500);
            return;
          }
        }

        // No session found
        console.log("[OAuth] No session or tokens found");
        setStatus("error");
        setErrorMessage("No authentication data received");
      } catch (error) {
        console.error("[OAuth] Callback error:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to complete authentication"
        );
      }
    };

    handleCallback();
  }, [params, router]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom", "left", "right"]}>
      <View className="flex-1 items-center justify-center gap-4 p-5">
        {status === "processing" && (
          <>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text className="mt-4 text-base text-center text-foreground">
              Completing authentication...
            </Text>
          </>
        )}
        {status === "success" && (
          <>
            <Text className="text-5xl mb-4">✓</Text>
            <Text className="text-xl font-bold text-center text-foreground">
              Authentication successful!
            </Text>
            <Text className="text-base text-center text-muted">
              Redirecting...
            </Text>
          </>
        )}
        {status === "error" && (
          <>
            <Text className="text-5xl mb-4">⚠️</Text>
            <Text className="mb-2 text-xl font-bold text-center text-error">
              Authentication failed
            </Text>
            <Text className="text-base text-center text-muted">
              {errorMessage}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
