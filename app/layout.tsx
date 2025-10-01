import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buster Block - Movie Reviews",
  description: "Din kilde for ærlige filmanmeldelser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="no">
        <body className={inter.className}>
          <header className="border-b border-gray-200 dark:border-gray-800">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                🎬 Buster Block
              </Link>

              <div className="flex items-center gap-4">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium hover:underline"
                  >
                    Logg inn
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-[#6c47ff] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#5639cc] transition"
                  >
                    Registrer deg
                  </Link>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </div>
            </nav>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
