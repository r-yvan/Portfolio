import type { Metadata } from "next";
import { InboxList } from "@/components/admin/InboxList";
import { Notice, PageHeader } from "@/components/admin/SaveBar";
import { requireAdmin } from "@/lib/auth/guard";
import { isWritable } from "@/lib/content";
import { readInbox } from "@/lib/content/inbox";
import { canSeal } from "@/lib/crypto";

export const metadata: Metadata = { title: "Inbox" };
export const dynamic = "force-dynamic";

export default async function InboxPage() {
  await requireAdmin();
  let messages: Awaited<ReturnType<typeof readInbox>> = [];
  let error = "";
  try {
    messages = await readInbox();
  } catch (err) {
    console.error("[admin] inbox read failed", err);
    error = "Couldn't load messages from storage.";
  }
  const writable = isWritable();

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Messages from your contact form. They're stored encrypted — only this admin can read them."
      />
      {!writable ? (
        <Notice tone="warn">
          This deployment has no writable storage, so new contact messages are only written to the server logs.
          Connect a Vercel Blob store (see Settings) to collect them here.
        </Notice>
      ) : null}
      {!canSeal() ? <Notice tone="warn">ADMIN_SECRET is missing or too short — messages can't be encrypted or read.</Notice> : null}
      {error ? <Notice tone="warn">{error}</Notice> : null}
      <InboxList messages={messages} writable={writable} />
    </>
  );
}
