// lib/clerkLocale.ts
import type { LocalizationResource } from "@clerk/types";
import { enUS, esMX, svSE, trTR, zhTW } from "@clerk/localizations";
import { normalizeLocale, defaultLocale } from "@/lib/i18n";

export function clerkLocalizationFor(
  rawLocale?: string | null
): LocalizationResource {
  // normalizeLocale forventer undefined, ikke null
  const locale = normalizeLocale(rawLocale ?? undefined) ?? defaultLocale;

  // Clerk har ikke nb/nn; vi faller tilbake til enUS for "no"
  const map: Record<string, LocalizationResource> = {
    en: enUS,
    "es-MX": esMX,
    tr: trTR,
    "zh-TW": zhTW,
    sv: svSE,
    sw: svSE, // alias hvis du noen gang setter "sw" i cookie
    no: enUS,
  };

  return map[locale] ?? enUS;
}
