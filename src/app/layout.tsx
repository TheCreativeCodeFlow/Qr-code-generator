import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QR Master | Premium QR Generator",
  description: "Generate, style, download, scan, and decode QR codes client-side.",
};

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
