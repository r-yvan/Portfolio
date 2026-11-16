"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";

/** Sticky bar that slides up whenever a form has unsaved changes. */
export function SaveBar({
  dirty,
  pending,
  onSave,
  onDiscard,
  disabled,
}: {
  dirty: boolean;
  pending: boolean;
  onSave: () => void;
  onDiscard: () => void;
  disabled?: boolean;
}) {
  return (
    <AnimatePresence>
      {dirty && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="sticky bottom-4 z-30 mt-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border border-fg/15 bg-surface/95 px-4 py-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <span className="flex items-center gap-2.5 text-sm">
              <span className="h-2 w-2 animate-pulse bg-accent" /> Unsaved changes
            </span>
            <div className="flex gap-2">
              <button type="button" onClick={onDiscard} disabled={pending} className="btn btn-ghost btn-sm">
                <span>Discard</span>
              </button>
              <button type="button" onClick={onSave} disabled={pending || disabled} className="btn btn-primary btn-sm">
                {pending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                <span>{pending ? "Saving…" : "Save changes"}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-fg/10 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-medium tracking-tight md:text-4xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "warn"; children: React.ReactNode }) {
  return (
    <div
      className={
        tone === "warn"
          ? "mb-6 border border-accent/40 bg-accent/[0.06] px-4 py-3 text-sm leading-relaxed"
          : "mb-6 border border-fg/10 bg-fg/[0.03] px-4 py-3 text-sm leading-relaxed text-muted"
      }
    >
      {children}
    </div>
  );
}
