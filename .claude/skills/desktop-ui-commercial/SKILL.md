---
name: Commercial Desktop UI
description: This skill should be used when the user asks to "redesign the UI", "make the UI commercial quality", "fix the desktop layout", "improve the web app design", "make it look professional", "enterprise-level UI", or mentions desktop mode, web app styling, or commercial-grade interface design. Transforms mobile-first React Native Web apps into stunning desktop-class experiences.
version: 1.0.0
---

# Commercial Desktop UI Design for React Native Web

Transform mobile-first React Native/Expo web apps into stunning, commercial-grade desktop experiences. This skill applies to apps using NativeWind/Tailwind CSS with React Native Web.

## Core Principle: Desktop-First Mindset

Desktop users expect DRAMATICALLY different experiences than mobile users:
- **Expansive layouts** utilizing 1920x1080+ screen real estate
- **Information density** - show more, scroll less
- **Hover states** and micro-interactions everywhere
- **Multi-column layouts** with sidebars, split views
- **Sophisticated typography** with proper hierarchy
- **Professional polish** matching SaaS products like Linear, Notion, Figma

## Implementation Checklist

### 1. Responsive Container System

Replace mobile-centric `mx-5 px-5` padding with responsive containers:

```tsx
// Create components/desktop-container.tsx
import { View, Platform } from 'react-native';

export function DesktopContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const isWeb = Platform.OS === 'web';

  return (
    <View className={`
      ${isWeb ? 'max-w-7xl mx-auto px-8 lg:px-12' : 'px-5'}
      ${className}
    `}>
      {children}
    </View>
  );
}
```

### 2. Grid-Based Layouts

Desktop demands multi-column grids, not single-column stacks:

```tsx
// Stats grid - 3-4 columns on desktop
<View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {stats.map(stat => <StatCard key={stat.id} {...stat} />)}
</View>

// Dashboard layout with sidebar
<View className="flex-row min-h-screen">
  <View className="hidden lg:flex w-64 border-r border-border bg-surface">
    <Sidebar />
  </View>
  <View className="flex-1">
    <MainContent />
  </View>
</View>
```

### 3. Typography Scale for Desktop

Establish clear visual hierarchy with larger, bolder headings:

```tsx
// Hero/Page titles
<Text className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">

// Section headings
<Text className="text-2xl lg:text-3xl font-semibold">

// Card titles
<Text className="text-lg lg:text-xl font-medium">

// Body text
<Text className="text-base lg:text-lg leading-relaxed">
```

### 4. Hover States & Micro-Interactions

Desktop users expect feedback on every interactive element:

```tsx
// Card with hover effect
<Pressable
  className="group"
  style={({ hovered, pressed }) => [
    {
      transform: [{ scale: hovered ? 1.02 : pressed ? 0.98 : 1 }],
      transition: 'all 0.2s ease',
    }
  ]}
>
  <View className="bg-surface border border-border rounded-xl p-6
    group-hover:border-primary group-hover:shadow-lg transition-all duration-200">
    {/* Content */}
  </View>
</Pressable>

// Button with sophisticated hover
<Pressable
  style={({ hovered, pressed }) => [
    {
      backgroundColor: hovered ? colors.primaryHover : colors.primary,
      transform: [{ translateY: pressed ? 1 : 0 }],
    }
  ]}
  className="rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition-all"
>
```

### 5. Sophisticated Color Palette

Commercial apps use refined, muted palettes with strategic accent colors:

```tsx
// In theme or colors hook - add desktop-specific tokens
const desktopColors = {
  // Backgrounds
  background: '#0A0A0B',      // Near-black for dark mode
  surface: '#141415',          // Slightly elevated
  surfaceHover: '#1C1C1E',    // Hover state
  surfaceActive: '#252528',   // Active/pressed

  // Borders
  border: '#2A2A2D',          // Subtle
  borderHover: '#3A3A3E',     // Interactive borders

  // Text
  foreground: '#FAFAFA',      // Primary text
  muted: '#A1A1AA',           // Secondary text
  subtle: '#71717A',          // Tertiary text

  // Accent - choose ONE bold accent
  primary: '#6366F1',         // Indigo
  primaryHover: '#818CF8',
  primaryMuted: '#6366F1/10',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
};
```

### 6. Card Design System

Cards are the building blocks of desktop dashboards:

```tsx
// Base card component
function Card({
  children,
  hover = true,
  className = ''
}: {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
}) {
  return (
    <View className={`
      bg-surface border border-border rounded-xl p-6
      ${hover ? 'hover:border-border-hover hover:shadow-lg transition-all duration-200' : ''}
      ${className}
    `}>
      {children}
    </View>
  );
}

// Stat card with icon
function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <Card className="flex-row items-start justify-between">
      <View>
        <Text className="text-sm text-muted uppercase tracking-wide">{label}</Text>
        <Text className="text-3xl font-bold text-foreground mt-1">{value}</Text>
        {trend && (
          <View className="flex-row items-center mt-2">
            <Text className={trend > 0 ? 'text-success' : 'text-error'}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      <View className="bg-primary/10 rounded-lg p-3">
        {icon}
      </View>
    </Card>
  );
}
```

