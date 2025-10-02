import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Film } from "lucide-react";
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
              <Link
                href="/"
                className="flex items-center gap-2 text-xl font-bold group"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#6c47ff]/20 to-[#06b6d4]/20 group-hover:from-[#6c47ff]/30 group-hover:to-[#06b6d4]/30 transition-all">
                  <Film className="w-5 h-5 text-[#6c47ff] group-hover:text-[#06b6d4] transition-colors" />
                </div>
                <span className="bg-gradient-to-r from-white to-[#06b6d4] bg-clip-text text-transparent">
                  Buster Block
                </span>
              </Link>

              <div className="flex items-center gap-4">
                <SignedOut>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-gray-400 hover:text-[#06b6d4] transition-colors"
                  >
                    Logg inn
                  </Link>
                  <Link
                    href="/sign-up"
                    className="bg-gradient-to-r from-[#6c47ff] to-[#06b6d4] text-white rounded-lg px-4 py-2 text-sm font-medium hover:shadow-lg hover:shadow-[#6c47ff]/50 transition-all hover:-translate-y-0.5"
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
