import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { AuthProvider } from "@/lib/auth/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Loopboard — Developer Productivity Dashboard",
  description: "Track projects, tasks, and progress in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <AppShell>{children}</AppShell>
            <CommandPalette />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}