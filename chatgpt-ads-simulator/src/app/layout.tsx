import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AppProviders } from "@/components/layout/AppProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AdLab — ChatGPT Ads Platform",
  description:
    "Launch and optimize ChatGPT Ads in minutes. AI-drafted campaigns, pre-spend simulation, one-click launch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
