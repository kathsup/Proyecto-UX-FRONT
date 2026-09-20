"use client";
import { createTheme, alpha } from "@mui/material/styles";

const PRIMARY = "#7C5CFA";

const theme = createTheme({
  // Activa el motor de variables CSS nativo de MUI 6+ / 9+
  cssVariables: true,
  palette: {
    primary: {
      main: PRIMARY,
      light: "#A78BFA",
      dark: "#5B3FD6",
    },
    secondary: {
      main: "#FF6FA5",
    },
    background: {
      default: "#F8F5FF",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#2A2140",
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "var(--font-nunito), sans-serif",
    h1: { fontFamily: "var(--font-poppins)" },
    h2: { fontFamily: "var(--font-poppins)" },
    h3: { fontFamily: "var(--font-poppins)" },
    h4: { fontFamily: "var(--font-poppins)" },
    h5: { fontFamily: "var(--font-poppins)" },
    h6: { fontFamily: "var(--font-poppins)" },
    button: { fontFamily: "var(--font-poppins)", textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: "linear-gradient(180deg, #EFE9FF 0%, #F8F5FF 340px)",
          backgroundRepeat: "no-repeat",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        elevation1: {
          boxShadow: `0 6px 24px ${alpha(PRIMARY, 0.1)}`,
          border: `1px solid ${alpha(PRIMARY, 0.08)}`,
        },
      },
    },
    // Ajuste v9 para LinearProgress
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: alpha(PRIMARY, 0.15),
        },
        bar: {
          borderRadius: 999,
          backgroundImage: `linear-gradient(90deg, #5B3FD6 0%, ${PRIMARY} 60%, #A78BFA 100%)`,
        },
      },
    },
    // Ajuste v9 para Button
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
        },
        // En v9 la propiedad base es 'contained'
        contained: {
          boxShadow: `0 6px 16px ${alpha(PRIMARY, 0.3)}`,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { transition: "background-color 0.2s, transform 0.2s" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 20 } },
    },
  },
});

export default theme;
