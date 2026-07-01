"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Loader2,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { site } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

const EASE = [0.16, 1, 0.3, 1] as const;

const inputClass =
  "mt-2 w-full border-b border-white/15 bg-transparent py-2.5 text-white outline-none transition-colors duration-300 placeholder:text-ash-700 focus:border-iris-400";
const labelClass = "font-mono text-xs uppercase tracking-[0.25em] text-ash-500";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Failed to send.");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section id="contact" className="relative px-6 py-28 md:px-12 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionLabel index="08" title="Contact" meta="Let's talk" />
        </Reveal>

        <div className="mt-12 grid gap-16 lg:grid-cols-2 lg:gap-24">
          {/* Left — invitation + details */}
          <div>
            <Reveal delay={0.05}>
              <h2 className="text-section-title font-display font-medium text-white">
                Have an idea?{" "}
                <span className="font-serif font-light italic text-ash-100">
                  Let&apos;s build
                </span>{" "}
                it.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <a
                href={site.socials.email.url}
                data-cursor="hover"
                className="group mt-10 inline-flex items-center gap-3 font-display text-xl font-medium text-white transition-colors hover:text-ash-300 md:text-3xl"
              >
                {site.email}
                <ArrowUpRight
                  size={22}
                  className="text-ash-500 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                />
              </a>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 space-y-3 font-mono text-sm text-ash-400">
                <a
                  href={`tel:${site.phone}`}
                  data-cursor="hover"
                  className="flex items-center gap-3 transition-colors hover:text-white"
                >
                  <Phone size={15} className="text-ash-600" />
                  {site.phone}
                </a>
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-ash-600" />
                  {site.location}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex gap-3">
                {Object.values(site.socials).map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="rounded-full border border-white/10 px-4 py-2 font-mono text-xs uppercase tracking-widest text-ash-400 transition-colors hover:border-white/30 hover:text-white"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — form */}
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-8 md:p-10">
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex min-h-[22rem] flex-col items-center justify-center text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-iris-400/40 bg-iris-500/10 text-iris-300">
                      <Check size={26} />
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-medium text-white">
                      Message sent
                    </h3>
                    <p className="mt-2 max-w-xs font-light text-ash-400">
                      Thanks for reaching out — I&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      data-cursor="hover"
                      className="mt-8 font-mono text-xs uppercase tracking-widest text-ash-400 transition-colors hover:text-white"
                    >
                      Send another →
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-7"
                  >
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@example.com"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className={labelClass}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={update("message")}
                        placeholder="Tell me about your project..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {status === "error" && (
                      <p className="font-mono text-xs text-red-400">{error}</p>
                    )}

                    <Magnetic strength={0.3}>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        data-cursor="hover"
                        className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-ink-950 transition-colors hover:bg-ash-100 disabled:opacity-60"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send message
                            <Send
                              size={15}
                              className="transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
