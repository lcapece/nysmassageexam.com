import { View, Text } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const colors = useColors();

  const variantStyles = {
    default: { bg: colors.surfaceHover, text: colors.muted },
    primary: { bg: colors.primaryMuted, text: colors.primary },
    success: { bg: colors.successMuted, text: colors.success },
    warning: { bg: colors.warningMuted, text: colors.warning },
    error: { bg: colors.errorMuted, text: colors.error },
  };

  const sizeStyles = {
    sm: { px: 8, py: 4, fontSize: 11 },
    md: { px: 12, py: 6, fontSize: 13 },
  };

  const style = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <View
      style={{
        backgroundColor: style.bg,
        paddingHorizontal: sizeStyle.px,
        paddingVertical: sizeStyle.py,
        borderRadius: 999,
      }}
    >
      {typeof children === 'string' ? (
        <Text
          style={{
            color: style.text,
            fontSize: sizeStyle.fontSize,
            fontWeight: '600',
          }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

interface CountdownBadgeProps {
  days: number;
  label?: string;
}

export function CountdownBadge({ days, label = 'days left' }: CountdownBadgeProps) {
  const colors = useColors();
  const urgency = days <= 30 ? 'error' : days <= 90 ? 'warning' : 'primary';

  const urgencyColors = {
    error: { bg: colors.errorMuted, text: colors.error },
    warning: { bg: colors.warningMuted, text: colors.warning },
    primary: { bg: colors.primaryMuted, text: colors.primary },
  };

  const style = urgencyColors[urgency];

  return (
    <View
      style={{
        backgroundColor: style.bg,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: style.text, fontSize: 28, fontWeight: '700' }}>
        {days}
      </Text>
      <Text style={{ color: style.text, fontSize: 12, fontWeight: '500', marginTop: 2 }}>
        {label}
      </Text>
    </View>
  );
}
