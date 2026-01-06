import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { setPurchased } from "@/lib/study-store";

// Square Payment Link
const SQUARE_PAYMENT_URL = "https://square.link/u/GNYVqR97";

// Supabase Edge Function URL (for restore purchases)
const SUPABASE_URL = "https://ekklokrukxmqlahtonnc.supabase.co";

// Valid promo codes - LNC3690 gives $37 off (100% discount = free)
const PROMO_CODES: Record<string, { discount: number; description: string }> = {
  "LNC3690": { discount: 37, description: "Full discount - FREE access!" },
};

const FEATURES = [
  { icon: "✅", text: "All 287 exam questions" },
  { icon: "🧠", text: "Mnemonics for every question" },
  { icon: "📚", text: "Detailed explanations" },
  { icon: "📊", text: "Progress tracking" },
  { icon: "🎯", text: "All study modes" },
  { icon: "💰", text: "Money-back guarantee" },
];

export default function UpgradeScreen() {
  const router = useRouter();
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState<{ discount: number; description: string } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const basePrice = 37;
  const finalPrice = promoApplied ? Math.max(0, basePrice - promoApplied.discount) : basePrice;
  const isFree = finalPrice === 0;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    setPromoError("");

    if (!code) {
      setPromoError("Please enter a promo code");
      return;
    }

    const promo = PROMO_CODES[code];
    if (promo) {
      setPromoApplied(promo);
      setPromoError("");
    } else {
      setPromoApplied(null);
      setPromoError("Invalid promo code");
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode("");
    setPromoError("");
  };

  const handlePurchase = async () => {
    // If promo code gives 100% discount (free)
    if (isFree && promoApplied) {
      setLoading(true);
      try {
        await setPurchased(true);
        if (Platform.OS === 'web') {
          window.alert("Success! Full access unlocked with promo code.");
        } else {
          Alert.alert("Success!", "Full access unlocked with promo code.", [{ text: "OK" }]);
        }
        router.replace("/(tabs)");
        return;
      } finally {
        setLoading(false);
      }
    }

    // Open Square payment link
    if (Platform.OS === 'web') {
      window.open(SQUARE_PAYMENT_URL, '_blank');
    } else {
      await Linking.openURL(SQUARE_PAYMENT_URL);
    }
  };

  const handleRestore = async () => {
    if (!email.trim()) {
      setEmailError("Please enter your email to restore purchase");
      return;
    }
    if (!validateEmail(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/nys-massage-check-purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (data.hasPurchased) {
        await setPurchased(true);
        if (Platform.OS === 'web') {
          window.alert("Purchase restored successfully!");
        } else {
          Alert.alert("Success!", "Purchase restored successfully!");
        }
        router.replace("/(tabs)");
      } else {
        if (Platform.OS === 'web') {
          window.alert("No purchase found for this email address.");
        } else {
          Alert.alert("Not Found", "No purchase found for this email address.");
        }
      }
    } catch (error: any) {
      console.error("Restore error:", error);
      if (Platform.OS === 'web') {
        window.alert("Failed to restore purchase. Please try again.");
      } else {
        Alert.alert("Error", "Failed to restore purchase. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-4">
          <TouchableOpacity onPress={() => router.back()} className="mb-4">
            <Text className="text-primary text-base">← Back</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View className="px-6 items-center mb-8">
          <Text className="text-5xl mb-4">🔓</Text>
          <Text className="text-2xl font-bold text-foreground text-center mb-2">
            Unlock Full Access
          </Text>
          <Text className="text-muted text-center">
            Get everything you need to pass the NYS Massage Therapy Exam
          </Text>
        </View>

        {/* Trial Info */}
        <View className="mx-6 bg-warning/10 rounded-xl p-4 border border-warning/30 mb-6">
          <Text className="text-foreground text-center">
            You're currently on the <Text className="font-bold">free trial</Text> with access to 25 sample questions.
          </Text>
        </View>

        {/* Features */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4">
            What you'll get:
          </Text>
          {FEATURES.map((feature, index) => (
            <View key={index} className="flex-row items-center mb-3">
              <Text className="text-xl mr-3">{feature.icon}</Text>
              <Text className="text-foreground text-base flex-1">
                {feature.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Promo Code Section */}
        <View className="px-6 mb-4">
          <View className="bg-surface rounded-xl border border-border p-4">
            <Text className="text-foreground font-medium mb-3">Have a promo code?</Text>

            {promoApplied ? (
              <View className="bg-success/10 rounded-lg p-3 border border-success/30">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-success font-bold text-base">
                      {promoCode.toUpperCase()} applied!
                    </Text>
                    <Text className="text-success/80 text-sm">
                      {promoApplied.description}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleRemovePromo}
                    className="bg-success/20 rounded-full px-3 py-1"
                  >
                    <Text className="text-success font-medium">Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View className="flex-row gap-2">
                  <TextInput
                    value={promoCode}
                    onChangeText={(text) => {
                      setPromoCode(text);
                      setPromoError("");
                    }}
                    placeholder="Enter promo code"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="characters"
                    className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                    style={{ color: colors.foreground }}
                  />
                  <TouchableOpacity
                    onPress={handleApplyPromo}
                    className="bg-primary rounded-lg px-4 py-3"
                  >
                    <Text className="text-white font-medium">Apply</Text>
                  </TouchableOpacity>
                </View>
                {promoError ? (
                  <Text className="text-error text-sm mt-2">{promoError}</Text>
                ) : null}
              </View>
            )}
          </View>
        </View>

        {/* Pricing */}
        <View className="px-6 mb-6">
          <View className={`${isFree ? 'bg-success' : 'bg-primary'} rounded-2xl p-6 items-center`}>
            <Text className="text-white/80 text-sm uppercase tracking-wider mb-1">
              {isFree ? 'Promo Applied' : 'One-Time Purchase'}
            </Text>
            <View className="flex-row items-baseline mb-1">
              {promoApplied && !isFree ? (
                <>
                  <Text className="text-white/60 text-2xl line-through mr-2">${basePrice}</Text>
                  <Text className="text-white text-5xl font-bold">${finalPrice}</Text>
                </>
              ) : isFree ? (
                <>
                  <Text className="text-white/60 text-2xl line-through mr-2">${basePrice}</Text>
                  <Text className="text-white text-5xl font-bold">FREE</Text>
                </>
              ) : (
                <Text className="text-white text-5xl font-bold">${basePrice}</Text>
              )}
            </View>
            <Text className="text-white/80 text-center mb-4">
              Lifetime access • No subscription
            </Text>

            <TouchableOpacity
              onPress={handlePurchase}
              disabled={loading}
              className="bg-white rounded-full px-8 py-4 w-full"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={isFree ? colors.success : colors.primary} />
              ) : (
                <Text className={`${isFree ? 'text-success' : 'text-primary'} font-bold text-lg text-center`}>
                  {isFree ? 'Unlock Free Access' : 'Get Full Access'}
                </Text>
              )}
            </TouchableOpacity>

            <Text className="text-white/60 text-xs text-center mt-3">
              {isFree ? '🎉 Enjoy your free access!' : '🔒 Secure payment via Square'}
            </Text>
          </View>
        </View>

        {/* Restore Purchase */}
        <View className="px-6 mb-8">
          <View className="bg-surface rounded-xl border border-border p-4">
            <Text className="text-foreground font-medium mb-3">Already purchased?</Text>
            <Text className="text-muted text-sm mb-3">
              Enter the email you used at checkout to restore your access.
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                placeholder="email@example.com"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground"
                style={{ color: colors.foreground }}
              />
              <TouchableOpacity
                onPress={handleRestore}
                disabled={loading}
                className="bg-primary/10 rounded-lg px-4 py-3"
              >
                {loading ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text className="text-primary font-medium">Restore</Text>
                )}
              </TouchableOpacity>
            </View>
            {emailError ? (
              <Text className="text-error text-sm mt-2">{emailError}</Text>
            ) : null}
          </View>
        </View>

        {/* Comparison */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-semibold text-foreground mb-4 text-center">
            Free Trial vs Full Access
          </Text>
          <View className="bg-surface rounded-xl border border-border overflow-hidden">
            {/* Header */}
            <View className="flex-row border-b border-border">
              <View className="flex-1 p-3">
                <Text className="text-muted font-medium">Feature</Text>
              </View>
              <View className="w-20 p-3 items-center border-l border-border">
                <Text className="text-muted font-medium">Free</Text>
              </View>
              <View className="w-20 p-3 items-center border-l border-border bg-primary/10">
                <Text className="text-primary font-medium">Full</Text>
              </View>
            </View>

            {/* Rows */}
            {[
              { feature: "Questions", free: "25", full: "287" },
              { feature: "Categories", free: "All", full: "All" },
              { feature: "Mnemonics", free: "✓", full: "✓" },
              { feature: "Explanations", free: "✓", full: "✓" },
              { feature: "Progress Tracking", free: "Limited", full: "Full" },
              { feature: "Pencil Test", free: "25 Q", full: "140 Q" },
            ].map((row, index) => (
              <View key={index} className="flex-row border-b border-border last:border-b-0">
                <View className="flex-1 p-3">
                  <Text className="text-foreground">{row.feature}</Text>
                </View>
                <View className="w-20 p-3 items-center border-l border-border">
                  <Text className="text-muted">{row.free}</Text>
                </View>
                <View className="w-20 p-3 items-center border-l border-border bg-primary/10">
                  <Text className="text-primary font-medium">{row.full}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View className="px-6 pb-8">
          <Text className="text-muted text-xs text-center">
            Secure payment processed by Square.
            By purchasing, you agree to our Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
