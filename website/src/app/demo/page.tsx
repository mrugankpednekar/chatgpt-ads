import type { Metadata } from "next";

import { DemoBooking } from "@/components/marketing/demo-booking";

export const metadata: Metadata = {
  title: "Book a demo — Context Ads",
  description:
    "Book 30 minutes with Context Ads. See how your brand shows up on ChatGPT and the AI surfaces replacing search.",
};

export default function DemoPage() {
  return <DemoBooking />;
}
