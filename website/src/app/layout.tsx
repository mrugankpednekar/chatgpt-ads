import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { AppProviders } from "@/components/layout/AppProviders";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Context Ads — Ads for the AI Era",
  description:
    "We run, track, and optimize your ads on ChatGPT and the AI surfaces replacing search. End to end, paid on performance. Built by creators from MIT.",
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
        <Analytics />
      </body>
    </html>
  );
}
