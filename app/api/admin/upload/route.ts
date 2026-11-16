import { NextResponse } from "next/server";
import { isAdmin, isSameOrigin } from "@/lib/auth/guard";
import { StorageError } from "@/lib/content/storage";
import { MAX_IMAGE_BYTES, saveImageBuffer } from "@/lib/images";

export const maxDuration = 30;

/** Admin image upload (images are already resized/compressed in the browser). */
export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Expected a file upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "Images must be 8 MB or smaller." }, { status: 413 });
  }

  const base = String(form.get("name") || file.name.replace(/\.[^.]+$/, "") || "image");
  try {
    const url = await saveImageBuffer(Buffer.from(await file.arrayBuffer()), base);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    const status = error instanceof StorageError ? 503 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
