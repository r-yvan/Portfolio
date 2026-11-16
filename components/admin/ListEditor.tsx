"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

let keySeed = 0;
const newKey = () => `k${++keySeed}`;

/**
 * Generic repeater: add, remove, reorder (up/down) and collapse items.
 * Keeps its own stable keys so inputs never lose focus or state on reorder.
 */
export function ListEditor<T>({
  items,
  onChange,
  create,
  title,
  render,
  addLabel = "Add item",
  max = 50,
  min = 0,
  collapsible = true,
  defaultOpen = false,
  errorFor,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  title: (item: T, index: number) => React.ReactNode;
  render: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  max?: number;
  min?: number;
  collapsible?: boolean;
  defaultOpen?: boolean;
  errorFor?: (index: number) => boolean;
}) {
  const [keys, setKeys] = useState<string[]>(() => items.map(newKey));
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // Resync keys if the list was replaced from outside (e.g. "Discard").
  useEffect(() => {
    if (keys.length !== items.length) setKeys(items.map(newKey));
  }, [items, keys.length]);

  const update = (index: number, patch: Partial<T>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setKeys((k) => k.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const nextItems = [...items];
    [nextItems[index], nextItems[target]] = [nextItems[target], nextItems[index]];
    const nextKeys = [...keys];
    [nextKeys[index], nextKeys[target]] = [nextKeys[target], nextKeys[index]];
    setKeys(nextKeys);
    onChange(nextItems);
  };

  const add = () => {
    const key = newKey();
    setKeys((k) => [...k, key]);
    setOpen((o) => ({ ...o, [key]: true }));
    onChange([...items, create()]);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const key = keys[index] ?? `fallback-${index}`;
          const isOpen = !collapsible || (open[key] ?? defaultOpen);
          const hasError = errorFor?.(index);
          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("border bg-canvas/50", hasError ? "border-accent/60" : "border-fg/10")}
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="label w-6 shrink-0 tabular text-subtle">{String(index + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  onClick={() => collapsible && setOpen((o) => ({ ...o, [key]: !isOpen }))}
                  className="flex min-w-0 flex-1 items-center gap-2 py-1 text-left text-sm font-medium"
                >
                  <span className="truncate">{title(item, index)}</span>
                  {collapsible ? (
                    <ChevronDown size={14} className={cn("shrink-0 text-subtle transition-transform", isOpen && "rotate-180")} />
                  ) : null}
                </button>
                <div className="flex shrink-0 items-center">
                  <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                    <ArrowUp size={13} />
                  </IconButton>
                  <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>
                    <ArrowDown size={13} />
                  </IconButton>
                  <IconButton label="Remove" danger disabled={items.length <= min} onClick={() => remove(index)}>
                    <Trash2 size={13} />
                  </IconButton>
                </div>
              </div>
              {isOpen ? (
                <div className="space-y-4 border-t border-fg/10 p-4">{render(item, (patch) => update(index, patch), index)}</div>
              ) : null}
            </motion.div>
          );
        })}
      </AnimatePresence>
      <button
        type="button"
        onClick={add}
        disabled={items.length >= max}
        className="flex w-full items-center justify-center gap-2 border border-dashed border-fg/20 py-3 text-sm text-muted transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus size={14} /> {addLabel}
        {max < 50 ? <span className="text-xs text-subtle tabular">({items.length}/{max})</span> : null}
      </button>
    </div>
  );
}

export function IconButton({
  label,
  onClick,
  disabled,
  danger,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-8 w-8 items-center justify-center text-subtle transition-colors disabled:pointer-events-none disabled:opacity-30",
        danger ? "hover:bg-accent hover:text-accent-fg" : "hover:bg-fg/10 hover:text-fg",
        className,
      )}
    >
      {children}
    </button>
  );
}
