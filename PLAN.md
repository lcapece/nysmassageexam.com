# Mobile Landing Page Redesign Plan

## Current State Analysis

The current `landing.tsx` is heavily desktop-focused with the following mobile issues:

### Problems Identified:
1. **No Clear CTA Above the Fold** - Mobile users see the navbar and countdown, but the primary CTA ("Get Full Access - $37") is buried below lots of content
2. **Information Overload** - Desktop-oriented content overwhelms mobile users
3. **No Purpose Statement** - Users don't immediately understand what the product is
4. **Weak Value Proposition** - The "why NYS-specific" message is lost in text blocks
5. **No Mobile-First Hero** - The hero section uses desktop-oriented layouts
6. **Charts/Visualizations Don't Work on Mobile** - SVG charts are cramped
7. **No Sticky CTA** - Users have to scroll all the way up/down to take action
8. **Testimonials Hidden Too Far Down** - Social proof buried below technical features

## Implementation Plan

### Phase 1: Mobile-First Hero Section

**1.1 Simplified Mobile Header (navbar)**
- Keep logo smaller (32px instead of 44px)
- Remove "Features/Pricing/FAQ" links (not functional anyway)
- Single CTA button: "Get Started" (prominent)

**1.2 Mobile Hero - Above the Fold**
Create a focused, conversion-oriented hero:
```
[Logo]
[Badge: "NYS-Specific Exam Prep"]

"Pass the NYS Massage
Therapy Exam"

"The only study tool built for New York's
unique exam - including 20% Eastern Medicine"

[Primary CTA: "Get Full Access - $37"]
[Secondary: "Try 3 Free Questions"]

[Trust badges: "287 Questions" • "90% Pass Rate*" • "Money-Back Guarantee"]
```

**1.3 Countdown Below Hero (Compact)**
- Show exam countdown in a compact card format
- "58 Days until next exam" with small timer

### Phase 2: Mobile-Optimized Content Sections

**2.1 Social Proof First (After Hero)**
- Move testimonials UP - show 1-2 testimonials immediately after hero
- Horizontal scroll carousel for testimonials
- Compact card format

**2.2 Problem/Solution Section**
Simple, scannable format:
```
❌ Generic MBLEx prep doesn't cover NYS content
✅ We cover all 20% Eastern Medicine questions

❌ Only 2 exam dates per year - no room for error
✅ 287 questions with proven mnemonics
```

**2.3 Feature Highlights (Visual)**
- Icon + 1-line description format
- 2x2 grid layout for mobile
- Remove complex charts/graphs on mobile

**2.4 Pricing Section (Simplified)**
- Keep the pricing card but make it more prominent
- Move it higher on mobile
- Sticky bottom CTA bar for mobile

### Phase 3: Mobile UX Improvements

**3.1 Sticky Bottom CTA Bar**
```jsx
// Fixed bar at bottom of screen (mobile only)
<View style={{ position: 'fixed', bottom: 0, ... }}>
  <Text>$37 • Lifetime Access</Text>
  <Button>Get Full Access</Button>
</View>
```

**3.2 Conditional Content Rendering**
- Use `useIsDesktop()` to show/hide complex sections
- Desktop: Full charts, comparison tables, detailed content
- Mobile: Simplified icons, bullet points, key messages

**3.3 Faster Page Load**
- Defer loading of complex SVG charts
- Lazy load testimonials below fold

### Phase 4: Specific Component Changes

**4.1 Navigation Bar (Mobile)**
```jsx
// Current: Logo + nav links + 2 buttons
// New: Logo + single CTA button
```

**4.2 Hero Section (Mobile)**
```jsx
// Remove side-by-side layout
// Stack vertically with clear hierarchy
// Bold headline, concise subhead, prominent CTA
```

**4.3 Remove/Simplify on Mobile:**
- `AnalyticsPreview` - Replace with simple stat badges
- `MemoryAnalysisPreview` - Replace with text description
- `ComparisonTable` - Replace with checkmark list
- `LiveCountdown` in banner - Simplify to single line

**4.4 Keep on Mobile:**
- `MnemonicPreview` - Interactive demo is valuable
- Testimonials - Social proof is critical
- Pricing card - But move higher

### File Changes Summary

1. **`app/landing.tsx`** - Major restructure with mobile-first conditional rendering
   - Add sticky bottom CTA component
   - Restructure hero for mobile
   - Add mobile-specific testimonial carousel
   - Simplify/hide complex visualizations on mobile

2. **No new components needed** - Using existing design system

### Implementation Order

1. Create mobile-specific hero section with clear CTA
2. Add sticky bottom CTA bar for mobile
3. Simplify charts/visualizations with mobile conditionals
4. Move social proof (testimonials) higher for mobile
5. Create mobile-friendly feature highlights
6. Test on various mobile viewport sizes

## Expected Outcome

- **Clear purpose**: User immediately knows this is NYS massage exam prep
- **Strong CTA**: "Get Full Access - $37" visible without scrolling
- **Trust signals**: Pass rate, money-back guarantee visible early
- **Scannable content**: Quick-read format optimized for mobile attention spans
- **Persistent CTA**: Sticky bottom bar ensures conversion option always available
