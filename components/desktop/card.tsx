import { View, Text, Pressable, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';
import { useColors } from '@/hooks/use-colors';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
}

export function Card({ children, className, hover = true, variant = 'default', ...props }: CardProps) {
  const variantClasses = {
    default: 'bg-surface border border-border',
    elevated: 'bg-elevated border border-border shadow-lg',
    outlined: 'bg-transparent border-2 border-border',
    ghost: 'bg-transparent',
  };

  return (
    <View
      className={cn(
        'rounded-xl',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  color?: 'default' | 'success' | 'warning' | 'error' | 'primary';
  className?: string;
}

export function StatCard({ label, value, icon, trend, color = 'default', className }: StatCardProps) {
  const colors = useColors();

  const colorStyles = {
    default: { bg: colors.surfaceHover, text: colors.foreground },
    success: { bg: colors.successMuted, text: colors.success },
    warning: { bg: colors.warningMuted, text: colors.warning },
    error: { bg: colors.errorMuted, text: colors.error },
    primary: { bg: colors.primaryMuted, text: colors.primary },
  };

  return (
    <Card className={cn('p-6', className)}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-muted uppercase tracking-wide">
            {label}
          </Text>
          <Text className="text-3xl font-bold text-foreground mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Text>
          {trend !== undefined && (
            <View className="flex-row items-center mt-2">
              <View
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: trend >= 0 ? colors.successMuted : colors.errorMuted }}
              >
                <Text style={{ color: trend >= 0 ? colors.success : colors.error, fontSize: 12, fontWeight: '600' }}>
                  {trend >= 0 ? '+' : ''}{trend}%
                </Text>
              </View>
            </View>
          )}
        </View>
        {icon && (
          <View
            className="w-12 h-12 rounded-xl items-center justify-center"
            style={{ backgroundColor: colorStyles[color].bg }}
          >
            {icon}
          </View>
        )}
      </View>
    </Card>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  const colors = useColors();

  return (
    <Card className={cn('p-6 group', className)}>
      <View
        className="w-12 h-12 rounded-xl items-center justify-center mb-4"
        style={{ backgroundColor: colors.primaryMuted }}
      >
        {icon}
      </View>
      <Text className="text-lg font-semibold text-foreground mb-2">
        {title}
      </Text>
      <Text className="text-muted leading-relaxed">
        {description}
      </Text>
    </Card>
  );
}
