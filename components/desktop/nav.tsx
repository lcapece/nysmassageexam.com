import { View, Text, Pressable, Platform, useWindowDimensions, ScrollView, Linking } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColors } from '@/hooks/use-colors';

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

// Informative articles for exam preparation
interface Article {
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  href: string;
}

const articles: Article[] = [
  {
    title: 'NYS Exam Overview',
    description: 'Exam format, passing scores & what to expect',
    icon: 'school',
    color: '#0D9373',
    href: '/exam-info',
  },
  {
    title: 'Eastern Medicine Tips',
    description: 'Master meridians & Yin/Yang theory',
    icon: 'self-improvement',
    color: '#F97316',
    href: '/study?category=eastern',
  },
  {
    title: 'Anatomy Essentials',
    description: 'Key muscles, bones & body systems',
    icon: 'accessibility-new',
    color: '#4F46E5',
    href: '/study?category=anatomy',
  },
  {
    title: 'Ethics & Business',
    description: 'Professional standards & NY regulations',
    icon: 'gavel',
    color: '#059669',
    href: '/study?category=ethics',
  },
  {
    title: 'Study Strategies',
    description: 'Proven techniques for exam success',
    icon: 'psychology',
    color: '#D97706',
    href: '/exam-info#study-tips',
  },
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
      <View className="py-4 px-3">
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

      {/* Articles Section */}
      <View className="flex-1 px-3 pb-2">
        <View className="px-4 py-2 mb-2">
          <Text className="text-xs font-semibold text-muted uppercase tracking-wider">
            Exam Resources
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {articles.map((article, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(article.href as any)}
            >
              {({ hovered }: any) => (
                <View
                  className="px-3 py-3 rounded-xl mb-1"
                  style={{
                    backgroundColor: hovered ? colors.surfaceHover : 'transparent',
                  }}
                >
                  <View className="flex-row items-start">
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: `${article.color}15`,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}
                    >
                      <MaterialIcons
                        name={article.icon}
                        size={18}
                        color={article.color}
                      />
                    </View>
                    <View className="flex-1">
                      <Text
                        className="text-sm font-medium"
                        style={{ color: colors.foreground }}
                        numberOfLines={1}
                      >
                        {article.title}
                      </Text>
                      <Text
                        className="text-xs mt-0.5"
                        style={{ color: colors.muted }}
                        numberOfLines={2}
                      >
                        {article.description}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </Pressable>
          ))}
        </ScrollView>
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
