# Desktop Layout Patterns

Professional layout patterns for commercial-grade desktop applications.

## Dashboard Layout

The most common pattern for desktop apps - sidebar + header + content grid:

```tsx
export function DashboardPage() {
  return (
    <AppShell
      sidebar={<DesktopSidebar {...sidebarProps} />}
      header={<DashboardHeader />}
    >
      {/* Stats row */}
      <View className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard label="Total Questions" value={287} icon={<BookIcon />} />
        <MetricCard label="Mastered" value={45} previousValue={32} color="success" />
        <MetricCard label="Need Review" value={23} color="warning" />
        <MetricCard label="Day Streak" value={7} icon={<FireIcon />} />
      </View>

      {/* Two column layout */}
      <View className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content - 2/3 width */}
        <View className="lg:col-span-2 space-y-6">
          <ProgressChart data={progressData} />
          <RecentActivity items={recentItems} />
        </View>

        {/* Sidebar content - 1/3 width */}
        <View className="space-y-6">
          <UpcomingExam date={examDate} />
          <QuickActions actions={actions} />
          <StudyTips tips={tips} />
        </View>
      </View>
    </AppShell>
  );
}
```

## Split View Layout

For detail views, settings, or comparison interfaces:

```tsx
export function SplitViewLayout() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <View className="flex-row h-screen">
      {/* List panel */}
      <View className="w-80 border-r border-border bg-surface overflow-y-auto">
        <View className="p-4 border-b border-border sticky top-0 bg-surface">
          <SearchInput placeholder="Search categories..." />
        </View>
        <View className="py-2">
          {categories.map(cat => (
            <CategoryItem
              key={cat.id}
              {...cat}
              selected={selectedId === cat.id}
              onPress={() => setSelectedId(cat.id)}
            />
          ))}
        </View>
      </View>

      {/* Detail panel */}
      <View className="flex-1 overflow-y-auto">
        {selectedId ? (
          <CategoryDetail id={selectedId} />
        ) : (
          <EmptyState
            icon={<FolderIcon />}
            title="Select a category"
            description="Choose a category from the list to view questions"
          />
        )}
      </View>
    </View>
  );
}
```

## Card Grid Layout

For browsing content like questions, categories, or resources:

```tsx
export function CardGridLayout() {
  return (
    <View className="space-y-8">
      {/* Filters bar */}
      <View className="flex-row items-center justify-between flex-wrap gap-4">
        <View className="flex-row gap-3">
          <FilterButton label="All" active />
          <FilterButton label="Mastered" count={45} />
          <FilterButton label="In Progress" count={23} />
          <FilterButton label="Not Started" count={219} />
        </View>
        <View className="flex-row gap-3">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </View>
      </View>

      {/* Grid */}
      <View className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map(item => (
          <ContentCard key={item.id} {...item} />
        ))}
      </View>

      {/* Pagination */}
      <View className="flex-row justify-center">
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      </View>
    </View>
  );
}
```

## Quiz/Study Layout

Full-focus layout for active studying:

