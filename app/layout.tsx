/*
 * File: app/layout.tsx
 * Location: Root layout component providing the application shell
 */

// /app/layout.tsx
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import I18nProvider from "@/components/I18nProvider";
import LanguageToggle from "@/components/LanguageToggle";
import ToastProvider from "@/components/ToastProvider";
import { Analytics } from "@vercel/analytics/next";
import { clerkLocalizationFor } from "@/lib/clerkLocale";
import AuthButtons from "@/components/AuthButtons";
import {
  normalizeLocale,
  defaultLocale,
  loadMessages,
  type Locale,
} from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buster Block - Movie Reviews",
  description: "Din kilde for ærlige filmanmeldelser",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("lang")?.value;
  const locale: Locale = normalizeLocale(raw) ?? defaultLocale;
  const messages = await loadMessages(locale);
  // 👇 Clerk-lokaliseringspakke
  const clerkLoc = clerkLocalizationFor(locale);

  return (
    <ClerkProvider localization={clerkLoc}>
      <Analytics />
      <html lang={locale}>
        <body className={inter.className}>
          <I18nProvider locale={locale} messages={messages}>
            <ToastProvider>
              <header className="border-b border-gray-800/50 backdrop-blur-sm bg-gray-900/50 sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src="/images/logo.png"
                        alt="Buster Block"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#fbbf24] via-[#facc15] to-[#fcd34d] bg-clip-text text-transparent">
                      Buster Block
                    </span>
                  </Link>

                  <div className="flex items-center gap-4">
                    <LanguageToggle initialLocale={locale} />
                    <AuthButtons />
                  </div>
                </nav>
              </header>

              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </ToastProvider>
          </I18nProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

/*
 * This root layout component provides:
 * - Authentication provider setup
 * - Global font configuration (Inter)
 * - Metadata for SEO
 * - Responsive navigation header
 * - Authentication state UI (login/register/user button)
 * - Consistent page layout structure
 * - Global styles integration
 */
