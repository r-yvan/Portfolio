import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth/guard";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

/** Download the full content as a JSON backup. */
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getContent();
  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`${JSON.stringify(content, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="portfolio-backup-${stamp}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
