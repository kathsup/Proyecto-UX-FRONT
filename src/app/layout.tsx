"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Poppins, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import theme from "./theme";
import Sidebar from "./components/sidebar";
import { AuthProvider } from "@/app/context/AuthContext";
import { HabitForm } from "./components/forms/habitForm";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const nunito = Nunito_Sans({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-nunito",
});

/*export const metadata: Metadata = {
  title: "Habit tracker",
  description: "Manage your habits.",
};*/

const EXCEPTION_ROUTES = ["/login", "/register"];

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const showSidebar = !EXCEPTION_ROUTES.includes(pathname);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <html lang="en" className={`${poppins.variable} ${nunito.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <Box sx={{ display: "flex" }}>
                {showSidebar && (
                  <Sidebar onCreateClick={() => setCreateModalOpen(true)} />
                )}
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  {children}
                </Box>
              </Box>
              <Dialog
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
              >
                {<HabitForm onSuccess={() => setCreateModalOpen(false)} />}
              </Dialog>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
