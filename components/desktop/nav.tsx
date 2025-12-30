import { View, Text, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/(tabs)', icon: 'dashboard' },
  { label: 'Quiz', href: '/(tabs)/quiz', icon: 'quiz' },
  { label: 'Study', href: '/(tabs)/study', icon: 'menu-book' },
  { label: 'Progress', href: '/(tabs)/progress', icon: 'bar-chart' },
];

export function DesktopSidebar() {
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View
      className="w-64 h-full border-r border-border bg-surface flex-col"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Logo */}
      <View className="h-20 px-6 justify-center border-b border-border">
        <Text className="text-xl font-bold text-foreground">NYS Massage Exam</Text>
        <Text className="text-xs text-muted mt-0.5">Study App</Text>
      </View>

      {/* Navigation */}
      <View className="flex-1 py-4 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href === '/(tabs)' && pathname === '/') ||
            (item.href !== '/(tabs)' && pathname.startsWith(item.href));

          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href as any)}
            >
              {({ hovered }: any) => (
                <View
                  className="flex-row items-center px-4 py-3 rounded-xl mb-1"
                  style={{
                    backgroundColor: isActive
                      ? colors.primaryMuted
                      : hovered
                      ? colors.surfaceHover
                      : 'transparent',
                  }}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color={isActive ? colors.primary : colors.muted}
                  />
                  <Text
                    className="ml-3 font-medium"
                    style={{ color: isActive ? colors.primary : colors.foreground }}
                  >
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View
                      className="ml-auto px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-xs font-semibold text-white">{item.badge}</Text>
                    </View>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom section */}
      <View className="border-t border-border p-4">
        <Pressable onPress={() => router.push('/(tabs)/settings' as any)}>
          {({ hovered }: any) => (
            <View
              className="flex-row items-center px-4 py-3 rounded-xl"
              style={{ backgroundColor: hovered ? colors.surfaceHover : 'transparent' }}
            >
              <MaterialIcons name="settings" size={22} color={colors.muted} />
              <Text className="ml-3 font-medium text-foreground">Settings</Text>
            </View>
          )}
        </Pressable>
      </View>
    </View>
  );
}

export function DesktopHeader({ title, subtitle }: { title?: string; subtitle?: string }) {
  const colors = useColors();

  return (
    <View
      className="h-16 px-8 flex-row items-center justify-between border-b border-border"
      style={{ backgroundColor: colors.background }}
    >
      <View>
        {title && <Text className="text-xl font-semibold text-foreground">{title}</Text>}
        {subtitle && <Text className="text-sm text-muted">{subtitle}</Text>}
      </View>
    </View>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function AppShell({ children, showSidebar = true }: AppShellProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;

  if (!isDesktop || !showSidebar) {
    return <View className="flex-1 bg-background">{children}</View>;
  }

  return (
    <View className="flex-row flex-1 bg-background">
      <DesktopSidebar />
      <View className="flex-1">{children}</View>
    </View>
  );
}
