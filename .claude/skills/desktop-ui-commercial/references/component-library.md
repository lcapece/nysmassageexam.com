# Commercial Desktop Component Library

Complete, production-ready component implementations for React Native Web with NativeWind.

## Page Layout Components

### AppShell - Complete Desktop Layout

```tsx
import { View, Platform, useWindowDimensions } from 'react-native';
import { useState } from 'react';

interface AppShellProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

export function AppShell({ children, sidebar, header }: AppShellProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 1024;
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isDesktop) {
    return (
      <View className="flex-1 bg-background">
        {header}
        <View className="flex-1">{children}</View>
      </View>
    );
  }

  return (
    <View className="flex-row min-h-screen bg-background">
      {/* Sidebar */}
      {sidebar && (
        <View
          className={`
            ${sidebarCollapsed ? 'w-16' : 'w-64'}
            border-r border-border bg-surface transition-all duration-200
          `}
        >
          {sidebar}
        </View>
      )}

      {/* Main area */}
      <View className="flex-1 flex-col">
        {/* Header */}
        {header && (
          <View className="h-16 border-b border-border bg-surface/80 backdrop-blur-xl px-6 flex-row items-center">
            {header}
          </View>
        )}

        {/* Content */}
        <View className="flex-1 overflow-auto">
          <View className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </View>
        </View>
      </View>
    </View>
  );
}
```

### ContentArea with Sections

```tsx
interface ContentAreaProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function ContentArea({ title, subtitle, actions, children }: ContentAreaProps) {
  return (
    <View className="space-y-8">
      {/* Page header */}
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-3xl font-bold text-foreground tracking-tight">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-lg text-muted mt-1">{subtitle}</Text>
          )}
        </View>
        {actions && <View className="flex-row gap-3">{actions}</View>}
      </View>

      {/* Content */}
      {children}
    </View>
  );
}
```

## Card Components

### Feature Card with Icon

```tsx
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

export function FeatureCard({ icon, title, description, href, badge }: FeatureCardProps) {
  const content = (
    <View className="relative bg-surface border border-border rounded-2xl p-6 group
      hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">

      {badge && (
        <View className="absolute -top-2 -right-2 bg-primary px-2 py-0.5 rounded-full">
          <Text className="text-xs font-medium text-white">{badge}</Text>
        </View>
      )}

      <View className="w-12 h-12 rounded-xl bg-primary/10 items-center justify-center mb-4
        group-hover:bg-primary/20 transition-colors">
        {icon}
      </View>

      <Text className="text-xl font-semibold text-foreground mb-2
        group-hover:text-primary transition-colors">
        {title}
      </Text>

      <Text className="text-muted leading-relaxed">{description}</Text>

      {href && (
        <View className="flex-row items-center mt-4 text-primary">
          <Text className="font-medium">Learn more</Text>
          <Text className="ml-1 group-hover:translate-x-1 transition-transform">→</Text>
        </View>
      )}
    </View>
  );

  if (href) {
    return <Pressable onPress={() => router.push(href)}>{content}</Pressable>;
  }
  return content;
}
```

### Metric Card with Trend

```tsx
interface MetricCardProps {
  label: string;
  value: string | number;
  previousValue?: number;
  format?: 'number' | 'percent' | 'currency';
  icon?: React.ReactNode;
  color?: 'default' | 'success' | 'warning' | 'error';
}

export function MetricCard({
  label,
  value,
  previousValue,
  format = 'number',
  icon,
  color = 'default'
}: MetricCardProps) {
  const trend = previousValue ? ((Number(value) - previousValue) / previousValue) * 100 : null;

  const colorClasses = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  };

  return (
    <View className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <View className="flex-row items-start justify-between mb-4">
        <Text className="text-sm font-medium text-muted uppercase tracking-wide">
          {label}
        </Text>
        {icon && (
          <View className={`w-10 h-10 rounded-lg items-center justify-center ${colorClasses[color]}`}>
            {icon}
          </View>
        )}
      </View>

      <Text className="text-4xl font-bold text-foreground">
        {format === 'currency' && '$'}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {format === 'percent' && '%'}
      </Text>

      {trend !== null && (
        <View className="flex-row items-center mt-3">
          <View className={`flex-row items-center px-2 py-1 rounded-full ${
            trend >= 0 ? 'bg-success/10' : 'bg-error/10'
          }`}>
            <Text className={trend >= 0 ? 'text-success' : 'text-error'}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
            </Text>
          </View>
          <Text className="text-muted text-sm ml-2">vs last period</Text>
        </View>
      )}
    </View>
  );
}
```

### Interactive List Card

