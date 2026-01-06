import { ScrollView, Text, View, Pressable, Linking, Platform } from "react-native";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function GuaranteeScreen() {
  const router = useRouter();
  const colors = useColors();

  const handleEmailRequest = () => {
    const subject = encodeURIComponent("Money-Back Guarantee Request - NYS Massage Exam Prep");
    const body = encodeURIComponent(
      `Hello,

I am requesting a refund under the Money-Back Guarantee policy.

Full Name: [Your Full Name]
Email Used for Purchase: [Your Email]

I did not pass the NYS Massage Therapy Exam.

Please process my refund request.

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
            <Text className="text-2xl font-bold text-foreground">Money-Back Guarantee</Text>
            <Text className="text-base text-muted">Our commitment to your success</Text>
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
              Pass or Your Money Back
            </Text>
            <Text className="text-base text-muted text-center leading-6">
              We're so confident in our exam prep materials that we guarantee your success.
            </Text>
          </View>
        </View>

        {/* The Promise */}
        <View className="px-5 mt-6">
          <View className="bg-surface rounded-xl p-5 border border-border">
            <View className="flex-row items-center mb-4">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary + '20' }}
              >
                <MaterialIcons name="handshake" size={20} color={colors.primary} />
              </View>
              <Text className="text-lg font-bold text-foreground">Our Promise</Text>
            </View>
            <Text className="text-base text-foreground leading-7">
              If you purchase NYS Massage Exam Prep, use our study materials to prepare for the exam, and still don't pass the NYS Massage Therapy Licensing Examination, we will refund your purchase in full. No questions asked.
            </Text>
          </View>
        </View>

        {/* Eligibility Requirements */}
        <View className="px-5 mt-6">
          <Text className="text-xl font-bold text-foreground mb-4">Eligibility Requirements</Text>

          {[
            {
              icon: "calendar-today",
              title: "30-Day Minimum Study Period",
              description: "Your exam date must be at least 30 days after your purchase date. This ensures you have adequate time to study with our materials.",
              highlight: true,
            },
            {
              icon: "event",
              title: "Valid Exam Attempt",
              description: "The guarantee applies to the NYS Massage Therapy Licensing Examination only. You must have taken the official exam administered by NYSED.",
              highlight: false,
            },
            {
              icon: "receipt",
              title: "Proof of Purchase",
              description: "You must have purchased full access to NYS Massage Exam Prep. The guarantee does not apply to free trial users.",
              highlight: false,
            },
          ].map((item, index) => (
            <View
              key={index}
              className="mb-4 rounded-xl p-4"
              style={{
                backgroundColor: item.highlight ? colors.warning + '10' : colors.surface,
                borderWidth: 1,
                borderColor: item.highlight ? colors.warning : colors.border,
              }}
            >
              <View className="flex-row items-start">
                <View
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: item.highlight ? colors.warning + '20' : colors.primary + '20' }}
                >
                  <MaterialIcons
                    name={item.icon as any}
                    size={20}
                    color={item.highlight ? colors.warning : colors.primary}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground mb-1">{item.title}</Text>
                  <Text className="text-sm text-muted leading-5">{item.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Important Note About Timing */}
        <View className="px-5 mt-2">
          <View
            className="rounded-xl p-4"
            style={{ backgroundColor: colors.warning + '15', borderWidth: 1, borderColor: colors.warning }}
          >
            <View className="flex-row items-start">
              <MaterialIcons name="info" size={24} color={colors.warning} style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground mb-2">Important: Exam Timing</Text>
                <Text className="text-sm text-muted leading-5">
                  If your next scheduled exam is less than 30 days from your purchase date, the guarantee will apply to the following exam date (typically 6 months later). The NYS exam is offered only twice per year (March and September).
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* How to Claim */}
        <View className="px-5 mt-6">
          <Text className="text-xl font-bold text-foreground mb-4">How to Claim Your Refund</Text>

          <View className="bg-surface rounded-xl p-5 border border-border">
            {[
              { step: "1", text: "Take the NYS Massage Therapy Exam" },
              { step: "2", text: "If you did not pass, send us an email stating you didn't pass" },
              { step: "3", text: "Receive your full refund within 5-10 business days" },
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
              <Text className="text-lg font-bold text-foreground">Submit Refund Request</Text>
            </View>
            <Text className="text-sm text-muted leading-5 mb-4">
              Send your refund request to the email address below. Just let us know that you didn't pass - no proof required.
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
              question: "What if I purchase the app less than 30 days before the exam?",
              answer: "The guarantee will apply to your next exam attempt, which is typically 6 months later. This policy exists to ensure you have adequate time to study with our materials.",
            },
            {
              question: "Do I need to provide proof that I failed?",
              answer: "No. Simply email us stating that you did not pass the exam. We trust our customers and don't require any documentation.",
            },
            {
              question: "How will I receive my refund?",
              answer: "Refunds are processed to your original payment method. You'll receive a full refund of your purchase price within 5-10 business days.",
            },
            {
              question: "Can I use the guarantee more than once?",
              answer: "The money-back guarantee is valid for one exam attempt per purchase. If you need to retake the exam, you would need to make a new purchase.",
            },
            {
              question: "Is there a time limit on when I can take the exam?",
              answer: "We recommend taking the exam within 12 months of your purchase to ensure you're using up-to-date study materials.",
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
              Study with Confidence
            </Text>
            <Text className="text-base text-muted text-center leading-6 mb-4">
              With our money-back guarantee, you have nothing to lose. Get full access today and start your journey to becoming a licensed massage therapist in New York.
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

        {/* Legal Disclaimer */}
        <View className="px-5 mt-6">
          <Text className="text-xs text-muted text-center leading-4">
            This guarantee is subject to the terms and conditions outlined above. NYS Massage Exam Prep reserves the right to verify all refund requests. Fraudulent claims may result in denial of refund and termination of account access.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
