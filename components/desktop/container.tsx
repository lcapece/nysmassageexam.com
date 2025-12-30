import { View, Platform, useWindowDimensions, ViewProps } from 'react-native';
import { cn } from '@/lib/utils';

interface ContainerProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({ children, className, size = 'xl', ...props }: ContainerProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  return (
    <View
      className={cn(
        'w-full mx-auto',
        isDesktop ? `${sizeClasses[size]} px-8` : 'px-5',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}

export function useIsDesktop() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 1024;
}

export function useIsTablet() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 768 && width < 1024;
}

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  if (Platform.OS !== 'web') return 'mobile';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'mobile';
}