### 7. Navigation for Desktop

Replace bottom tabs with sophisticated sidebar or top nav:

```tsx
// Sidebar navigation
function DesktopSidebar() {
  return (
    <View className="w-64 h-screen bg-surface border-r border-border flex-col">
      {/* Logo */}
      <View className="p-6 border-b border-border">
        <Text className="text-xl font-bold text-foreground">NYS Massage Exam</Text>
      </View>

      {/* Nav items */}
      <View className="flex-1 py-4">
        {navItems.map(item => (
          <NavItem key={item.href} {...item} />
        ))}
      </View>

      {/* Bottom section */}
      <View className="p-4 border-t border-border">
        <UserMenu />
      </View>
    </View>
  );
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  return (
    <Pressable
      className={`
        flex-row items-center px-4 py-3 mx-2 rounded-lg
        ${active ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface-hover hover:text-foreground'}
        transition-colors duration-150
      `}
    >
      {icon}
      <Text className="ml-3 font-medium">{label}</Text>
    </Pressable>
  );
}
```

### 8. Data Tables for Desktop

Replace mobile cards with proper tables when appropriate:

```tsx
function DataTable({ columns, data }: TableProps) {
  return (
    <View className="overflow-x-auto rounded-xl border border-border">
      {/* Header */}
      <View className="flex-row bg-surface-hover border-b border-border">
        {columns.map(col => (
          <View key={col.key} className="px-6 py-4 flex-1">
            <Text className="text-sm font-semibold text-muted uppercase tracking-wide">
              {col.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Rows */}
      {data.map((row, i) => (
        <View
          key={i}
          className="flex-row border-b border-border last:border-0 hover:bg-surface-hover transition-colors"
        >
          {columns.map(col => (
            <View key={col.key} className="px-6 py-4 flex-1">
              <Text className="text-foreground">{row[col.key]}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
```

### 9. Form Controls for Desktop

Larger, more spacious inputs with clear focus states:

```tsx
function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="space-y-2">
      {label && (
        <Text className="text-sm font-medium text-foreground">{label}</Text>
      )}
      <TextInput
        className={`
          w-full px-4 py-3 rounded-lg border bg-surface text-foreground
          ${error ? 'border-error' : 'border-border focus:border-primary'}
          focus:ring-2 focus:ring-primary/20 transition-all
        `}
        placeholderTextColor={colors.muted}
        {...props}
      />
      {error && (
        <Text className="text-sm text-error">{error}</Text>
      )}
    </View>
  );
}

function Button({ variant = 'primary', size = 'md', children, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover',
    secondary: 'bg-surface border border-border text-foreground hover:bg-surface-hover',
    ghost: 'text-foreground hover:bg-surface-hover',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <Pressable
      className={`
        rounded-lg font-medium transition-all duration-150
        ${variants[variant]} ${sizes[size]}
      `}
      {...props}
    >
      {children}
    </Pressable>
  );
}
```

### 10. Motion & Animations

Subtle, professional animations that enhance without distracting:

```tsx
// Page transitions
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';

function AnimatedCard({ children, delay = 0 }) {
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(300)}
      className="bg-surface rounded-xl p-6 border border-border"
    >
      {children}
    </Animated.View>
  );
}

// Staggered list animations
function StaggeredList({ items }) {
  return (
    <View>
      {items.map((item, i) => (
        <AnimatedCard key={item.id} delay={i * 50}>
          {/* Content */}
        </AnimatedCard>
      ))}
    </View>
  );
}
```

## Platform Detection Pattern

Always provide differentiated experiences:

```tsx
import { Platform, useWindowDimensions } from 'react-native';

function useIsDesktop() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 1024;
}

function MyComponent() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <DesktopLayout />;
  }
  return <MobileLayout />;
}
```

## Additional Resources

### Reference Files

For detailed patterns and complete component examples:
- **`references/component-library.md`** - Full component implementations
- **`references/color-systems.md`** - Professional color palette systems
- **`references/layout-patterns.md`** - Dashboard and page layout patterns

## Quick Wins Checklist

When auditing an existing app, address these immediately:

1. [ ] Add `max-w-7xl mx-auto` container to prevent full-width sprawl
2. [ ] Increase all font sizes by 1-2 steps for desktop
3. [ ] Add hover states to ALL interactive elements
4. [ ] Convert single-column layouts to grids
5. [ ] Add proper spacing (gap-6 instead of gap-3)
6. [ ] Implement card hover effects with subtle shadows
7. [ ] Add sidebar navigation for desktop (hide on mobile)
8. [ ] Use icons from a consistent set (Lucide, Heroicons)
9. [ ] Add loading skeletons instead of spinners
10. [ ] Implement proper focus states for accessibility
