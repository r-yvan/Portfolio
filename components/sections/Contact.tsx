"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Loader2, Send } from "lucide-react";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Profile, Social } from "@/lib/content/schema";

type Status = "idle" | "loading" | "success" | "error";
const EASE = [0.16, 1, 0.3, 1] as const;

export function Contact({ index, profile, socials }: { index: string; profile: Profile; socials: Social[] }) {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const update =
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, elapsed: Date.now() - startedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Couldn't send your message.");
      setStatus("success");
      setForm({ name: "", email: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:px-12 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
          <div>
            <SectionHeader index={index} label="Contact" meta="Let's talk" title="_Have an idea?_ Let's build it." />

            <Reveal delay={0.1}>
              <a
                href={`mailto:${profile.email}`}
                className="group mt-10 inline-flex max-w-full items-center gap-3 border-b border-fg/15 pb-2 text-xl font-medium tracking-tight transition-colors hover:border-accent hover:text-accent md:text-3xl"
              >
                <span className="truncate">{profile.email}</span>
                <ArrowUpRight size={22} className="shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-10 grid max-w-md grid-cols-2 gap-px border border-fg/10 bg-fg/10">
                <div className="bg-canvas p-4">
                  <dt className="label">Phone</dt>
                  <dd className="mt-2 text-sm">
                    {profile.phone ? (
                      <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`} className="hover:text-accent">
                        {profile.phone}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div className="bg-canvas p-4">
                  <dt className="label">Location</dt>
                  <dd className="mt-2 text-sm">{profile.location}</dd>
                </div>
              </dl>
            </Reveal>

            {socials.length > 0 && (
              <Reveal delay={0.2}>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {socials.map((s) => (
                    <li key={s.id}>
                      <a
                        href={s.url}
                        target={s.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        <span>{s.label}</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          <Reveal delay={0.1}>
            <div className="relative border border-fg/10 bg-surface/70 backdrop-blur-sm">
              <Crosshairs />
              <div className="flex items-center justify-between border-b border-fg/10 px-6 py-4 md:px-8">
                <span className="label">New message</span>
                <span className="label flex items-center gap-2">
                  <span className={profile.available ? "h-1.5 w-1.5 bg-accent" : "h-1.5 w-1.5 bg-subtle"} />
                  {profile.available ? profile.availability : "Inbox open"}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {status === "success" ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="flex min-h-[24rem] flex-col items-start justify-center"
                    >
                      <span className="flex h-12 w-12 items-center justify-center bg-accent text-accent-fg">
                        <Check size={22} />
                      </span>
                      <h3 className="mt-6 text-3xl font-medium tracking-tight">Message sent.</h3>
                      <p className="mt-2 max-w-xs text-muted">Thanks for reaching out — I&apos;ll get back to you soon.</p>
                      <button onClick={() => setStatus("idle")} className="btn btn-ghost btn-sm mt-8">
                        <span>Send another</span>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={submit}
                      className="space-y-6"
                      noValidate={false}
                    >
                      <div className="grid gap-6 sm:grid-cols-2">
                        <label className="block">
                          <span className="label">Name</span>
                          <input
                            className="input mt-2.5"
                            required
                            maxLength={100}
                            autoComplete="name"
                            value={form.name}
                            onChange={update("name")}
                            placeholder="Your name"
                          />
                        </label>
                        <label className="block">
                          <span className="label">Email</span>
                          <input
                            className="input mt-2.5"
                            type="email"
                            required
                            maxLength={200}
                            autoComplete="email"
                            value={form.email}
                            onChange={update("email")}
                            placeholder="you@example.com"
                          />
                        </label>
                      </div>
                      <label className="block">
                        <span className="label">Message</span>
                        <textarea
                          className="input mt-2.5 resize-none"
                          required
                          minLength={10}
                          maxLength={5000}
                          rows={6}
                          value={form.message}
                          onChange={update("message")}
                          placeholder="Tell me about your project…"
                        />
                      </label>
                      {/* Honeypot — invisible to people, irresistible to bots */}
                      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                        <label>
                          Website
                          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update("website")} />
                        </label>
                      </div>

                      {status === "error" && (
                        <p role="alert" className="border-l-2 border-accent pl-3 text-sm text-accent">
                          {error}
                        </p>
                      )}

                      <Magnetic strength={0.2} className="block">
                        <button type="submit" disabled={status === "loading"} className="btn btn-primary group w-full">
                          {status === "loading" ? (
                            <>
                              <Loader2 size={16} className="animate-spin" />
                              <span>Sending…</span>
                            </>
                          ) : (
                            <>
                              <span>Send message</span>
                              <Send size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                            </>
                          )}
                        </button>
                      </Magnetic>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
