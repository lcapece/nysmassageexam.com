export const themeColors: {
  // Primary - Teal Green for wellness/healing
  primary: { light: string; dark: string };
  primaryHover: { light: string; dark: string };
  primaryMuted: { light: string; dark: string };

  // Secondary - Indigo for trust
  secondary: { light: string; dark: string };
  secondaryHover: { light: string; dark: string };

  // Accent - Coral for attention/mnemonics
  accent: { light: string; dark: string };
  accentMuted: { light: string; dark: string };

  // Backgrounds - refined for commercial look
  background: { light: string; dark: string };
  surface: { light: string; dark: string };
  surfaceHover: { light: string; dark: string };
  elevated: { light: string; dark: string };

  // Text hierarchy
  foreground: { light: string; dark: string };
  muted: { light: string; dark: string };
  subtle: { light: string; dark: string };

  // Borders
  border: { light: string; dark: string };
  borderHover: { light: string; dark: string };

  // Semantic colors
  success: { light: string; dark: string };
  successMuted: { light: string; dark: string };
  warning: { light: string; dark: string };
  warningMuted: { light: string; dark: string };
  error: { light: string; dark: string };
  errorMuted: { light: string; dark: string };
};

declare const themeConfig: {
  themeColors: typeof themeColors;
};

export default themeConfig;
