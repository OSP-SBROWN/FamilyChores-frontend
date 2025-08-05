const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'roboto-serif': ['Roboto Serif', 'serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        // Apple-inspired color palette with your specified colors
        'family': {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#8ECAE6', // Main blue
          600: '#219EBC', // Darker blue
          700: '#023047', // Dark navy
          800: '#FFB703', // Warm yellow
          900: '#FB8500', // Orange
        }
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: '#f0fdfa',
              100: '#ccfbf1',
              200: '#99f6e4',
              300: '#5eead4',
              400: '#2dd4bf',
              500: '#8ECAE6',
              600: '#219EBC',
              700: '#023047',
              800: '#023047',
              900: '#023047',
              DEFAULT: '#219EBC',
              foreground: '#ffffff',
            },
            secondary: {
              50: '#fff7ed',
              100: '#ffedd5',
              200: '#fed7aa',
              300: '#fdba74',
              400: '#fb923c',
              500: '#FFB703',
              600: '#FB8500',
              700: '#ea580c',
              800: '#dc2626',
              900: '#dc2626',
              DEFAULT: '#FFB703',
              foreground: '#023047',
            },
            background: '#ffffff',
            foreground: '#023047',
          },
        },
        dark: {
          colors: {
            primary: {
              50: '#f0fdfa',
              100: '#ccfbf1',
              200: '#99f6e4',
              300: '#5eead4',
              400: '#2dd4bf',
              500: '#8ECAE6',
              600: '#219EBC',
              700: '#023047',
              800: '#023047',
              900: '#023047',
              DEFAULT: '#8ECAE6',
              foreground: '#023047',
            },
            secondary: {
              50: '#fff7ed',
              100: '#ffedd5',
              200: '#fed7aa',
              300: '#fdba74',
              400: '#fb923c',
              500: '#FFB703',
              600: '#FB8500',
              700: '#ea580c',
              800: '#dc2626',
              900: '#dc2626',
              DEFAULT: '#FB8500',
              foreground: '#ffffff',
            },
            background: '#1a1a1a',
            foreground: '#ffffff',
          },
        },
      },
    }),
  ],
}
