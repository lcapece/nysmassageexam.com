import { useState, useEffect } from 'react';
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
  const isDesktop = useIsDesktop();

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

// Use mounted state to prevent hydration mismatch
export function useIsDesktop() {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return false on initial server render to prevent hydration mismatch
  if (!mounted) return false;
  return Platform.OS === 'web' && width >= 1024;
}

export function useIsTablet() {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return false;
  return Platform.OS === 'web' && width >= 768 && width < 1024;
}

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (Platform.OS !== 'web') return 'mobile';
  if (!mounted) return 'mobile';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'mobile';
}
