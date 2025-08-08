/**
 * Application theme constants for use with Tailwind and Shadcn UI
 * These values should match with the tailwind.config.js
 */

// Theme color palette
export const colors = {
  primary: {
    main: '#219EBC', // Bright blue from palette
    light: '#8ECAE6', // Light cyan from palette
    dark: '#023047', // Dark navy from palette
    text: '#ffffff',
  },
  secondary: {
    main: '#FFB703', // Warm yellow from palette
    light: '#FB8500', // Orange from palette
    dark: '#E89600',
    text: '#023047',
  },
  background: {
    default: '#FAFAFA', // Light grey
    paper: '#FFFFFF', // White
    elevated: '#F5F5F7', // Card background
  },
  text: {
    primary: '#1D1D1F', // Dark text
    secondary: '#6E6E73', // Secondary text
    disabled: '#A1A1A6', // Disabled text
  },
  divider: '#D2D2D7',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#007AFF',
  success: '#30D158',
};

// Typography configurations
export const typography = {
  fontFamily: {
    sans: '"Roboto", "Helvetica", "Arial", sans-serif',
    serif: '"Roboto Serif", "Times New Roman", serif',
  },
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.75rem', // 28px
    '4xl': '2rem',    // 32px
    '5xl': '2.5rem',  // 40px
  },
};

// Spacing and layout
export const layout = {
  borderRadius: {
    sm: '0.5rem',    // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
    full: '9999px',  // Full rounded (circle)
  },
  spacing: {
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
  },
};

// Component-specific tokens
export const componentTokens = {
  button: {
    borderRadius: layout.borderRadius.md,
    padding: {
      sm: `${layout.spacing[1]} ${layout.spacing[3]}`,
      md: `${layout.spacing[2]} ${layout.spacing[4]}`,
      lg: `${layout.spacing[3]} ${layout.spacing[6]}`,
    },
  },
  card: {
    borderRadius: layout.borderRadius.lg,
    shadow: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    },
  },
};

// Theme object that combines all tokens
export const theme = {
  colors,
  typography,
  layout,
  components: componentTokens,
};

export default theme;
