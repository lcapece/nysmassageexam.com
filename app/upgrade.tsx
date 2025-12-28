import { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { setPurchased } from "@/lib/study-store";

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

  const handlePurchase = async () => {
    setLoading(true);
    
    // Simulate purchase process
    // In production, this would integrate with Apple/Google in-app purchases
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mark as purchased
    await setPurchased(true);
    
    setLoading(false);
    
    // Navigate back to the app
    router.replace("/(tabs)");
  };

  const handleRestore = async () => {
    setLoading(true);
    
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, mark as purchased
    await setPurchased(true);
    
    setLoading(false);
    router.replace("/(tabs)");
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
            You're currently on the <Text className="font-bold">free trial</Text> with access to 24 sample questions (3 per category).
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

        {/* Pricing */}
        <View className="px-6 mb-6">
          <View className="bg-primary rounded-2xl p-6 items-center">
            <Text className="text-white/80 text-sm uppercase tracking-wider mb-1">
              One-Time Purchase
            </Text>
            <View className="flex-row items-baseline mb-1">
              <Text className="text-white text-5xl font-bold">$37</Text>
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
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text className="text-primary font-bold text-lg text-center">
                  Get Full Access
                </Text>
              )}
            </TouchableOpacity>
            
            <Text className="text-white/60 text-xs text-center mt-3">
              💰 Money-back guarantee if you don't pass
            </Text>
          </View>
        </View>

        {/* Restore */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleRestore}
            disabled={loading}
            className="py-3"
          >
            <Text className="text-primary text-center font-medium">
              Restore Previous Purchase
            </Text>
          </TouchableOpacity>
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
              { feature: "Questions", free: "24", full: "287" },
              { feature: "Categories", free: "All", full: "All" },
              { feature: "Mnemonics", free: "✓", full: "✓" },
              { feature: "Explanations", free: "✓", full: "✓" },
              { feature: "Progress Tracking", free: "Limited", full: "Full" },
              { feature: "Study Modes", free: "Basic", full: "All" },
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
            Payment will be charged to your Apple ID or Google Play account. 
            By purchasing, you agree to our Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
