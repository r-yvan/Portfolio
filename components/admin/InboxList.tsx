"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Copy, Mail, Reply, Trash2 } from "lucide-react";
import { deleteInboxMessage } from "@/app/admin/actions";
import type { InboxMessage } from "@/lib/content/inbox";
import { cn } from "@/lib/utils";
import { toast } from "./toast";
import { useAction } from "./useAction";

const SEEN_KEY = "ry-inbox-seen";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function InboxList({ messages, writable }: { messages: InboxMessage[]; writable: boolean }) {
  const [open, setOpen] = useState<string | null>(messages[0]?.id ?? null);
  const [seenAt, setSeenAt] = useState<number | null>(null);
  const remove = useAction(deleteInboxMessage);

  // "New" = arrived since your last visit to the inbox on this device.
  useEffect(() => {
    let last = 0;
    try {
      last = Number(localStorage.getItem(SEEN_KEY) ?? 0);
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      /* storage unavailable */
    }
    setSeenAt(last);
  }, []);

  const del = async (m: InboxMessage) => {
    if (!window.confirm(`Delete the message from ${m.name}?`)) return;
    await remove.run(m.id);
  };

  if (!messages.length) {
    return (
      <div className="border border-dashed border-fg/20 p-12 text-center">
        <Mail size={22} className="mx-auto text-subtle" />
        <p className="mt-4 text-muted">No messages yet. When someone uses your contact form, it lands here.</p>
      </div>
    );
  }

  return (
    <ul className="border border-fg/10">
      {messages.map((m) => {
        const isOpen = open === m.id;
        const isNew = seenAt !== null && new Date(m.receivedAt).getTime() > seenAt;
        return (
          <li key={m.id} className="border-b border-fg/10 bg-surface last:border-b-0">
            <button
              onClick={() => setOpen(isOpen ? null : m.id)}
              className="flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-fg/[0.03]"
              aria-expanded={isOpen}
            >
              <span className={cn("mt-2 h-1.5 w-1.5 shrink-0", isNew ? "bg-accent" : "bg-transparent")} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-medium">{m.name}</span>
                  {m.email ? <span className="truncate text-sm text-subtle">{m.email}</span> : null}
                  {isNew ? <span className="label text-[0.58rem] text-accent">New</span> : null}
                </span>
                {!isOpen ? <span className="mt-1 line-clamp-1 block text-sm text-muted">{m.message}</span> : null}
              </span>
              <span className="label hidden shrink-0 sm:block">{formatDate(m.receivedAt)}</span>
              <ChevronDown size={15} className={cn("mt-0.5 shrink-0 text-subtle transition-transform", isOpen && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-fg/10 px-5 py-5 sm:pl-[2.6rem]">
                    <p className="label mb-3 sm:hidden">{formatDate(m.receivedAt)}</p>
                    <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {m.email ? (
                        <>
                          <a
                            href={`mailto:${m.email}?subject=${encodeURIComponent("Re: your message")}&body=${encodeURIComponent(`\n\n> ${m.message.slice(0, 500).replace(/\n/g, "\n> ")}`)}`}
                            className="btn btn-primary btn-sm"
                          >
                            <Reply size={13} />
                            <span>Reply</span>
                          </a>
                          <button
                            onClick={() => navigator.clipboard.writeText(m.email).then(() => toast.success("Email copied"))}
                            className="btn btn-ghost btn-sm"
                          >
                            <Copy size={13} />
                            <span>Copy email</span>
                          </button>
                        </>
                      ) : null}
                      <button onClick={() => del(m)} disabled={!writable || remove.pending} className="btn btn-danger btn-sm">
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