```tsx
export function QuizLayout() {
  return (
    <View className="min-h-screen bg-background">
      {/* Progress bar at top */}
      <View className="fixed top-0 left-0 right-0 h-1 bg-border z-50">
        <View
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </View>

      {/* Header */}
      <View className="border-b border-border bg-surface/80 backdrop-blur-xl">
        <View className="max-w-4xl mx-auto px-8 py-4 flex-row items-center justify-between">
          <Pressable onPress={handleExit} className="flex-row items-center text-muted hover:text-foreground">
            <XIcon className="w-5 h-5 mr-2" />
            <Text>Exit Quiz</Text>
          </Pressable>

          <View className="flex-row items-center gap-6">
            <Text className="text-muted">
              Question {current} of {total}
            </Text>
            <View className="flex-row items-center text-muted">
              <ClockIcon className="w-5 h-5 mr-2" />
              <Text>{formatTime(elapsed)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Question content - centered with max width */}
      <View className="max-w-3xl mx-auto px-8 py-12">
        {/* Category badge */}
        <View className="flex-row items-center gap-2 mb-6">
          <View className="bg-primary/10 px-3 py-1 rounded-full">
            <Text className="text-primary text-sm font-medium">{category}</Text>
          </View>
          <View className="bg-surface px-3 py-1 rounded-full border border-border">
            <Text className="text-muted text-sm">{difficulty}</Text>
          </View>
        </View>

        {/* Question */}
        <Text className="text-2xl lg:text-3xl font-semibold text-foreground leading-relaxed mb-12">
          {question}
        </Text>

        {/* Answer options */}
        <View className="space-y-4">
          {options.map((option, i) => (
            <AnswerOption
              key={i}
              label={String.fromCharCode(65 + i)}
              text={option}
              selected={selected === i}
              correct={showAnswer ? i === correctAnswer : undefined}
              onPress={() => handleSelect(i)}
            />
          ))}
        </View>
      </View>

      {/* Bottom action bar */}
      <View className="fixed bottom-0 left-0 right-0 border-t border-border bg-surface/80 backdrop-blur-xl">
        <View className="max-w-4xl mx-auto px-8 py-4 flex-row items-center justify-between">
          <Pressable
            onPress={handlePrevious}
            disabled={current === 1}
            className="flex-row items-center text-muted hover:text-foreground disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-1" />
            <Text>Previous</Text>
          </Pressable>

          <Pressable
            onPress={showAnswer ? handleNext : handleSubmit}
            className="bg-primary px-8 py-3 rounded-lg hover:bg-primary-hover"
          >
            <Text className="text-white font-medium">
              {showAnswer ? 'Next Question' : 'Check Answer'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function AnswerOption({ label, text, selected, correct, onPress }: AnswerOptionProps) {
  const getBorderColor = () => {
    if (correct === true) return 'border-success bg-success/10';
    if (correct === false && selected) return 'border-error bg-error/10';
    if (selected) return 'border-primary bg-primary/5';
    return 'border-border hover:border-primary/50';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={correct !== undefined}
      className={`
        flex-row items-center p-5 rounded-xl border-2 transition-all
        ${getBorderColor()}
      `}
    >
      <View className={`
        w-10 h-10 rounded-lg items-center justify-center mr-4
        ${selected ? 'bg-primary text-white' : 'bg-surface-hover text-foreground'}
      `}>
        <Text className="font-semibold">{label}</Text>
      </View>
      <Text className="flex-1 text-lg text-foreground">{text}</Text>
      {correct === true && <CheckCircleIcon className="w-6 h-6 text-success" />}
      {correct === false && selected && <XCircleIcon className="w-6 h-6 text-error" />}
    </Pressable>
  );
}
```

## Landing Page Layout

Marketing/conversion focused layout:

```tsx
export function LandingPageLayout() {
  return (
    <View className="min-h-screen bg-background">
      {/* Navigation */}
      <View className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <View className="max-w-7xl mx-auto px-8 h-20 flex-row items-center justify-between">
          <Logo />
          <View className="flex-row items-center gap-8">
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#pricing">Pricing</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
            <Button variant="primary">Get Started</Button>
          </View>
        </View>
      </View>

      {/* Hero section */}
      <View className="pt-32 pb-24 px-8">
        <View className="max-w-5xl mx-auto text-center">
          <View className="inline-flex bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Text className="text-primary font-medium">New: 2026 Exam Questions Available</Text>
          </View>

          <Text className="text-5xl lg:text-7xl font-bold text-foreground leading-tight mb-6">
            Pass the NYS Massage{'\n'}Therapy Exam
          </Text>

          <Text className="text-xl lg:text-2xl text-muted max-w-2xl mx-auto mb-10">
            The only study app designed specifically for New York State's unique licensing examination.
          </Text>

          <View className="flex-row justify-center gap-4">
            <Button size="lg" variant="primary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="secondary">
              View Demo
            </Button>
          </View>

          {/* Social proof */}
          <View className="flex-row justify-center items-center gap-8 mt-12">
            <View className="flex-row items-center">
              <AvatarGroup users={recentUsers} />
              <Text className="text-muted ml-3">500+ students</Text>
            </View>
            <View className="flex-row items-center">
              <StarRating value={4.9} />
              <Text className="text-muted ml-2">4.9/5 rating</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Feature sections with alternating layouts */}
      <View className="py-24 bg-surface">
        <View className="max-w-7xl mx-auto px-8">
          <View className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <View>
              <Text className="text-4xl font-bold text-foreground mb-6">
                Smart Study System
              </Text>
              <Text className="text-xl text-muted mb-8">
                Our spaced repetition algorithm ensures you focus on questions you need to review most.
              </Text>
              <View className="space-y-4">
                <FeatureItem icon={<BrainIcon />} text="Adaptive learning paths" />
                <FeatureItem icon={<ChartIcon />} text="Progress analytics" />
                <FeatureItem icon={<ClockIcon />} text="Optimal review timing" />
              </View>
            </View>
            <View className="bg-background rounded-2xl p-8 border border-border shadow-2xl">
              <ProgressDemoUI />
            </View>
          </View>
        </View>
      </View>

      {/* Pricing section */}
      <View id="pricing" className="py-24">
        <View className="max-w-4xl mx-auto px-8 text-center">
          <Text className="text-4xl font-bold text-foreground mb-4">
            Simple, One-Time Pricing
          </Text>
          <Text className="text-xl text-muted mb-12">
            No subscriptions. No hidden fees. Lifetime access.
          </Text>

          <View className="bg-surface border-2 border-primary rounded-3xl p-12 relative overflow-hidden">
            <View className="absolute top-0 right-0 bg-primary px-6 py-2 rounded-bl-2xl">
              <Text className="text-white font-medium">Best Value</Text>
            </View>

            <Text className="text-6xl font-bold text-foreground mb-2">$37</Text>
            <Text className="text-muted mb-8">One-time payment</Text>

            <View className="space-y-4 mb-10">
              <PricingFeature text="All 287 exam questions" />
              <PricingFeature text="Detailed explanations & mnemonics" />
              <PricingFeature text="Progress tracking across devices" />
              <PricingFeature text="Lifetime updates" />
              <PricingFeature text="Money-back guarantee" />
            </View>

            <Button size="lg" variant="primary" className="w-full">
              Get Full Access Now
            </Button>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="border-t border-border py-12">
        <View className="max-w-7xl mx-auto px-8">
          <View className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <View>
              <Logo className="mb-4" />
              <Text className="text-muted">
                The trusted study companion for NYS massage therapy licensing.
              </Text>
            </View>
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Support" links={supportLinks} />
            <FooterColumn title="Legal" links={legalLinks} />
          </View>
          <View className="border-t border-border mt-12 pt-8">
            <Text className="text-muted text-center">
              2025 NYSMassageExam.com. All rights reserved.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
```

