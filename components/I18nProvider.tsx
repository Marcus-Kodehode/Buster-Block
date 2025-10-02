// /components/I18nProvider.tsx
"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Locale, Messages } from "@/lib/i18n";
import { createTranslator } from "@/lib/i18n";

type I18nContextValue = {
  locale: Locale;
  messages: Messages;
  t: (path: string, vars?: Record<string, string | number>) => string;
};

const I18nCtx = createContext<I18nContextValue | null>(null);

type Props = React.PropsWithChildren<{
  locale: Locale;
  messages: Messages;
}>;

export default function I18nProvider({ locale, messages, children }: Props) {
  const t = useMemo(() => createTranslator(messages), [messages]);
  const value = useMemo<I18nContextValue>(
    () => ({ locale, messages, t }),
    [locale, messages, t]
  );

  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
