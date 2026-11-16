import type { Metadata } from "next";
import { TestimonialsEditor } from "@/components/admin/SectionEditors";
import { requireAdmin } from "@/lib/auth/guard";
import { getContent, isWritable } from "@/lib/content";
import { defaultContent } from "@/lib/content/defaults";

export const metadata: Metadata = { title: "Testimonials" };
export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  await requireAdmin();
  const { testimonials, settings } = await getContent();
  const placeholderIds = new Set(defaultContent.testimonials.map((t) => t.id));
  return (
    <TestimonialsEditor
      initial={{ testimonials, show: settings.showTestimonials }}
      writable={isWritable()}
      hasPlaceholders={testimonials.some((t) => placeholderIds.has(t.id))}
    />
  );
}
