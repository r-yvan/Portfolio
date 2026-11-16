import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp } from "@/lib/auth/guard";
import { revalidateInbox } from "@/lib/content";
import { storageKind, storeMessage } from "@/lib/content/storage";
import { canSeal, seal } from "@/lib/crypto";
import { rateLimit } from "@/lib/rate-limit";

const MessageSchema = z.object({
  name: z.string().trim().min(1, "Please add your name.").max(100),
  email: z.string().trim().email("Please use a valid email.").max(200),
  message: z.string().trim().min(10, "Your message is a little short.").max(5000),
  website: z.string().max(0).optional().default(""), // honeypot
  elapsed: z.number().optional(),
});

/**
 * Contact form → admin inbox. Messages are AES-GCM encrypted before they're
 * stored (see lib/crypto.ts). Bots get a fake success so they don't retry.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  const elapsed = typeof raw?.elapsed === "number" ? raw.elapsed : 0;
  if ((typeof raw?.website === "string" && raw.website.length > 0) || elapsed < 2500) {
    return NextResponse.json({ ok: true }); // honeypot / too-fast submit
  }

  const parsed = MessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form." },
      { status: 400 },
    );
  }

  if (!rateLimit(`contact:${clientIp()}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again in a few minutes." },
      { status: 429 },
    );
  }

  const { name, email, message } = parsed.data;
  const record = {
    name,
    email,
    message,
    userAgent: request.headers.get("user-agent")?.slice(0, 200) ?? "",
  };

  try {
    if (storageKind() === "readonly" || !canSeal()) {
      // No writable storage / secret on this deployment — keep the old
      // behaviour (logs) rather than failing the visitor.
      console.warn("[contact] inbox unavailable — message logged only", { name, email });
      console.log("[contact]", record);
      return NextResponse.json({ ok: true });
    }
    await storeMessage(seal(record));
    revalidateInbox();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact] failed to store message", error);
    return NextResponse.json({ ok: false, error: "Couldn't send right now — please email me directly." }, { status: 500 });
  }
}
