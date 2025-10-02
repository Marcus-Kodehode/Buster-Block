/*
 * File: app/(auth)/sign-in/[[...sign-in]]/page.tsx
 * Location: Authentication page for user sign-in
 */

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <SignIn />
    </div>
  );
}

/*
 * This page component provides:
 * - Clerk authentication integration
 * - Centered sign-in form layout
 * - Responsive height calculation
 * - Catch-all route handling
 */
