import type { Metadata } from "next";
import { ThemeProvider } from "../src/components/theme/theme-provider";
import ThemeToggle from "../src/components/theme/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mesotheric",
  description:
    "The middle path between shadow and light. A Hermetic-inspired habit transformation app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}