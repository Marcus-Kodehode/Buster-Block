"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { locales, type Locale } from "@/lib/i18n"; // eller din sti

const flagFor: Record<Locale, string> = {
  en: "/icons/en.png",
  no: "/icons/no.png",
  "es-MX": "/icons/mx.png",
  sw: "/icons/tz.png",
  tr: "/icons/tr.png",
  "zh-TW": "/icons/tw.png",
};

const labelFor: Record<Locale, string> = {
  en: "English",
  no: "Norsk",
  "es-MX": "Español (MX)",
  sw: "Kiswahili",
  tr: "Türkçe",
  "zh-TW": "繁體中文",
};

export default function LanguageToggle({
  initialLocale,
}: {
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Viktig: start med det serveren brukte
  const [current, setCurrent] = useState<Locale>(initialLocale);

  function setLang(l: Locale) {
    document.cookie = `lang=${encodeURIComponent(l)}; Path=/; Max-Age=${
      60 * 60 * 24 * 365
    }; SameSite=Lax`;
    setCurrent(l); // oppdater lokalt for umiddelbar visning
    startTransition(() => router.refresh());
    setOpen(false);
  }

  // (valgfritt) ESC for å lukke
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 text-sm hover:bg-gray-800"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        disabled={isPending}
      >
        {/* suppressHydrationWarning er ikke nødvendig lenger, men skader ikke */}
        <Image
          src={flagFor[current]}
          alt={current}
          width={20}
          height={20}
          className="rounded-sm"
          priority
        />
        <span className="hidden sm:inline">
          {isPending ? "…" : labelFor[current]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-gray-700 bg-gray-900 p-1 shadow-lg">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as Locale)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 text-sm"
            >
              <Image
                src={flagFor[l as Locale]}
                alt={l}
                width={18}
                height={18}
                className="rounded-sm"
              />
              <span>{labelFor[l as Locale]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
