"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { login } from "@/app/admin/login/actions";
import { Crosshairs } from "@/components/ui/Crosshairs";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function LoginForm({ next, configured }: { next: string; configured: boolean }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [show, setShow] = useState(false);

  const action = async (formData: FormData) => {
    setPending(true);
    setError("");
    try {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 text-fg">
      <div
        aria-hidden
        className="grid-lines absolute inset-0"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000, transparent 80%)",
          maskImage: "radial-gradient(ellipse 50% 50% at 50% 50%, #000, transparent 80%)",
        }}
      />
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-sm border border-fg/10 bg-surface"
      >
        <Crosshairs />
        <div className="flex items-center justify-between border-b border-fg/10 px-6 py-4">
          <span className="label flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-accent" /> Restricted
          </span>
          <Lock size={14} className="text-subtle" />
        </div>
        <form action={action} className="space-y-6 p-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">Admin portal</h1>
            <p className="mt-1.5 text-sm text-muted">Sign in to manage your portfolio.</p>
          </div>

          {!configured ? (
            <div className="border border-accent/40 bg-accent/[0.06] p-3 text-sm leading-relaxed">
              Set <code className="font-medium">ADMIN_PASSWORD</code> (8+ chars) and{" "}
              <code className="font-medium">ADMIN_SECRET</code> (32+ chars) in your environment, then restart the
              server.
            </div>
          ) : null}

          <input type="hidden" name="next" value={next} />
          <label className="block">
            <span className="label text-muted">Password</span>
            <span className="relative mt-2 block">
              <input
                name="password"
                type={show ? "text" : "password"}
                required
                autoFocus
                autoComplete="current-password"
                disabled={!configured || pending}
                className="input pr-11"
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-subtle hover:text-fg"
              >
                {show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </label>

          {error ? (
            <p role="alert" className="border-l-2 border-accent pl-3 text-sm text-accent">
              {error}
            </p>
          ) : null}

          <button type="submit" disabled={!configured || pending} className="btn btn-primary w-full">
            {pending ? <Loader2 size={15} className="animate-spin" /> : null}
            <span>{pending ? "Checking…" : "Enter"}</span>
            {!pending ? <ArrowRight size={15} /> : null}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
