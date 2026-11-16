"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Check, X } from "lucide-react";

type Toast = { id: number; kind: "success" | "error"; message: string };

let toasts: Toast[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function push(kind: Toast["kind"], message: string) {
  const id = nextId++;
  toasts = [...toasts, { id, kind, message }].slice(-4);
  emit();
  window.setTimeout(() => dismiss(id), kind === "error" ? 7000 : 3500);
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export const toast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message),
};

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const EMPTY: Toast[] = [];

export function Toaster() {
  const items = useSyncExternalStore(subscribe, () => toasts, () => EMPTY);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col gap-2">
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex items-start gap-3 border border-fg/15 bg-surface p-3.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
          >
            <span
              className={
                t.kind === "success"
                  ? "flex h-6 w-6 shrink-0 items-center justify-center bg-fg text-canvas"
                  : "flex h-6 w-6 shrink-0 items-center justify-center bg-accent text-accent-fg"
              }
            >
              {t.kind === "success" ? <Check size={14} /> : <AlertTriangle size={13} />}
            </span>
            <p className="flex-1 pt-0.5 text-sm leading-snug">{t.message}</p>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-subtle hover:text-fg">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
