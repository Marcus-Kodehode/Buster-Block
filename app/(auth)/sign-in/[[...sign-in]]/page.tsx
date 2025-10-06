// app/(auth)/sign-in/[[...sign-in]]/page.tsx
import ClientSignIn from "@/components/auth/ClientSignIn";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <ClientSignIn />
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
