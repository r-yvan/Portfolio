"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  error,
  counter,
  className,
  htmlFor,
  children,
}: {
  label: string;
  hint?: React.ReactNode;
  error?: string;
  counter?: { value: number; max: number };
  className?: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("block", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={htmlFor} className="label text-muted">
          {label}
        </label>
        {counter ? (
          <span className={cn("text-[0.65rem] tabular", counter.value > counter.max ? "text-accent" : "text-subtle")}>
            {counter.value}/{counter.max}
          </span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-accent">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs leading-relaxed text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
  error?: string;
  max?: number;
};

export function TextInput({ label, value, onChange, hint, error, max, className, ...rest }: InputProps) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className} counter={max ? { value: value.length, max } : undefined}>
      <input
        id={id}
        className={cn("input", error && "border-accent")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </Field>
  );
}

export function NumberInput({
  label,
  value,
  onChange,
  hint,
  error,
  step = 1,
  className,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
  error?: string;
  step?: number;
  className?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className}>
      <input
        id={id}
        type="number"
        step={step}
        className={cn("input tabular", error && "border-accent")}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </Field>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  hint,
  error,
  max,
  rows = 4,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: React.ReactNode;
  error?: string;
  max?: number;
  rows?: number;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} error={error} htmlFor={id} className={className} counter={max ? { value: value.length, max } : undefined}>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={cn("input resize-y", error && "border-accent")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function Toggle({
  label,
  description,
  checked,
  onChange,
  className,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 border border-fg/10 px-4 py-3 text-left transition-colors hover:border-fg/25",
        className,
      )}
    >
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-subtle">{description}</span> : null}
      </span>
      <span className={cn("relative h-5 w-9 shrink-0 border transition-colors", checked ? "border-accent bg-accent" : "border-fg/25 bg-transparent")}>
        <span
          className={cn(
            "absolute top-[2px] h-[14px] w-[14px] transition-all duration-300 ease-out-expo",
            checked ? "left-[18px] bg-accent-fg" : "left-[2px] bg-fg/50",
          )}
        />
      </span>
    </button>
  );
}

export function TagInput({
  label,
  value,
  onChange,
  hint,
  error,
  max = 12,
  placeholder = "Type and press Enter",
  className,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
  error?: string;
  max?: number;
  placeholder?: string;
  className?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (!parts.length) return;
    const next = [...value];
    for (const p of parts) if (!next.some((t) => t.toLowerCase() === p.toLowerCase()) && next.length < max) next.push(p);
    onChange(next);
    setDraft("");
  };
  return (
    <Field label={label} hint={hint ?? `${value.length}/${max} · Enter or comma to add`} error={error} htmlFor={id} className={className}>
      <div className={cn("flex min-h-11 flex-wrap items-center gap-1.5 border border-fg/15 px-2 py-1.5 focus-within:border-accent", error && "border-accent")}>
        {value.map((tag, i) => (
          <span key={`${tag}-${i}`} className="chip gap-1 bg-fg/[0.04] pr-1 normal-case tracking-normal text-fg">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="p-0.5 text-subtle hover:text-accent"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={value.length >= max ? "" : placeholder}
          disabled={value.length >= max}
          onChange={(e) => {
            if (e.target.value.includes(",")) add(e.target.value);
            else setDraft(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          onBlur={() => add(draft)}
          className="h-8 min-w-[8rem] flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-subtle/80"
        />
      </div>
    </Field>
  );
}

/** Titled group of fields inside an admin page. */
export function FormSection({
  title,
  description,
  children,
  aside,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="border border-fg/10 bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-fg/10 px-5 py-4 md:px-6">
        <div>
          <h2 className="text-base font-medium tracking-tight">{title}</h2>
          {description ? <p className="mt-1 max-w-xl text-sm text-subtle">{description}</p> : null}
        </div>
        {aside}
      </header>
      <div className="space-y-5 p-5 md:p-6">{children}</div>
    </section>
  );
}
