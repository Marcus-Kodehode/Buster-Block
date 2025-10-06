// components/auth/ClientSignUp.tsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function ClientSignUp() {
  // All lokaliseringslogikk ligger i ClerkProvider (layout)
  return <SignUp />;
}
