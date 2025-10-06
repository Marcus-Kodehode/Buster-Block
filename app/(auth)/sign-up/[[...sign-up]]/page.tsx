// app/(auth)/sign-up/[[...sign-up]]/page.tsx
import ClientSignUp from "@/components/auth/ClientSignUp";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <ClientSignUp />
    </div>
  );
}

/*
 * This page component provides:
 * - Clerk registration integration
 * - Centered sign-up form layout
 * - Responsive height calculation
 * - Catch-all route handling
 */
