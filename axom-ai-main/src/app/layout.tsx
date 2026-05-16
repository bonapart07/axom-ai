import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Axom AI Study Assistant",
  description: "An AI-powered learning platform for Assamese students that explains concepts in simple Assamese.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Axom AI",
  },
};

import { AuthProvider } from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={clsx(outfit.className, "min-h-screen bg-background text-foreground antialiased")}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
