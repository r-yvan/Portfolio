import { NextResponse } from "next/server";

/**
 * Contact form endpoint. Validates input and (for now) logs the message.
 * Phase 2 wires this to the database so messages appear in the admin inbox.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailValid || message.length < 10) {
      return NextResponse.json(
        { ok: false, error: "Please provide a name, valid email, and a message." },
        { status: 400 },
      );
    }

    // TODO (phase 2): persist to database + notify admin inbox.
    console.log("[contact]", { name, email, message });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong." },
      { status: 500 },
    );
  }
}
