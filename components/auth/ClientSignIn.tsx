// components/auth/ClientSignIn.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

export default function ClientSignIn() {
  // All lokaliseringslogikk ligger i ClerkProvider (layout)
  return <SignIn />;
}
