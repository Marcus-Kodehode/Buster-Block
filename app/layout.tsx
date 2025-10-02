import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-gray-400 hover:text-[#fbbf24] transition-colors"
                  >
                    Logg inn
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white rounded-lg px-4 py-2 text-sm font-medium hover:shadow-lg hover:shadow-[#1e40af]/50 transition-all hover:-translate-y-0.5"
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
