/** @type {const} */
const themeColors = {
  // Primary - Teal Green for wellness/healing
  primary: { light: '#0D9373', dark: '#10B981' },
  primaryHover: { light: '#0B7A60', dark: '#34D399' },
  primaryMuted: { light: 'rgba(13, 147, 115, 0.1)', dark: 'rgba(16, 185, 129, 0.1)' },

  // Secondary - Indigo for trust
  secondary: { light: '#4F46E5', dark: '#6366F1' },
  secondaryHover: { light: '#4338CA', dark: '#818CF8' },

  // Accent - Coral for attention/mnemonics
  accent: { light: '#F97316', dark: '#FB923C' },
  accentMuted: { light: 'rgba(249, 115, 22, 0.1)', dark: 'rgba(251, 146, 60, 0.1)' },

  // Backgrounds - refined for commercial look
  background: { light: '#FFFFFF', dark: '#09090B' },
  surface: { light: '#F9FAFB', dark: '#18181B' },
  surfaceHover: { light: '#F3F4F6', dark: '#27272A' },
  elevated: { light: '#FFFFFF', dark: '#1F1F23' },

  // Text hierarchy
  foreground: { light: '#111827', dark: '#FAFAFA' },
  muted: { light: '#6B7280', dark: '#A1A1AA' },
  subtle: { light: '#9CA3AF', dark: '#71717A' },

  // Borders
  border: { light: '#E5E7EB', dark: '#27272A' },
  borderHover: { light: '#D1D5DB', dark: '#3F3F46' },

  // Semantic colors
  success: { light: '#059669', dark: '#10B981' },
  successMuted: { light: 'rgba(5, 150, 105, 0.1)', dark: 'rgba(16, 185, 129, 0.1)' },
  warning: { light: '#D97706', dark: '#F59E0B' },
  warningMuted: { light: 'rgba(217, 119, 6, 0.1)', dark: 'rgba(245, 158, 11, 0.1)' },
  error: { light: '#DC2626', dark: '#EF4444' },
  errorMuted: { light: 'rgba(220, 38, 38, 0.1)', dark: 'rgba(239, 68, 68, 0.1)' },
};

module.exports = { themeColors };
