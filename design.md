# NYS Massage Therapy Exam Study App - Design Document

## Overview
A comprehensive iOS study app designed for massage therapy students preparing for the New York State Massage Therapy Licensing Exam. The app features 287 exam questions with paraphrased content, educational explanations, clever mnemonics, and progress tracking.

---

## Screen List

### 1. Onboarding/Welcome Screen
First-time user introduction explaining the NYS exam.

### 2. Home Screen (Dashboard)
Main hub showing study progress and quick access to all features.

### 3. Exam Info Screen
Detailed information about NYS exam vs MBLEx, what to expect, difficulty factors.

### 4. Quiz Mode Screen
Interactive quiz with immediate feedback, explanations, and mnemonics.

### 5. Study Mode Screen
Browse questions by category with full educational content visible.

### 6. Progress Screen
Statistics, scores, weak areas, and study history.

### 7. Bookmarks Screen
Saved questions for later review.

### 8. Settings Screen
App preferences, reset progress, about.

---

## Primary Content and Functionality

### Onboarding Screen
- Welcome message and app purpose
- Brief overview of NYS exam uniqueness
- "Get Started" button to proceed
- Option to skip for returning users

### Home Screen (Dashboard)
- **Progress Ring**: Visual circular progress indicator (questions answered correctly)
- **Quick Stats Cards**: Total questions, mastered, needs review
- **Action Buttons**: Start Quiz, Study Mode, View Progress
- **Recent Activity**: Last 5 questions attempted
- **Daily Goal Tracker**: Questions to complete today

### Exam Info Screen
- **Section 1**: What is the NYS Massage Therapy Exam?
- **Section 2**: NYS vs MBLEx - Key Differences
- **Section 3**: Why the NYS Exam is Challenging
- **Section 4**: What to Expect on Exam Day
- **Section 5**: Study Tips and Strategies
- Scrollable content with expandable sections

### Quiz Mode Screen
- **Question Card**: Paraphrased question text
- **Answer Options**: A, B, C, D buttons (tappable)
- **Progress Bar**: Question X of Y
- **Timer** (optional): Countdown for timed practice
- **After Answer**:
  - Correct/Incorrect feedback with haptic
  - Educational explanation panel
  - Mnemonic display with icon
  - "Next Question" button
- **Category Filter**: Select specific topics

### Study Mode Screen
- **Category List**: Anatomy, Physiology, Techniques, Ethics, Eastern Medicine, etc.
- **Question Browser**: Scrollable list within category
- **Full Question View**:
  - Question text
  - All answer options (correct highlighted)
  - Educational content
  - Mnemonic with visual cue
  - Bookmark toggle

### Progress Screen
- **Overall Score**: Percentage and fraction
- **Category Breakdown**: Bar chart by topic
- **Weak Areas**: Topics needing more practice
- **Study Streak**: Consecutive days studied
- **History**: Recent quiz sessions with scores

### Bookmarks Screen
- List of saved questions
- Quick access to review
- Remove bookmark option

### Settings Screen
- Dark/Light mode toggle
- Reset progress confirmation
- About the app
- Version info

---

## Key User Flows

### Flow 1: First-Time User
1. App opens → Onboarding Screen
2. User reads intro → Taps "Get Started"
3. → Home Screen (Dashboard)
4. User taps "Learn About the Exam"
5. → Exam Info Screen with detailed content

### Flow 2: Take a Quiz
1. Home Screen → Tap "Start Quiz"
2. → Quiz Mode with first question
3. User selects answer → Feedback shown
4. View explanation and mnemonic
5. Tap "Next" → Continue through questions
6. Quiz complete → Summary with score
7. → Return to Home (progress updated)

### Flow 3: Study by Category
1. Home Screen → Tap "Study Mode"
2. → Category list displayed
3. User selects "Anatomy"
4. → Questions in Anatomy shown
5. Tap question → Full detail view
6. Read explanation and mnemonic
7. Bookmark if desired → Continue browsing

### Flow 4: Review Weak Areas
1. Home Screen → Tap "View Progress"
2. → Progress Screen with stats
3. See "Weak Areas" section
4. Tap weak category → Quiz on those questions

---

## Color Choices

### Primary Palette (Healing/Medical Theme)
- **Primary**: `#2E7D6B` (Teal Green - healing, wellness)
- **Primary Light**: `#4A9D8C`
- **Secondary**: `#5C6BC0` (Indigo - trust, professionalism)
- **Accent**: `#FF7043` (Coral - energy, attention for mnemonics)

### Semantic Colors
- **Success**: `#43A047` (Correct answers)
- **Error**: `#E53935` (Incorrect answers)
- **Warning**: `#FB8C00` (Needs review)

### Neutral Colors (Light Mode)
- **Background**: `#FAFAFA`
- **Surface**: `#FFFFFF`
- **Foreground**: `#212121`
- **Muted**: `#757575`
- **Border**: `#E0E0E0`

### Neutral Colors (Dark Mode)
- **Background**: `#121212`
- **Surface**: `#1E1E1E`
- **Foreground**: `#ECEDEE`
- **Muted**: `#9E9E9E`
- **Border**: `#333333`

---

## Question Categories (Based on Content Analysis)

1. **Massage Techniques** - Strokes, applications, treatment methods
2. **Anatomy** - Muscles, bones, structures, attachments
3. **Physiology** - Body systems, functions, processes
4. **Pathology** - Conditions, contraindications, treatments
5. **Eastern Medicine** - Meridians, Yin/Yang, TCM concepts
6. **Ethics & Law** - NYS regulations, professional conduct
7. **Kinesiology** - Movement, actions, biomechanics
8. **Hydrotherapy** - Water treatments, temperatures, applications

---

## Typography

- **Headings**: System font, Bold, 24-32pt
- **Body**: System font, Regular, 16-17pt
- **Captions**: System font, Regular, 14pt
- **Mnemonic Text**: System font, Medium Italic, 16pt (with accent color)

---

## Component Patterns

### Question Card
- Rounded corners (16pt)
- Surface background with subtle shadow
- Padding: 20pt all sides
- Question number badge top-left

### Answer Button
- Full width, rounded (12pt)
- Border in default state
- Filled primary on selection
- Green/Red feedback after answer

### Mnemonic Box
- Accent border left (4pt)
- Light accent background
- Lightbulb or brain icon
- Italic text styling

### Progress Ring
- 120pt diameter
- Primary color fill
- Percentage in center
- Animated on load

---

## Data Storage (Local - AsyncStorage)

- User progress per question (answered, correct/incorrect)
- Bookmarked question IDs
- Quiz history (date, score, category)
- Settings preferences
- Onboarding completion flag
