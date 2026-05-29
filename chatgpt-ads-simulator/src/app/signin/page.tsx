import { Suspense } from "react";

import { SignInForm } from "./SignInForm";

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
          <div className="size-5 animate-spin rounded-full border-2 border-zinc-300 border-t-emerald-600" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
