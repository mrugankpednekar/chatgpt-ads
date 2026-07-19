"use client";

import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "text-sm",
          style: {
            background: "#18181b",
            color: "#fafafa",
          },
        }}
      />
    </>
  );
}
