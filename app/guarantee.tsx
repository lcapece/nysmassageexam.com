import { ScrollView, Text, View, Pressable, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function GuaranteeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleEmailRequest = () => {
    const subject = encodeURIComponent("Refund Request - NYS Massage Exam Prep");
    const body = encodeURIComponent(
      `Hello,

I am requesting a refund.

Full Name: [Your Full Name]
Email Used for Purchase: [Your Email]

Thank you.`
    );
    const mailtoUrl = `mailto:louis@dataautomation.ai?subject=${subject}&body=${body}`;

    if (Platform.OS === 'web') {
      window.open(mailtoUrl, '_blank');
    } else {
      Linking.openURL(mailtoUrl);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="px-5 pt-4 pb-2 flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <View>
            <Text className="text-2xl font-bold text-foreground">Refund Policy</Text>
            <Text className="text-base text-muted">Simple and hassle-free</Text>
          </View>
        </View>

        {/* Hero Section */}
        <View className="px-5 mt-6">
          <View
            className="rounded-2xl p-6 items-center"
            style={{ backgroundColor: colors.success + '15', borderWidth: 2, borderColor: colors.success }}
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center mb-4"
              style={{ backgroundColor: colors.success + '25' }}
            >
              <MaterialIcons name="verified" size={48} color={colors.success} />
            </View>
            <Text className="text-2xl font-bold text-foreground text-center mb-2">
              30-Day Money-Back Guarantee
            </Text>
            <Text className="text-base text-muted text-center leading-6">
              Full refund within 30 days of purchase. No questions asked.
            </Text>
          </View>
        </View>

        {/* The Policy */}
        <View className="px-5 mt-6">
          <View className="bg-surface rounded-xl p-5 border border-border">
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <MaterialIcons name="handshake" size={20} color={colors.primary} />
              </View>
              <Text className="text-lg font-bold text-foreground">Our Policy</Text>
            </View>
            <Text className="text-base text-foreground leading-7">
              If you're not satisfied with NYS Massage Exam Prep for any reason, simply request a refund within 30 days of your purchase. We'll refund your full purchase price - no questions asked, no hoops to jump through.
            </Text>
          </View>
        </View>

        {/* Simple Requirements */}
        <View className="px-5 mt-6">
          <Text className="text-xl font-bold text-foreground mb-4">It's Simple</Text>

          <View
            className="rounded-xl p-5"
            style={{ backgroundColor: colors.success + '10', borderWidth: 1, borderColor: colors.success }}
          >
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <Text className="text-base font-semibold text-foreground ml-3">Request within 30 days of purchase</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <Text className="text-base font-semibold text-foreground ml-3">Any reason - no explanation needed</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="check-circle" size={24} color={colors.success} />
              <Text className="text-base font-semibold text-foreground ml-3">Just send an email</Text>
            </View>
          </View>
        </View>

        {/* How to Get Refund */}
        <View className="px-5 mt-6">
          <Text className="text-xl font-bold text-foreground mb-4">How to Get Your Refund</Text>

          <View className="bg-surface rounded-xl p-5 border border-border">
            {[
              { step: "1", text: "Send us an email requesting a refund" },
              { step: "2", text: "Receive your full refund within 5-10 business days" },
            ].map((item, index) => (
              <View key={index} className="flex-row items-start mb-4 last:mb-0">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-bold text-sm">{item.step}</Text>
                </View>
                <View className="flex-1 pt-1">
                  <Text className="text-base text-foreground">{item.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View className="px-5 mt-6">
          <View className="bg-surface rounded-xl p-5 border border-border">
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <MaterialIcons name="email" size={20} color={colors.primary} />
              </View>
              <Text className="text-lg font-bold text-foreground">Request a Refund</Text>
            </View>
            <Text className="text-sm text-muted leading-5 mb-4">
              Send your refund request to the email address below. That's it!
            </Text>

            <View
              className="rounded-xl p-4 mb-4"
              style={{ backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}
            >
              <Text className="text-center text-lg font-semibold" style={{ color: colors.primary }}>
                louis@dataautomation.ai
              </Text>
            </View>

            <Pressable
              onPress={handleEmailRequest}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="rounded-xl p-4 flex-row items-center justify-center"
            >
              <MaterialIcons name="send" size={20} color={colors.background} />
              <Text className="text-base font-semibold ml-2" style={{ color: colors.background }}>
                Send Refund Request Email
              </Text>
            </Pressable>
          </View>
        </View>

        {/* FAQ Section */}
        <View className="px-5 mt-6">
          <Text className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</Text>

          {[
            {
              question: "Do I need to give a reason for the refund?",
              answer: "No. You can request a refund for any reason within 30 days of purchase. No explanation needed.",
            },
            {
              question: "How will I receive my refund?",
              answer: "Refunds are processed to your original payment method. You'll receive your full purchase price within 5-10 business days.",
            },
            {
              question: "What if it's been more than 30 days?",
              answer: "Our 30-day guarantee applies to refund requests made within 30 days of your original purchase date. After 30 days, refunds are evaluated on a case-by-case basis.",
            },
          ].map((item, index) => (
            <View key={index} className="mb-4 bg-surface rounded-xl p-4 border border-border">
              <Text className="text-base font-semibold text-foreground mb-2">{item.question}</Text>
              <Text className="text-sm text-muted leading-5">{item.answer}</Text>
            </View>
          ))}
        </View>

        {/* Final CTA */}
        <View className="px-5 mt-6">
          <View
            className="rounded-xl p-5"
            style={{ backgroundColor: colors.success + '10', borderWidth: 1, borderColor: colors.success }}
          >
            <Text className="text-lg font-bold text-foreground text-center mb-2">
              Purchase with Confidence
            </Text>
            <Text className="text-base text-muted text-center leading-6 mb-4">
              With our 30-day money-back guarantee, you have nothing to lose. Try it risk-free!
            </Text>
            <Pressable
              onPress={() => router.push("/upgrade" as any)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.success,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              className="rounded-xl p-4 flex-row items-center justify-center"
            >
              <MaterialIcons name="lock-open" size={20} color="#FFFFFF" />
              <Text className="text-base font-semibold ml-2 text-white">
                Get Full Access - $37
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View className="px-5 mt-8 mb-4">
          <Text className="text-xs text-muted text-center leading-4">
            Created by DataAutomation.ai
          </Text>
          <Text className="text-xs text-muted text-center mt-1">
            © 2026 All Rights Reserved
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
