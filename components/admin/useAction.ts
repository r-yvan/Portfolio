"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ActionResult } from "@/lib/admin-types";
import { toast } from "./toast";

/** Run a server action with pending state, toasts and field errors. */
export function useAction<A extends unknown[], T>(action: (...args: A) => Promise<ActionResult<T>>) {
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = useCallback(
    async (...args: A): Promise<ActionResult<T>> => {
      setPending(true);
      try {
        const result = await action(...args);
        if (!mounted.current) return result;
        if (result.ok) {
          setFieldErrors({});
          if (result.message) toast.success(result.message);
        } else {
          setFieldErrors(result.fieldErrors ?? {});
          toast.error(result.error);
        }
        return result;
      } catch {
        const result: ActionResult<T> = { ok: false, error: "Network error — check your connection and try again." };
        toast.error(result.error);
        return result;
      } finally {
        if (mounted.current) setPending(false);
      }
    },
    [action],
  );

  return { run, pending, fieldErrors, setFieldErrors };
}

/** Track unsaved changes against a baseline and warn before leaving. */
export function useDirty<T>(value: T, baseline: T) {
  const dirty = JSON.stringify(value) !== JSON.stringify(baseline);
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  return dirty;
}
