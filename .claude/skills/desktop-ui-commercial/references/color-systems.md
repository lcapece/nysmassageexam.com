# Professional Color Systems

Commercial-grade color palettes for desktop applications.

## Dark Mode Palette (Recommended)

Modern SaaS apps predominantly use dark themes. This palette is inspired by Linear, Vercel, and Raycast:

```tsx
export const darkTheme = {
  // Backgrounds - subtle gradations for depth
  background: '#09090B',        // Zinc-950 - deepest background
  surface: '#18181B',           // Zinc-900 - cards, panels
  surfaceHover: '#27272A',      // Zinc-800 - hover states
  surfaceActive: '#3F3F46',     // Zinc-700 - active states
  elevated: '#27272A',          // Elevated components (modals, popovers)

  // Borders - barely visible but structuring
  border: '#27272A',            // Default borders
  borderHover: '#3F3F46',       // Interactive borders
  borderFocus: '#6366F1',       // Focus rings

  // Text hierarchy
  foreground: '#FAFAFA',        // Primary text - Zinc-50
  muted: '#A1A1AA',             // Secondary text - Zinc-400
  subtle: '#71717A',            // Tertiary text - Zinc-500
  disabled: '#52525B',          // Disabled text - Zinc-600

  // Primary accent - Indigo
  primary: '#6366F1',           // Indigo-500
  primaryHover: '#818CF8',      // Indigo-400
  primaryActive: '#4F46E5',     // Indigo-600
  primaryMuted: 'rgba(99, 102, 241, 0.1)', // Backgrounds

  // Semantic colors
  success: '#22C55E',           // Green-500
  successMuted: 'rgba(34, 197, 94, 0.1)',
  warning: '#F59E0B',           // Amber-500
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',             // Red-500
  errorMuted: 'rgba(239, 68, 68, 0.1)',
  info: '#3B82F6',              // Blue-500
  infoMuted: 'rgba(59, 130, 246, 0.1)',
};
```

## Light Mode Palette

Clean, professional light theme:

```tsx
export const lightTheme = {
  // Backgrounds
  background: '#FFFFFF',        // Pure white
  surface: '#FAFAFA',           // Zinc-50 - cards, panels
  surfaceHover: '#F4F4F5',      // Zinc-100 - hover
  surfaceActive: '#E4E4E7',     // Zinc-200 - active
  elevated: '#FFFFFF',          // Modals with shadow

  // Borders
  border: '#E4E4E7',            // Zinc-200
  borderHover: '#D4D4D8',       // Zinc-300
  borderFocus: '#6366F1',       // Primary

  // Text
  foreground: '#18181B',        // Zinc-900
  muted: '#71717A',             // Zinc-500
  subtle: '#A1A1AA',            // Zinc-400
  disabled: '#D4D4D8',          // Zinc-300

  // Same accent colors work
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryActive: '#4338CA',
  primaryMuted: 'rgba(99, 102, 241, 0.1)',

  // Semantic - slightly adjusted for light bg
  success: '#16A34A',           // Green-600
  successMuted: 'rgba(22, 163, 74, 0.1)',
  warning: '#D97706',           // Amber-600
  warningMuted: 'rgba(217, 119, 6, 0.1)',
  error: '#DC2626',             // Red-600
  errorMuted: 'rgba(220, 38, 38, 0.1)',
  info: '#2563EB',              // Blue-600
  infoMuted: 'rgba(37, 99, 235, 0.1)',
};
```

## Alternative Accent Colors

Choose ONE primary accent that matches your brand:

```tsx
// Violet - Creative, Modern
primary: '#8B5CF6',           // Violet-500
primaryHover: '#A78BFA',      // Violet-400
primaryActive: '#7C3AED',     // Violet-600

// Cyan - Tech, Fresh
primary: '#06B6D4',           // Cyan-500
primaryHover: '#22D3EE',      // Cyan-400
primaryActive: '#0891B2',     // Cyan-600

// Emerald - Health, Growth
primary: '#10B981',           // Emerald-500
primaryHover: '#34D399',      // Emerald-400
primaryActive: '#059669',     // Emerald-600

// Rose - Warm, Energetic
primary: '#F43F5E',           // Rose-500
primaryHover: '#FB7185',      // Rose-400
primaryActive: '#E11D48',     // Rose-600

// Orange - Friendly, Approachable
primary: '#F97316',           // Orange-500
primaryHover: '#FB923C',      // Orange-400
primaryActive: '#EA580C',     // Orange-600

// Sky - Professional, Trust
primary: '#0EA5E9',           // Sky-500
primaryHover: '#38BDF8',      // Sky-400
primaryActive: '#0284C7',     // Sky-600
```

