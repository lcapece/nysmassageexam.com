---
name: mobile-desktop-parity
description: Use this skill for ANY UI change, feature addition, bug fix, or design work. Ensures mobile and desktop versions stay synchronized while respecting platform-specific design patterns. Triggers on "fix the UI", "update the page", "add a feature", "change the design", "implement", "build", "create", or any development task involving screens/pages/components.
---

# Mobile-Desktop Parity Development

**CRITICAL: Every UI change MUST be implemented for BOTH mobile and desktop layouts.**

This skill ensures development parity between mobile and desktop versions of React Native Web applications. When making ANY change to a screen or component, you MUST check and update both platform-specific layouts.

## The Golden Rule

> **ONE INTENT, TWO IMPLEMENTATIONS**
>
> Every design decision should be expressed appropriately for each platform.
> Mobile and desktop are not copies - they are siblings with shared DNA but distinct personalities.

## Mandatory Workflow

### Step 1: Identify Layout Pattern

Before making ANY change, determine if the file uses conditional rendering:

```tsx
// PATTERN A: Conditional return (most common)
if (isDesktop) {
  return <DesktopLayout />  // ← MUST UPDATE
}
return <MobileLayout />      // ← MUST UPDATE

// PATTERN B: Inline conditionals
<View style={isDesktop ? desktopStyles : mobileStyles}>

// PATTERN C: Separate files
// mobile/HomeScreen.tsx + desktop/HomeScreen.tsx
```

### Step 2: Apply Changes to BOTH

**For every single change:**

| Change Type | Mobile Implementation | Desktop Implementation |
|-------------|----------------------|------------------------|
| New button | Full-width, large touch target (44px min) | Inline, standard size with hover state |
| New section | Stack vertically, full bleed | Card in grid, contained width |
| Text update | Update mobile text | Update desktop text (may differ slightly) |
| New data display | Card list, swipeable | Table or grid with sorting |
| Navigation | Bottom tabs, hamburger | Sidebar or top nav |
| Modal/dialog | Full screen sheet | Centered modal with backdrop |
| Form | Single column, large inputs | Multi-column where appropriate |
| Image | Full width, optimized | Constrained, high-res |

### Step 3: Verify Parity Checklist

Before completing ANY task, verify:

- [ ] Mobile layout updated
- [ ] Desktop layout updated
- [ ] Both show same data/content
- [ ] Interactions work on both
- [ ] Error states handled on both
- [ ] Loading states on both
- [ ] Empty states on both

## Platform-Specific Adaptations

### What Should Be THE SAME
- Data displayed
- Core functionality
- Business logic
- Error messages
- State management
- Navigation destinations

### What Should DIFFER (Intelligently)
| Aspect | Mobile | Desktop |
|--------|--------|---------|
| Layout | Single column | Multi-column grid |
| Touch targets | 44px minimum | Standard button sizes |
| Typography | 16px base | 14-16px base, larger headings |
| Spacing | Compact (16-20px) | Generous (24-32px) |
| Navigation | Bottom tabs | Sidebar |
| Interactions | Tap, swipe | Click, hover, keyboard |
| Information density | Less, progressive | More, dashboard-style |
| Modals | Full-screen sheets | Centered dialogs |

## Code Patterns

### Pattern 1: Detect Platform
```tsx
import { Platform, useWindowDimensions } from 'react-native';

function useIsDesktop() {
  const { width } = useWindowDimensions();
  return Platform.OS === 'web' && width >= 1024;
}
```

### Pattern 2: Conditional Rendering (Recommended)
```tsx
export default function MyScreen() {
  const isDesktop = useIsDesktop();

  // Shared state and logic
  const [data, setData] = useState([]);
  const handleAction = () => { /* shared logic */ };

  // DESKTOP LAYOUT
  if (isDesktop) {
    return (
      <View style={{ flexDirection: 'row' }}>
        <Sidebar />
        <View style={{ flex: 1, padding: 24 }}>
          <Text style={{ fontSize: 32 }}>Title</Text>
          <Grid data={data} onAction={handleAction} />
        </View>
      </View>
    );
  }

  // MOBILE LAYOUT
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24 }}>Title</Text>
        <CardList data={data} onAction={handleAction} />
      </View>
    </ScrollView>
  );
}
```

### Pattern 3: Shared Components with Platform Props
```tsx
function ActionButton({ children, onPress }) {
  const isDesktop = useIsDesktop();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => ({
        backgroundColor: hovered ? colors.primaryHover : colors.primary,
        paddingVertical: isDesktop ? 12 : 16,
        paddingHorizontal: isDesktop ? 24 : 20,
        borderRadius: 12,
        width: isDesktop ? 'auto' : '100%',
      })}
    >
      <Text style={{ color: '#FFF', fontSize: isDesktop ? 16 : 18 }}>
        {children}
      </Text>
    </Pressable>
  );
}
```

## Common Mistakes to AVOID

### Mistake 1: Only updating one layout
```tsx
// BAD: Only changed mobile
return (
  <View>
    <Text>New Feature!</Text>  {/* Added here */}
  </View>
);

// The desktop layout above was NOT updated!
```

### Mistake 2: Copy-paste without adaptation
```tsx
// BAD: Same exact code for both
if (isDesktop) {
  return <View className="px-5">{content}</View>;  // Mobile spacing!
}
return <View className="px-5">{content}</View>;

// GOOD: Adapted for each platform
if (isDesktop) {
  return <View className="px-12 max-w-6xl mx-auto">{content}</View>;
}
return <View className="px-5">{content}</View>;
```

### Mistake 3: Forgetting hover states on desktop
```tsx
// BAD: No hover feedback on desktop
<Pressable onPress={handlePress}>

// GOOD: Desktop gets hover states
<Pressable
  onPress={handlePress}
  style={({ hovered }) => ({
    backgroundColor: hovered ? colors.surfaceHover : colors.surface,
  })}
>
```

## Quick Reference: File Locations

In this codebase, look for these patterns:

```
app/
├── (tabs)/
│   ├── index.tsx      ← Dashboard (has isDesktop conditional)
│   ├── quiz.tsx       ← Quiz screen (has isDesktop conditional)
│   ├── study.tsx      ← Study browser
│   └── settings.tsx   ← Settings
├── landing.tsx        ← Landing page (has isDesktop conditional)
├── upgrade.tsx        ← Upgrade/payment
└── ...

components/
├── desktop/           ← Desktop-specific components
│   ├── container.tsx
│   ├── nav.tsx
│   └── card.tsx
└── ...                ← Shared components
```

## Enforcement Commands

When implementing ANY change, mentally (or actually) run:

1. **GREP CHECK**: Search for `isDesktop` in the file
2. **BRANCH CHECK**: Count the number of `return` statements
3. **PARITY CHECK**: Ensure change appears in ALL return branches

## Summary

**NEVER** make a UI change to just one platform.
**ALWAYS** ask: "Did I update both mobile AND desktop?"
**REMEMBER**: Same intent, platform-appropriate implementation.

This is not optional. This is the development standard.
