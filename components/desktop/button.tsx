import { Pressable, Text, View, PressableProps, Platform } from 'react-native';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  onPress,
  disabled,
  ...props
}: ButtonProps) {
  const colors = useColors();

  const sizeStyles = {
    sm: { paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, gap: 6, borderRadius: 8 },
    md: { paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, gap: 8, borderRadius: 10 },
    lg: { paddingHorizontal: 28, paddingVertical: 16, fontSize: 16, gap: 10, borderRadius: 12 },
    xl: { paddingHorizontal: 36, paddingVertical: 20, fontSize: 18, gap: 12, borderRadius: 14 },
  };

  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const getVariantStyles = (pressed: boolean, hovered: boolean) => {
    const baseOpacity = disabled ? 0.5 : pressed ? 0.9 : hovered ? 0.95 : 1;
    const scale = pressed ? 0.98 : 1;

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: hovered ? colors.primaryHover : colors.primary,
          borderWidth: 0,
          textColor: '#FFFFFF',
          opacity: baseOpacity,
          transform: [{ scale }],
        };
      case 'secondary':
        return {
          backgroundColor: hovered ? colors.surfaceHover : colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          textColor: colors.foreground,
          opacity: baseOpacity,
          transform: [{ scale }],
        };
      case 'ghost':
        return {
          backgroundColor: hovered ? colors.surfaceHover : 'transparent',
          borderWidth: 0,
          textColor: colors.foreground,
          opacity: baseOpacity,
          transform: [{ scale }],
        };
      case 'outline':
        return {
          backgroundColor: hovered ? colors.primaryMuted : 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
          textColor: colors.primary,
          opacity: baseOpacity,
          transform: [{ scale }],
        };
      case 'danger':
        return {
          backgroundColor: hovered ? colors.error : colors.errorMuted,
          borderWidth: 0,
          textColor: hovered ? '#FFFFFF' : colors.error,
          opacity: baseOpacity,
          transform: [{ scale }],
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderWidth: 0,
          textColor: '#FFFFFF',
          opacity: baseOpacity,
          transform: [{ scale }],
        };
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      {...props}
    >
      {({ pressed, hovered }: any) => {
        const styles = getVariantStyles(pressed, hovered);
        const sizeStyle = sizeStyles[size];

        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: sizeStyle.paddingHorizontal,
              paddingVertical: sizeStyle.paddingVertical,
              borderRadius: sizeStyle.borderRadius,
              backgroundColor: styles.backgroundColor,
              borderWidth: styles.borderWidth,
              borderColor: styles.borderColor,
              opacity: styles.opacity,
              transform: styles.transform,
              gap: sizeStyle.gap,
              ...(fullWidth ? { width: '100%' } : {}),
            }}
            className={className}
          >
            {icon && iconPosition === 'left' && icon}
            {typeof children === 'string' ? (
              <Text
                style={{
                  color: styles.textColor,
                  fontSize: sizeStyle.fontSize,
                  fontWeight: '600',
                }}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {icon && iconPosition === 'right' && icon}
          </View>
        );
      }}
    </Pressable>
  );
}

interface IconButtonProps extends PressableProps {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function IconButton({ icon, variant = 'ghost', size = 'md', ...props }: IconButtonProps) {
  const colors = useColors();

  const sizeStyles = {
    sm: { size: 32, borderRadius: 8 },
    md: { size: 40, borderRadius: 10 },
    lg: { size: 48, borderRadius: 12 },
  };

  return (
    <Pressable {...props}>
      {({ pressed, hovered }: any) => (
        <View
          style={{
            width: sizeStyles[size].size,
            height: sizeStyles[size].size,
            borderRadius: sizeStyles[size].borderRadius,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              variant === 'primary'
                ? colors.primary
                : hovered
                ? colors.surfaceHover
                : 'transparent',
            opacity: pressed ? 0.8 : 1,
          }}
        >
          {icon}
        </View>
      )}
    </Pressable>
  );
}