## Settings Page Layout

Clean, organized settings with grouped sections:

```tsx
export function SettingsLayout() {
  return (
    <View className="max-w-4xl mx-auto px-8 py-12">
      <Text className="text-3xl font-bold text-foreground mb-8">Settings</Text>

      <View className="space-y-8">
        {/* Account Section */}
        <SettingsSection title="Account" description="Manage your account details">
          <SettingsRow
            label="Email"
            value="user@example.com"
            action={<Button variant="ghost" size="sm">Change</Button>}
          />
          <SettingsRow
            label="Password"
            value="••••••••"
            action={<Button variant="ghost" size="sm">Update</Button>}
          />
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection title="Preferences" description="Customize your study experience">
          <SettingsRow
            label="Dark Mode"
            description="Use dark theme throughout the app"
            action={<Toggle value={darkMode} onChange={setDarkMode} />}
          />
          <SettingsRow
            label="Sound Effects"
            description="Play sounds for correct/incorrect answers"
            action={<Toggle value={sounds} onChange={setSounds} />}
          />
          <SettingsRow
            label="Daily Reminder"
            description="Get notified to study each day"
            action={<Select options={reminderOptions} value={reminder} onChange={setReminder} />}
          />
        </SettingsSection>

        {/* Data Section */}
        <SettingsSection title="Data" description="Manage your study data">
          <SettingsRow
            label="Export Progress"
            description="Download your study history"
            action={<Button variant="secondary" size="sm">Export</Button>}
          />
          <SettingsRow
            label="Reset Progress"
            description="Start fresh with all questions"
            action={<Button variant="ghost" size="sm" className="text-error">Reset</Button>}
          />
        </SettingsSection>
      </View>
    </View>
  );
}

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <View className="bg-surface border border-border rounded-xl overflow-hidden">
      <View className="px-6 py-4 border-b border-border">
        <Text className="text-lg font-semibold text-foreground">{title}</Text>
        {description && <Text className="text-sm text-muted mt-1">{description}</Text>}
      </View>
      <View className="divide-y divide-border">
        {children}
      </View>
    </View>
  );
}

function SettingsRow({ label, description, value, action }: SettingsRowProps) {
  return (
    <View className="px-6 py-4 flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="font-medium text-foreground">{label}</Text>
        {description && <Text className="text-sm text-muted mt-0.5">{description}</Text>}
        {value && !description && <Text className="text-sm text-muted">{value}</Text>}
      </View>
      {action}
    </View>
  );
}
```

## Responsive Breakpoints

Standard breakpoints for responsive desktop layouts:

```tsx
// Tailwind breakpoints reference:
// sm: 640px   - Large phones, small tablets
// md: 768px   - Tablets
// lg: 1024px  - Small laptops, large tablets
// xl: 1280px  - Laptops, desktops
// 2xl: 1536px - Large desktops

// Usage patterns:
<View className="
  px-4           // Mobile: 16px padding
  sm:px-6        // 640px+: 24px padding
  lg:px-8        // 1024px+: 32px padding
  xl:px-12       // 1280px+: 48px padding
">

<View className="
  grid-cols-1    // Mobile: single column
  md:grid-cols-2 // 768px+: 2 columns
  lg:grid-cols-3 // 1024px+: 3 columns
  xl:grid-cols-4 // 1280px+: 4 columns
">

<View className="
  hidden         // Hidden on mobile
  lg:flex        // Visible from 1024px+
">
```
