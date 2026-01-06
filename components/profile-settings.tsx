import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, TextInput, ActivityIndicator, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/use-colors';
import { Card } from '@/components/desktop/card';

const SUPABASE_URL = 'https://ekklokrukxmqlahtonnc.supabase.co';
const VALIDATE_URL = `${SUPABASE_URL}/functions/v1/nys-massage-validate-display-name`;
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2xva3J1a3htcWxhaHRvbm5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NjY4MTIsImV4cCI6MjA1MDA0MjgxMn0.jRLxTLEPvGdVmHF42tX0gVsePFYmBRIcjjnnWNCEwmQ';

interface ProfileSettingsProps {
  userEmail: string;
  onSave?: (displayName: string, showOnLeaderboard: boolean) => void;
  initialDisplayName?: string;
  initialShowOnLeaderboard?: boolean;
  isSignUp?: boolean;
}

interface ValidationResult {
  valid: boolean;
  reason?: string;
  suggestion?: string;
}

export function ProfileSettings({
  userEmail,
  onSave,
  initialDisplayName = '',
  initialShowOnLeaderboard = true,
  isSignUp = false,
}: ProfileSettingsProps) {
  const colors = useColors();
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [showOnLeaderboard, setShowOnLeaderboard] = useState(initialShowOnLeaderboard);
  const [validating, setValidating] = useState(false);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Debounced validation
  useEffect(() => {
    if (!displayName.trim()) {
      setValidation(null);
      return;
    }

    const timer = setTimeout(async () => {
      setValidating(true);
      try {
        const response = await fetch(VALIDATE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ displayName: displayName.trim() }),
        });

        const result: ValidationResult = await response.json();
        setValidation(result);
      } catch (err) {
        setValidation({ valid: false, reason: 'Validation service unavailable' });
      } finally {
        setValidating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [displayName]);

  const handleSave = async () => {
    if (!validation?.valid) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      // Check if user exists
      const checkResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/nys_massage_students?user_email=eq.${encodeURIComponent(userEmail)}`,
        {
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const existing = await checkResponse.json();

      if (existing.length > 0) {
        // Update existing
        await fetch(
          `${SUPABASE_URL}/rest/v1/nys_massage_students?user_email=eq.${encodeURIComponent(userEmail)}`,
          {
            method: 'PATCH',
            headers: {
              'apikey': ANON_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              display_name: displayName.trim(),
              show_on_leaderboard: showOnLeaderboard,
              display_name_validated: true,
            }),
          }
        );
      } else {
        // Create new
        await fetch(`${SUPABASE_URL}/rest/v1/nys_massage_students`, {
          method: 'POST',
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            user_email: userEmail,
            display_name: displayName.trim(),
            show_on_leaderboard: showOnLeaderboard,
            display_name_validated: true,
            is_mock: false,
          }),
        });

        // Also create SMS settings entry (required for progress tracking FK)
        await fetch(`${SUPABASE_URL}/rest/v1/nys_massage_sms_settings`, {
          method: 'POST',
          headers: {
            'apikey': ANON_KEY,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            user_email: userEmail,
            sms_enabled: false,
            phone_number: '',
          }),
        });
      }

      setSaveSuccess(true);
      onSave?.(displayName.trim(), showOnLeaderboard);

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const applySuggestion = () => {
    if (validation?.suggestion) {
      setDisplayName(validation.suggestion);
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <View
        style={{
          padding: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
          backgroundColor: colors.primaryMuted,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name="person-circle" size={24} color={colors.primary} />
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.foreground }}>
            {isSignUp ? 'Create Your Profile' : 'Profile Settings'}
          </Text>
        </View>
        {isSignUp && (
          <Text style={{ fontSize: 13, color: colors.muted, marginTop: 8, lineHeight: 18 }}>
            Choose a display name for the leaderboard. Your identity remains anonymous -
            this is only used for motivational tracking when you opt in.
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={{ padding: 16 }}>
        {/* Display Name Input */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.foreground, marginBottom: 8 }}>
            Display Name
          </Text>
          <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 12 }}>
            Use "FirstName L." format (e.g., Sarah M.) or a nickname (e.g., MassagePro99)
          </Text>

          <View style={{ position: 'relative' }}>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter display name..."
              placeholderTextColor={colors.muted}
              style={{
                backgroundColor: colors.surface,
                borderWidth: 2,
                borderColor: validation
                  ? validation.valid
                    ? colors.success
                    : colors.error
                  : colors.border,
                borderRadius: 12,
                padding: 14,
                paddingRight: 44,
                fontSize: 16,
                color: colors.foreground,
              }}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <View
              style={{
                position: 'absolute',
                right: 14,
                top: '50%',
                transform: [{ translateY: -10 }],
              }}
            >
              {validating ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : validation ? (
                <Ionicons
                  name={validation.valid ? 'checkmark-circle' : 'alert-circle'}
                  size={20}
                  color={validation.valid ? colors.success : colors.error}
                />
              ) : null}
            </View>
          </View>

          {/* Validation Message */}
          {validation && !validation.valid && (
            <View
              style={{
                marginTop: 8,
                padding: 12,
                backgroundColor: colors.errorMuted,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.error, fontSize: 13 }}>
                {validation.reason}
              </Text>
              {validation.suggestion && (
                <Pressable
                  onPress={applySuggestion}
                  style={{
                    marginTop: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons name="bulb" size={16} color={colors.warning} />
                  <Text style={{ color: colors.warning, fontSize: 13 }}>
                    Try: <Text style={{ fontWeight: '600' }}>{validation.suggestion}</Text>
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {validation?.valid && (
            <View
              style={{
                marginTop: 8,
                padding: 12,
                backgroundColor: colors.successMuted,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: colors.success, fontSize: 13 }}>
                Great display name! This will appear on the leaderboard.
              </Text>
            </View>
          )}
        </View>

        {/* Leaderboard Opt-in */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flex: 1, paddingRight: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '600', color: colors.foreground }}>
              Show on Leaderboard
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              Compete with other students and track your ranking
            </Text>
          </View>
          <Switch
            value={showOnLeaderboard}
            onValueChange={setShowOnLeaderboard}
            trackColor={{ false: colors.border, true: colors.primary }}
          />
        </View>

        {/* Privacy Note */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.surfaceHover,
            borderRadius: 8,
          }}
        >
          <Ionicons name="shield-checkmark" size={18} color={colors.success} style={{ marginTop: 2 }} />
          <Text style={{ flex: 1, marginLeft: 10, fontSize: 12, color: colors.muted, lineHeight: 18 }}>
            Your email and personal information are never shown publicly. Only your display name
            appears on the leaderboard. You can change these settings or opt out anytime.
          </Text>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={!validation?.valid || saving}
          style={{
            marginTop: 20,
            paddingVertical: 14,
            paddingHorizontal: 24,
            backgroundColor: validation?.valid && !saving ? colors.primary : colors.surfaceHover,
            borderRadius: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : saveSuccess ? (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Saved!</Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: validation?.valid ? '#fff' : colors.muted,
                  fontWeight: '600',
                  fontSize: 16,
                }}
              >
                {isSignUp ? 'Continue' : 'Save Changes'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </Card>
  );
}

export default ProfileSettings;
