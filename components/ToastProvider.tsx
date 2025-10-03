"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
//   useEffect,
} from "react";

type Toast = { id: number; type: "success" | "error"; message: string };
type Ctx = { success: (m: string) => void; error: (m: string) => void };

const ToastCtx = createContext<Ctx | null>(null);

export default function ToastProvider({ children }: React.PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: Toast["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const api: Ctx = {
    success: (m) => push("success", m),
    error: (m) => push("error", m),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-lg border ${
              t.type === "success"
                ? "bg-green-500/15 border-green-500/40 text-green-300"
                : "bg-red-500/15 border-red-500/40 text-red-300"
            } shadow-lg`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
