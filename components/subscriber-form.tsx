import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Switch,
} from "react-native";
import { useColors } from "@/hooks/use-colors";
import { supabase } from "@/lib/supabase";

// US States for dropdown
const US_STATES = [
  { value: "", label: "Select State" },
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];

export interface SubscriberFormData {
  email: string;
  mobilePhone: string;
  smsOptIn: boolean;
  address: string;
  city: string;
  state: string;
  zip: string;
  massageSchool: string;
  hasTakenExamBefore: boolean | null;
}

interface SubscriberFormProps {
  onSubmit: (data: SubscriberFormData) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
  initialEmail?: string;
}

export function SubscriberForm({
  onSubmit,
  onCancel,
  submitButtonText = "Continue to Payment",
  initialEmail = "",
}: SubscriberFormProps) {
  const colors = useColors();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SubscriberFormData, string>>>({});

  // Form state
  const [formData, setFormData] = useState<SubscriberFormData>({
    email: initialEmail,
    mobilePhone: "",
    smsOptIn: false,
    address: "",
    city: "",
    state: "",
    zip: "",
    massageSchool: "",
    hasTakenExamBefore: null,
  });

  // State dropdown open state (for custom dropdown on native)
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Optional
    const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const validateZip = (zip: string) => {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zip);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SubscriberFormData, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.mobilePhone && !validatePhone(formData.mobilePhone)) {
      newErrors.mobilePhone = "Please enter a valid phone number";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    } else if (!validateZip(formData.zip.trim())) {
      newErrors.zip = "Please enter a valid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error("Form submission error:", error);
      if (Platform.OS === "web") {
        window.alert(error.message || "Failed to submit. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateField = <K extends keyof SubscriberFormData>(
    field: K,
    value: SubscriberFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderInput = (
    field: keyof SubscriberFormData,
    label: string,
    options: {
      placeholder?: string;
      required?: boolean;
      keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      autoComplete?: string;
      multiline?: boolean;
    } = {}
  ) => {
    const {
      placeholder = "",
      required = false,
      keyboardType = "default",
      autoCapitalize = "sentences",
      autoComplete,
      multiline = false,
    } = options;

    return (
      <View className="mb-4">
        <Text className="text-foreground font-medium mb-1">
          {label}
          {required && <Text className="text-error"> *</Text>}
        </Text>
        <TextInput
          value={formData[field] as string}
          onChangeText={(text) => updateField(field, text as any)}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete as any}
          multiline={multiline}
          className={`bg-background border rounded-lg px-4 py-3 text-foreground ${
            errors[field] ? "border-error" : "border-border"
          }`}
          style={{ color: colors.foreground }}
        />
        {errors[field] && (
          <Text className="text-error text-sm mt-1">{errors[field]}</Text>
        )}
      </View>
    );
  };

  return (
    <View className="flex-1">
      {/* Email - Required */}
      {renderInput("email", "Email Address", {
        placeholder: "your@email.com",
        required: true,
        keyboardType: "email-address",
        autoCapitalize: "none",
        autoComplete: "email",
      })}

      {/* Mobile Phone - Optional */}
      <View className="mb-4">
        <Text className="text-foreground font-medium mb-1">
          Mobile Phone <Text className="text-muted text-sm">(optional)</Text>
        </Text>
        <TextInput
          value={formData.mobilePhone}
          onChangeText={(text) => updateField("mobilePhone", text)}
          placeholder="(555) 123-4567"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          autoComplete="tel"
          className={`bg-background border rounded-lg px-4 py-3 text-foreground ${
            errors.mobilePhone ? "border-error" : "border-border"
          }`}
          style={{ color: colors.foreground }}
        />
        {errors.mobilePhone && (
          <Text className="text-error text-sm mt-1">{errors.mobilePhone}</Text>
        )}

        {/* SMS Opt-in */}
        {formData.mobilePhone.length > 0 && (
          <View className="flex-row items-center mt-2">
            <Switch
              value={formData.smsOptIn}
              onValueChange={(value) => updateField("smsOptIn", value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={formData.smsOptIn ? "#fff" : "#f4f3f4"}
            />
            <Text className="text-muted text-sm ml-2 flex-1">
              Send me updates and study tips via SMS
            </Text>
          </View>
        )}
      </View>

      {/* Address - Required */}
      {renderInput("address", "Street Address", {
        placeholder: "123 Main Street",
        required: true,
        autoComplete: "street-address",
      })}

      {/* City - Required */}
      {renderInput("city", "City", {
        placeholder: "New York",
        required: true,
        autoComplete: "address-level2",
      })}

      {/* State - Required */}
      <View className="mb-4">
        <Text className="text-foreground font-medium mb-1">
          State<Text className="text-error"> *</Text>
        </Text>
        {Platform.OS === "web" ? (
          <View
            className={`bg-background border rounded-lg ${
              errors.state ? "border-error" : "border-border"
            }`}
          >
            <select
              value={formData.state}
              onChange={(e) => updateField("state", e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px",
                backgroundColor: "transparent",
                color: formData.state ? colors.foreground : colors.muted,
                border: "none",
                fontSize: 16,
                outline: "none",
                cursor: "pointer",
              }}
            >
              {US_STATES.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setStateDropdownOpen(!stateDropdownOpen)}
            className={`bg-background border rounded-lg px-4 py-3 ${
              errors.state ? "border-error" : "border-border"
            }`}
          >
            <Text
              style={{
                color: formData.state ? colors.foreground : colors.muted,
              }}
            >
              {formData.state
                ? US_STATES.find((s) => s.value === formData.state)?.label
                : "Select State"}
            </Text>
          </TouchableOpacity>
        )}
        {stateDropdownOpen && Platform.OS !== "web" && (
          <View className="bg-surface border border-border rounded-lg mt-1 max-h-48">
            <ScrollView>
              {US_STATES.filter((s) => s.value).map((state) => (
                <TouchableOpacity
                  key={state.value}
                  onPress={() => {
                    updateField("state", state.value);
                    setStateDropdownOpen(false);
                  }}
                  className="px-4 py-3 border-b border-border"
                >
                  <Text className="text-foreground">{state.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {errors.state && (
          <Text className="text-error text-sm mt-1">{errors.state}</Text>
        )}
      </View>

      {/* ZIP - Required */}
      {renderInput("zip", "ZIP Code", {
        placeholder: "10001",
        required: true,
        keyboardType: "numeric",
        autoComplete: "postal-code",
      })}

      {/* Divider */}
      <View className="border-t border-border my-4" />
      <Text className="text-muted text-sm mb-4">Optional Information</Text>

      {/* Massage School - Optional */}
      {renderInput("massageSchool", "NARE Massage Therapy School", {
        placeholder: "e.g., Swedish Institute",
      })}

      {/* Has Taken Exam Before - Optional */}
      <View className="mb-6">
        <Text className="text-foreground font-medium mb-2">
          Have you taken the NYS Massage Therapy Exam before?
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => updateField("hasTakenExamBefore", true)}
            className={`flex-1 py-3 rounded-lg border ${
              formData.hasTakenExamBefore === true
                ? "bg-primary border-primary"
                : "bg-background border-border"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                formData.hasTakenExamBefore === true
                  ? "text-white"
                  : "text-foreground"
              }`}
            >
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateField("hasTakenExamBefore", false)}
            className={`flex-1 py-3 rounded-lg border ${
              formData.hasTakenExamBefore === false
                ? "bg-primary border-primary"
                : "bg-background border-border"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                formData.hasTakenExamBefore === false
                  ? "text-white"
                  : "text-foreground"
              }`}
            >
              No
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => updateField("hasTakenExamBefore", null)}
            className={`flex-1 py-3 rounded-lg border ${
              formData.hasTakenExamBefore === null
                ? "bg-muted/20 border-muted"
                : "bg-background border-border"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                formData.hasTakenExamBefore === null
                  ? "text-muted"
                  : "text-foreground"
              }`}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-primary rounded-xl py-4 mb-3"
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-lg text-center">
            {submitButtonText}
          </Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      {onCancel && (
        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          className="py-3"
        >
          <Text className="text-muted text-center">Cancel</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Helper function to save subscriber to Supabase
export async function saveSubscriber(
  data: SubscriberFormData,
  purchaseInfo?: {
    purchaseAmount?: number;
    promoCodeUsed?: string;
    paymentMethod?: string;
    userId?: string; // Supabase Auth user ID
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("nys_massage_subscribers").upsert(
      {
        email: data.email.trim().toLowerCase(),
        mobile_phone: data.mobilePhone || null,
        sms_opt_in: data.smsOptIn,
        address: data.address.trim(),
        city: data.city.trim(),
        state: data.state,
        zip: data.zip.trim(),
        massage_school: data.massageSchool.trim() || null,
        has_taken_exam_before: data.hasTakenExamBefore,
        purchased_at: purchaseInfo ? new Date().toISOString() : null,
        purchase_amount: purchaseInfo?.purchaseAmount || null,
        promo_code_used: purchaseInfo?.promoCodeUsed || null,
        payment_method: purchaseInfo?.paymentMethod || null,
        user_id: purchaseInfo?.userId || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "email",
      }
    );

    if (error) {
      console.error("Supabase error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Save subscriber error:", error);
    return { success: false, error: error.message || "Failed to save subscriber information" };
  }
}