## Implementing Theme in React Native Web

```tsx
// hooks/use-colors.ts
import { useColorScheme } from 'react-native';

const darkColors = {
  background: '#09090B',
  surface: '#18181B',
  surfaceHover: '#27272A',
  border: '#27272A',
  borderHover: '#3F3F46',
  foreground: '#FAFAFA',
  muted: '#A1A1AA',
  subtle: '#71717A',
  primary: '#6366F1',
  primaryHover: '#818CF8',
  primaryMuted: 'rgba(99, 102, 241, 0.1)',
  success: '#22C55E',
  successMuted: 'rgba(34, 197, 94, 0.1)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.1)',
};

const lightColors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceHover: '#F4F4F5',
  border: '#E4E4E7',
  borderHover: '#D4D4D8',
  foreground: '#18181B',
  muted: '#71717A',
  subtle: '#A1A1AA',
  primary: '#6366F1',
  primaryHover: '#4F46E5',
  primaryMuted: 'rgba(99, 102, 241, 0.1)',
  success: '#16A34A',
  successMuted: 'rgba(22, 163, 74, 0.1)',
  warning: '#D97706',
  warningMuted: 'rgba(217, 119, 6, 0.1)',
  error: '#DC2626',
  errorMuted: 'rgba(220, 38, 38, 0.1)',
};

export function useColors() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
}
```

## Tailwind CSS Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          active: 'var(--color-surface-active)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        foreground: 'var(--color-foreground)',
        muted: 'var(--color-muted)',
        subtle: 'var(--color-subtle)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          muted: 'var(--color-primary-muted)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          muted: 'var(--color-success-muted)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          muted: 'var(--color-warning-muted)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          muted: 'var(--color-error-muted)',
        },
      },
    },
  },
};
```

## CSS Variables for Web

```css
/* globals.css or in your root component */
:root {
  --color-background: #FFFFFF;
  --color-surface: #FAFAFA;
  --color-surface-hover: #F4F4F5;
  --color-surface-active: #E4E4E7;
  --color-border: #E4E4E7;
  --color-border-hover: #D4D4D8;
  --color-foreground: #18181B;
  --color-muted: #71717A;
  --color-subtle: #A1A1AA;
  --color-primary: #6366F1;
  --color-primary-hover: #4F46E5;
  --color-primary-muted: rgba(99, 102, 241, 0.1);
  --color-success: #16A34A;
  --color-success-muted: rgba(22, 163, 74, 0.1);
  --color-warning: #D97706;
  --color-warning-muted: rgba(217, 119, 6, 0.1);
  --color-error: #DC2626;
  --color-error-muted: rgba(220, 38, 38, 0.1);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #09090B;
    --color-surface: #18181B;
    --color-surface-hover: #27272A;
    --color-surface-active: #3F3F46;
    --color-border: #27272A;
    --color-border-hover: #3F3F46;
    --color-foreground: #FAFAFA;
    --color-muted: #A1A1AA;
    --color-subtle: #71717A;
    --color-primary: #6366F1;
    --color-primary-hover: #818CF8;
    --color-primary-muted: rgba(99, 102, 241, 0.1);
    --color-success: #22C55E;
    --color-success-muted: rgba(34, 197, 94, 0.1);
    --color-warning: #F59E0B;
    --color-warning-muted: rgba(245, 158, 11, 0.1);
    --color-error: #EF4444;
    --color-error-muted: rgba(239, 68, 68, 0.1);
  }
}
```

## Gradient Backgrounds

For hero sections and special emphasis:

```tsx
// Gradient background for dark mode
<View className="bg-gradient-to-b from-background via-surface to-background">

// Subtle radial gradient for emphasis
<View style={{
  backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99, 102, 241, 0.15), transparent)'
}}>

// Mesh gradient for landing pages
<View style={{
  backgroundImage: `
    radial-gradient(at 27% 37%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
    radial-gradient(at 97% 21%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
    radial-gradient(at 52% 99%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
    radial-gradient(at 10% 29%, rgba(34, 197, 94, 0.08) 0px, transparent 50%)
  `
}}>
```

## Shadow System

Consistent shadows for elevation:

```tsx
const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
  none: 'none',

  // Colored shadows for emphasis (use sparingly)
  primary: '0 10px 40px -10px rgba(99, 102, 241, 0.3)',
  success: '0 10px 40px -10px rgba(34, 197, 94, 0.3)',
  error: '0 10px 40px -10px rgba(239, 68, 68, 0.3)',
};

// Usage
<View className="shadow-lg hover:shadow-xl transition-shadow" />
<View style={{ boxShadow: shadows.primary }} /> // For colored shadows
```
