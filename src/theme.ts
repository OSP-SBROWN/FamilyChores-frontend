import { createTheme } from '@mui/material/styles';

// Apple-inspired color palette with user specified highlights
const colors = {
  primary: {
    main: '#219EBC', // Bright blue from palette
    light: '#8ECAE6', // Light cyan from palette
    dark: '#023047', // Dark navy from palette
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#FFB703', // Warm yellow from palette
    light: '#FB8500', // Orange from palette
    dark: '#E89600',
    contrastText: '#023047',
  },
  background: {
    default: '#FAFAFA', // Apple-style light grey
    paper: '#FFFFFF',
    elevated: '#F5F5F7', // Apple card background
  },
  surface: {
    main: '#F5F5F7',
    variant: '#E5E5EA',
  },
  text: {
    primary: '#1D1D1F', // Apple-style dark text
    secondary: '#6E6E73', // Apple-style secondary text
    disabled: '#A1A1A6',
  },
  divider: '#D2D2D7',
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F7',
    200: '#E5E5EA',
    300: '#D2D2D7',
    400: '#A1A1A6',
    500: '#8E8E93',
    600: '#6E6E73',
    700: '#48484A',
    800: '#2C2C2E',
    900: '#1D1D1F',
  },
};

// Family-friendly but sophisticated theme
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
    divider: colors.divider,
    grey: colors.grey,
    // Material-UI specific colors
    error: {
      main: '#FF3B30', // Apple red
      light: '#FF6961',
      dark: '#D70015',
    },
    warning: {
      main: '#FF9500', // Apple orange
      light: '#FFB340',
      dark: '#CC7700',
    },
    info: {
      main: '#007AFF', // Apple blue
      light: '#40A9FF',
      dark: '#0056CC',
    },
    success: {
      main: '#30D158', // Apple green
      light: '#66E685',
      dark: '#26A844',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Roboto Serif", "Times New Roman", serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
      color: colors.text.primary,
    },
    h2: {
      fontFamily: '"Roboto Serif", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
      color: colors.text.primary,
    },
    h3: {
      fontFamily: '"Roboto Serif", "Times New Roman", serif',
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
      color: colors.text.primary,
    },
    h4: {
      fontFamily: '"Roboto Serif", "Times New Roman", serif',
      fontWeight: 500,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
      color: colors.text.primary,
    },
    h5: {
      fontFamily: '"Roboto Serif", "Times New Roman", serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
      color: colors.text.primary,
    },
    h6: {
      fontFamily: '"Roboto Serif", "Times New Roman", serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      letterSpacing: '0.0075em',
      color: colors.text.primary,
    },
    body1: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.00938em',
      color: colors.text.primary,
    },
    body2: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
      color: colors.text.secondary,
    },
    button: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      textTransform: 'none', // Apple-style, no uppercase
    },
    caption: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.66,
      letterSpacing: '0.03333em',
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: 12, // Apple-style rounded corners
  },
  spacing: 8,
  components: {
    // Override Material-UI component styles for Apple-like appearance
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
          '&:hover': {
            backgroundColor: colors.primary.dark,
          },
        },
        outlined: {
          borderColor: colors.divider,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.background.elevated,
            borderColor: colors.primary.main,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors.divider}`,
          backgroundColor: colors.background.paper,
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          '&:hover': {
            backgroundColor: colors.background.elevated,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover': {
            backgroundColor: colors.background.elevated,
          },
          '&.Mui-selected': {
            backgroundColor: colors.primary.light,
            '&:hover': {
              backgroundColor: colors.primary.main,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
        filled: {
          backgroundColor: colors.surface.variant,
          color: colors.text.primary,
          '&:hover': {
            backgroundColor: colors.grey[300],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '& fieldset': {
              borderColor: colors.divider,
            },
            '&:hover fieldset': {
              borderColor: colors.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.primary.main,
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          backgroundColor: colors.background.paper,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto Serif", "Times New Roman", serif',
          fontWeight: 600,
          fontSize: '1.5rem',
          color: colors.text.primary,
        },
      },
    },
  },
});

export default theme;