```tsx
interface ListCardProps {
  title: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    meta?: string;
    icon?: React.ReactNode;
    status?: 'success' | 'warning' | 'error' | 'pending';
  }>;
  onItemPress?: (id: string) => void;
  emptyMessage?: string;
}

export function ListCard({ title, items, onItemPress, emptyMessage }: ListCardProps) {
  const statusColors = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    pending: 'bg-muted',
  };

  return (
    <View className="bg-surface border border-border rounded-xl overflow-hidden">
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
      </View>

      {items.length === 0 ? (
        <View className="px-6 py-12 items-center">
          <Text className="text-muted">{emptyMessage || 'No items'}</Text>
        </View>
      ) : (
        items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => onItemPress?.(item.id)}
            className={`
              flex-row items-center px-6 py-4 hover:bg-surface-hover transition-colors
              ${index < items.length - 1 ? 'border-b border-border' : ''}
            `}
          >
            {item.icon && (
              <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center mr-4">
                {item.icon}
              </View>
            )}

            <View className="flex-1">
              <Text className="font-medium text-foreground">{item.title}</Text>
              {item.subtitle && (
                <Text className="text-sm text-muted mt-0.5">{item.subtitle}</Text>
              )}
            </View>

            {item.meta && (
              <Text className="text-sm text-muted mr-3">{item.meta}</Text>
            )}

            {item.status && (
              <View className={`w-2 h-2 rounded-full ${statusColors[item.status]}`} />
            )}

            <Text className="text-muted ml-2">›</Text>
          </Pressable>
        ))
      )}
    </View>
  );
}
```

## Navigation Components

### Desktop Sidebar

```tsx
interface SidebarProps {
  logo: React.ReactNode;
  items: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: string | number;
  }>;
  bottomItems?: React.ReactNode;
  currentPath: string;
}

export function DesktopSidebar({ logo, items, bottomItems, currentPath }: SidebarProps) {
  return (
    <View className="flex-1 flex-col">
      {/* Logo */}
      <View className="h-16 px-4 flex-row items-center border-b border-border">
        {logo}
      </View>

      {/* Navigation */}
      <View className="flex-1 py-4 px-3">
        {items.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Pressable
              key={item.href}
              onPress={() => router.push(item.href)}
              className={`
                flex-row items-center px-3 py-2.5 rounded-lg mb-1
                ${isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-surface-hover hover:text-foreground'}
                transition-colors duration-150
              `}
            >
              <View className="w-5 h-5 mr-3">{item.icon}</View>
              <Text className={`flex-1 font-medium ${isActive ? 'text-primary' : ''}`}>
                {item.label}
              </Text>
              {item.badge && (
                <View className="bg-primary px-2 py-0.5 rounded-full">
                  <Text className="text-xs font-medium text-white">{item.badge}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Bottom section */}
      {bottomItems && (
        <View className="border-t border-border p-4">
          {bottomItems}
        </View>
      )}
    </View>
  );
}
```

### Breadcrumb Navigation

```tsx
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <View className="flex-row items-center gap-2">
      {items.map((item, index) => (
        <View key={index} className="flex-row items-center">
          {index > 0 && <Text className="text-muted mx-2">/</Text>}
          {item.href ? (
            <Pressable onPress={() => router.push(item.href!)}>
              <Text className="text-muted hover:text-foreground transition-colors">
                {item.label}
              </Text>
            </Pressable>
          ) : (
            <Text className="text-foreground font-medium">{item.label}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
```

## Form Components

### Search Input

```tsx
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = ''
}: SearchInputProps) {
  return (
    <View className={`relative ${className}`}>
      <View className="absolute left-3 top-1/2 -translate-y-1/2">
        <SearchIcon className="w-5 h-5 text-muted" />
      </View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface
          text-foreground placeholder:text-muted
          focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {value && (
        <Pressable
          onPress={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          <XIcon className="w-4 h-4 text-muted hover:text-foreground" />
        </Pressable>
      )}
    </View>
  );
}
```

### Select/Dropdown

```tsx
export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View className="relative">
      {label && (
        <Text className="text-sm font-medium text-foreground mb-2">{label}</Text>
      )}

      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row items-center justify-between px-4 py-3 rounded-lg
          border border-border bg-surface hover:border-primary/50 transition-colors"
      >
        <Text className={selected ? 'text-foreground' : 'text-muted'}>
          {selected?.label || placeholder}
        </Text>
        <ChevronDownIcon className={`w-5 h-5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </Pressable>

      {open && (
        <View className="absolute top-full left-0 right-0 mt-1 py-1 rounded-lg
          border border-border bg-surface shadow-xl z-50">
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`px-4 py-2.5 hover:bg-surface-hover transition-colors
                ${option.value === value ? 'bg-primary/10 text-primary' : 'text-foreground'}`}
            >
              <Text>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
```

## Loading States

### Skeleton Components

```tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <View className={`bg-surface-hover rounded animate-pulse ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <View className="bg-surface border border-border rounded-xl p-6">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
    </View>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <View className="border border-border rounded-xl overflow-hidden">
      <View className="flex-row bg-surface-hover border-b border-border">
        {[1, 2, 3, 4].map(i => (
          <View key={i} className="flex-1 px-6 py-4">
            <Skeleton className="h-4 w-20" />
          </View>
        ))}
      </View>
      {Array(rows).fill(0).map((_, i) => (
        <View key={i} className="flex-row border-b border-border last:border-0">
          {[1, 2, 3, 4].map(j => (
            <View key={j} className="flex-1 px-6 py-4">
              <Skeleton className="h-4 w-full" />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
```

## Empty States

```tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <View className="items-center justify-center py-16 px-8">
      <View className="w-16 h-16 rounded-full bg-surface-hover items-center justify-center mb-6">
        {icon}
      </View>
      <Text className="text-xl font-semibold text-foreground text-center mb-2">
        {title}
      </Text>
      <Text className="text-muted text-center max-w-sm mb-6">
        {description}
      </Text>
      {action && (
        <Pressable
          onPress={action.onPress}
          className="bg-primary px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors"
        >
          <Text className="text-white font-medium">{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}
```
