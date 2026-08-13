"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#7C5CFA",
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
});

export default theme;
