import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { supabase, getOAuthRedirectUrl } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

type AuthMethod = "select" | "email";

export default function LoginScreen() {
  const router = useRouter();
  const colors = useColors();
  const [authMethod, setAuthMethod] = useState<AuthMethod>("select");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const redirectUrl = getOAuthRedirectUrl();

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== "web",
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (Platform.OS === "web") {
        // Web: the redirect happens automatically
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        // Native: open browser for OAuth
        if (data.url) {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
          );

          if (result.type === "success" && result.url) {
            // Handle the callback URL
            const url = new URL(result.url);
            const accessToken = url.searchParams.get("access_token");
            const refreshToken = url.searchParams.get("refresh_token");

            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              router.replace("/(tabs)");
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const redirectUrl = getOAuthRedirectUrl();

      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== "web",
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (Platform.OS === "web") {
        if (data.url) {
          window.location.href = data.url;
        }
      } else {
        if (data.url) {
          const result = await WebBrowser.openAuthSessionAsync(
            data.url,
            redirectUrl
          );

          if (result.type === "success" && result.url) {
            const url = new URL(result.url);
            const accessToken = url.searchParams.get("access_token");
            const refreshToken = url.searchParams.get("refresh_token");

            if (accessToken && refreshToken) {
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });
              router.replace("/(tabs)");
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Apple login error:", err);
      setError(err.message || "Failed to sign in with Apple");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: getOAuthRedirectUrl(),
        },
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      setEmailSent(true);
    } catch (err: any) {
      console.error("Email login error:", err);
      setError(err.message || "Failed to send magic link");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (authMethod === "email") {
      setAuthMethod("select");
      setEmail("");
      setEmailSent(false);
      setError("");
    } else {
      router.back();
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View className="px-6 pt-4">
            <TouchableOpacity onPress={handleBack} className="mb-6">
              <Text className="text-primary text-base">← Back</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-6 justify-center">
            {/* Logo/Title */}
            <View className="items-center mb-8">
              <Text className="text-4xl mb-4">📚</Text>
              <Text className="text-2xl font-bold text-foreground text-center">
                NYS Massage Exam
              </Text>
              <Text className="text-muted text-center mt-2">
                Sign in to save your progress
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-error/10 border border-error/30 rounded-xl p-3 mb-4">
                <Text className="text-error text-center">{error}</Text>
              </View>
            ) : null}

            {authMethod === "select" ? (
              /* Auth Method Selection */
              <View className="gap-3">
                {/* Google Auth */}
                <TouchableOpacity
                  onPress={handleGoogleLogin}
                  disabled={loading}
                  className="bg-white border border-border rounded-xl px-6 py-4 flex-row items-center justify-center"
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <>
                      <View className="w-6 h-6 mr-3 items-center justify-center">
                        <Text className="text-xl">G</Text>
                      </View>
                      <Text className="text-foreground font-semibold text-base">
                        Continue with Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Apple Auth */}
                <TouchableOpacity
                  onPress={handleAppleLogin}
                  disabled={loading}
                  className="bg-black rounded-xl px-6 py-4 flex-row items-center justify-center"
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <View className="w-6 h-6 mr-3 items-center justify-center">
                        <Text className="text-xl text-white"></Text>
                      </View>
                      <Text className="text-white font-semibold text-base">
                        Continue with Apple
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-4">
                  <View className="flex-1 h-px bg-border" />
                  <Text className="text-muted px-4 text-sm">or</Text>
                  <View className="flex-1 h-px bg-border" />
                </View>

                {/* Email Auth */}
                <TouchableOpacity
                  onPress={() => setAuthMethod("email")}
                  disabled={loading}
                  className="bg-surface border border-border rounded-xl px-6 py-4 flex-row items-center justify-center"
                  activeOpacity={0.8}
                >
                  <View className="w-6 h-6 mr-3 items-center justify-center">
                    <Text className="text-xl">✉️</Text>
                  </View>
                  <Text className="text-foreground font-semibold text-base">
                    Continue with Email
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              /* Email Input */
              <View>
                {emailSent ? (
                  <View className="items-center">
                    <Text className="text-5xl mb-4">📬</Text>
                    <Text className="text-xl font-semibold text-foreground text-center mb-2">
                      Check your email
                    </Text>
                    <Text className="text-muted text-center mb-6">
                      We sent a sign-in link to{"\n"}
                      <Text className="font-semibold text-foreground">{email}</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setEmailSent(false);
                        setEmail("");
                        setError("");
                      }}
                      className="py-2"
                    >
                      <Text className="text-primary font-medium">
                        Use a different email
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <>
                    <Text className="text-foreground font-medium mb-2">
                      Email address
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={(text) => {
                        setEmail(text);
                        setError("");
                      }}
                      placeholder="you@example.com"
                      placeholderTextColor={colors.muted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleEmailLogin}
                      className="bg-surface border border-border rounded-xl px-4 py-4 text-foreground text-base mb-4"
                      style={{ color: colors.foreground }}
                    />
                    <TouchableOpacity
                      onPress={handleEmailLogin}
                      disabled={loading || !email.includes("@")}
                      className="bg-primary rounded-xl px-6 py-4"
                      style={{ opacity: loading || !email.includes("@") ? 0.6 : 1 }}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white font-semibold text-base text-center">
                          Send Magic Link
                        </Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {/* Terms */}
            <Text className="text-muted text-xs text-center mt-8 px-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          {/* Skip for now */}
          <View className="px-6 pb-8">
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              className="py-3"
            >
              <Text className="text-muted text-center">
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
