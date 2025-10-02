// /lib/i18n.ts
export const locales = ["en", "no", "es-MX", "sw", "tr", "zh-TW"] as const;
export type Locale = typeof locales[number]; // "en" | "no" | "es-MX" | "sw" | "tr" | "zh-TW"
export const defaultLocale: Locale = "en";

export function normalizeLocale(input?: string): Locale {
  if (!input) return defaultLocale;
  const lower = input.toLowerCase();
  const hit = locales.find((l) => l.toLowerCase() === lower);
  return (hit ?? defaultLocale) as Locale;
}

/**
 * En meldingsnode kan være en streng, et tall, eller et under-objekt (namespace).
 * Vi bruker 'unknown' internt og sjekker typer i runtime.
 */
// export type Messages = Record<string, string | number | Messages>;
export interface Messages {
  [key: string]: string | number | Messages;
}

export async function loadMessages(locale: Locale): Promise<Messages> {
  switch (locale) {
    case "no":
      return (await import("../i18n/no.json")).default as Messages;
    case "en":
    default:
      return (await import("../i18n/en.json")).default as Messages;
  }
}

/** Hent verdi via "dot.path" (f.eks. "home.title") */
function getByPath(obj: unknown, path: string): unknown {
  if (obj == null) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in (acc as object)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

/** Lag en enkel oversetter-funksjon */
export function createTranslator(messages: Messages) {
  return (path: string, vars?: Record<string, string | number>): string => {
    const val = getByPath(messages, path);
    if (typeof val !== "string" && typeof val !== "number") {
      // Faller tilbake til path hvis ikke funnet eller ikke streng/tall
      return path;
    }
    let out = String(val);
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
      }
    }
    return out;
  };
}
