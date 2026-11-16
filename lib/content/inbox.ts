import "server-only";
import { unstable_cache } from "next/cache";
import { unseal } from "@/lib/crypto";
import { INBOX_TAG } from "./index";
import { countMessages, listMessages } from "./storage";

export type InboxMessage = {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  message: string;
  unreadable?: boolean;
};

type SealedRecord = { name: string; email: string; message: string };

/** Decrypted inbox, newest first. */
export async function readInbox(limit = 200): Promise<InboxMessage[]> {
  const stored = await listMessages(limit);
  return stored.map((record) => {
    const data = unseal<SealedRecord>(record.payload);
    if (!data) {
      return {
        id: record.id,
        receivedAt: record.receivedAt,
        name: "Unreadable message",
        email: "",
        message: "This message was encrypted with a different ADMIN_SECRET and can't be decrypted.",
        unreadable: true,
      };
    }
    return { id: record.id, receivedAt: record.receivedAt, name: data.name, email: data.email, message: data.message };
  });
}

export const inboxCount = unstable_cache(
  async () => {
    try {
      return await countMessages();
    } catch {
      return 0;
    }
  },
  ["cms-inbox-count-v1"],
  { tags: [INBOX_TAG] },
);
