"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { useT } from "@/components/I18nProvider";

export default function AuthButtons() {
  const t = useT();

  return (
    <div className="flex items-center gap-3">
      <SignedOut>
        <SignInButton mode="redirect">
          <button
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-800 hover:bg-gray-900/50"
            aria-label={t("nav.signIn")}
          >
            {t("nav.signIn")}
          </button>
        </SignInButton>

        <SignUpButton mode="redirect">
          <button
            className="px-3 py-1.5 text-sm rounded-lg bg-[#6c47ff] hover:bg-[#5639cc] text-white"
            aria-label={t("nav.signUp")}
          >
            {t("nav.signUp")}
          </button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}
